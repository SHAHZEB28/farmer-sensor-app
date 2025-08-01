# worker/tasks.py

from celery_app import celery_app
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
import os
import csv
import io
from datetime import datetime, timedelta

# In a larger project, models and schemas would be in a shared library.
# For this project, we redefine them to ensure the worker is self-contained.
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from pantic import BaseModel

Base = declarative_base()

class Field(Base):
    __tablename__ = "fields"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True)
    field_id = Column(Integer, ForeignKey("fields.id"))
    sensor_type = Column(String)
    value = Column(Float)
    unit = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class HourlyAnalytics(Base):
    __tablename__ = "hourly_analytics"
    id = Column(Integer, primary_key=True)
    field_id = Column(Integer)
    sensor_type = Column(String)
    hour_timestamp = Column(DateTime)
    min_value = Column(Float)
    max_value = Column(Float)
    avg_value = Column(Float)
    reading_count = Column(Integer)

class SensorReadingCreate(BaseModel):
    field_id: int
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime = None

# --- Database Connection ---
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db/field_insights_db")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Celery Tasks ---

@celery_app.task(bind=True)
def process_csv_file(self, csv_content: str):
    """
    Celery task to process a CSV file's content in the background, with progress updates.
    """
    db = SessionLocal()
    try:
        buffer = io.StringIO(csv_content)
        # Read once to get total for progress tracking
        total_rows = sum(1 for row in csv.DictReader(io.StringIO(csv_content)))
        buffer.seek(0)
        csv_reader = csv.DictReader(buffer)
        
        processed_rows = 0
        for row in csv_reader:
            field_id = int(row['field_id'])
            db_field = db.query(Field).filter(Field.id == field_id).first()
            if not db_field:
                db.add(Field(id=field_id, name=f"Field {field_id}"))
                db.commit()

            reading_dict = {k:v for k,v in row.items() if v}
            reading = SensorReadingCreate(**reading_dict)
            db_reading = SensorReading(**reading.model_dump())
            db.add(db_reading)
            db.commit()
            
            processed_rows += 1
            self.update_state(state='PROGRESS', meta={'current': processed_rows, 'total': total_rows})

        return {'current': total_rows, 'total': total_rows, 'status': 'Completed!'}
    except Exception as e:
        self.update_state(state='FAILURE', meta={'exc_type': type(e).__name__, 'exc_message': str(e)})
        return {'status': 'Failed'}
    finally:
        db.close()

@celery_app.task
def process_hourly_analytics():
    """
    Celery task to calculate and store hourly analytics for all sensors.
    """
    db = SessionLocal()
    try:
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        start_time = one_hour_ago.replace(minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)

        results = db.query(
            SensorReading.field_id,
            SensorReading.sensor_type,
            func.min(SensorReading.value).label("min_val"),
            func.max(SensorReading.value).label("max_val"),
            func.avg(SensorReading.value).label("avg_val"),
            func.count(SensorReading.id).label("count_val")
        ).filter(
            SensorReading.timestamp >= start_time,
            SensorReading.timestamp < end_time
        ).group_by(
            SensorReading.field_id,
            SensorReading.sensor_type
        ).all()

        for res in results:
            analytic = HourlyAnalytics(
                field_id=res.field_id,
                sensor_type=res.sensor_type,
                hour_timestamp=start_time,
                min_value=res.min_val,
                max_value=res.max_val,
                avg_value=res.avg_val,
                reading_count=res.count_val
            )
            db.add(analytic)
        
        db.commit()
        return f"Processed {len(results)} analytic records for hour {start_time}."
    finally:
        db.close()

# Schedule the hourly analytics task
celery_app.conf.beat_schedule = {
    'run-hourly-analytics-every-hour': {
        'task': 'tasks.process_hourly_analytics',
        'schedule': 3600.0, # Run every hour
    },
}
