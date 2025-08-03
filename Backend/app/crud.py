
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from datetime import datetime

def get_sensor_reading(db: Session, reading_id: int):
    """Fetch a single sensor reading by its ID."""
    return db.query(models.SensorReading).filter(models.SensorReading.id == reading_id).first()

def get_sensor_readings(db: Session, skip: int = 0, limit: int = 100):
    """Fetch a paginated list of sensor readings."""
    return db.query(models.SensorReading).offset(skip).limit(limit).all()

def create_sensor_reading(db: Session, reading: schemas.SensorReadingCreate):
    """Create a new sensor reading record in the database."""
    db_reading = models.SensorReading(
        field_id=reading.field_id,
        sensor_type=reading.sensor_type,
        value=reading.value,
        unit=reading.unit,
        timestamp=reading.timestamp if reading.timestamp else datetime.utcnow()
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

def get_analytics(db: Session, field_id: int, sensor_type: str, start_time: datetime, end_time: datetime):
    """
    Fetch aggregated analytics for a specific field and sensor type within a time range.
    """
    result = db.query(
        func.min(models.SensorReading.value).label("min"),
        func.max(models.SensorReading.value).label("max"),
        func.avg(models.SensorReading.value).label("avg"),
        func.count(models.SensorReading.id).label("count")
    ).filter(
        models.SensorReading.field_id == field_id,
        models.SensorReading.sensor_type == sensor_type,
        models.SensorReading.timestamp >= start_time,
        models.SensorReading.timestamp <= end_time
    ).first()

    if not result or result.count == 0:
        return None
        
    return result

def get_readings_for_chart(db: Session, field_id: int, sensor_type: str, start_time: datetime, end_time: datetime):
    """
    Fetch a list of sensor readings for a chart, ordered by time.
    """
    return db.query(
        models.SensorReading.timestamp,
        models.SensorReading.value
    ).filter(
        models.SensorReading.field_id == field_id,
        models.SensorReading.sensor_type == sensor_type,
        models.SensorReading.timestamp >= start_time,
        models.SensorReading.timestamp <= end_time
    ).order_by(
        models.SensorReading.timestamp.asc()
    ).all()
