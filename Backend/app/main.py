import os
import datetime
import csv
import io
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict

from . import crud, models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Field Insights API",
    description="API for ingesting and analyzing sensor data from agricultural fields.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/readings/chart", tags=["readings"])
def get_chart_data(
    db: Session = Depends(database.get_db),
    field_id: int = Query(1, description="ID of the field for chart data"),
    hours: int = Query(24, description="Number of past hours to retrieve data for")
):
    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(hours=hours)

    temp_readings = crud.get_readings_for_chart(db, field_id, "temperature", start_time, end_time)
    moisture_readings = crud.get_readings_for_chart(db, field_id, "soil_moisture", start_time, end_time)

    combined_data: Dict[str, Dict] = {}

    for ts, value in temp_readings:
        time_key = ts.isoformat()
        if time_key not in combined_data:
            combined_data[time_key] = {'time': ts.strftime('%H:%M')}
        combined_data[time_key]['temperature'] = value

    for ts, value in moisture_readings:
        time_key = ts.isoformat()
        if time_key not in combined_data:
            combined_data[time_key] = {'time': ts.strftime('%H:%M')}
        combined_data[time_key]['soil_moisture'] = value
    
    if not combined_data:
        return []

    sorted_keys = sorted(combined_data.keys())
    sorted_chart_data = [combined_data[key] for key in sorted_keys]
    
    return sorted_chart_data


@app.post("/api/v1/sensors/bulk", tags=["sensors"])
async def create_bulk_sensor_readings(
    file: UploadFile = File(...), db: Session = Depends(database.get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    try:
        contents = await file.read()
        buffer = io.StringIO(contents.decode('utf-8'))
        csv_reader = csv.DictReader(buffer)
        readings_to_create = []
        checked_fields = set()
        for row in csv_reader:
            field_id = int(row['field_id'])
            if field_id not in checked_fields:
                db_field = db.query(models.Field).filter(models.Field.id == field_id).first()
                if not db_field:
                    db_field = models.Field(id=field_id, name=f"Field {field_id}")
                    db.add(db_field)
                    db.commit()
                checked_fields.add(field_id)
            reading_dict = {
                'field_id': field_id,
                'sensor_type': row['sensor_type'],
                'value': float(row['value']),
                'unit': row['unit'],
            }
            timestamp_val = row.get('timestamp')
            if timestamp_val:
                reading_dict['timestamp'] = timestamp_val
            reading_data = schemas.SensorReadingCreate(**reading_dict)
            crud.create_sensor_reading(db=db, reading=reading_data)
            readings_to_create.append(reading_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV file: {e}")
    return {"message": f"Successfully ingested {len(readings_to_create)} readings from CSV."}


@app.post("/api/v1/sensors", response_model=schemas.SensorReading, tags=["sensors"])
def create_sensor_reading(
    reading: schemas.SensorReadingCreate, db: Session = Depends(database.get_db)
):
    db_field = db.query(models.Field).filter(models.Field.id == reading.field_id).first()
    if not db_field:
        db_field = models.Field(id=reading.field_id, name=f"Field {reading.field_id}")
        db.add(db_field)
        db.commit()
    return crud.create_sensor_reading(db=db, reading=reading)


@app.get("/api/v1/analytics", response_model=schemas.AnalyticsData, tags=["sensors"])
def read_analytics(
    db: Session = Depends(database.get_db),
    field_id: int = Query(...),
    sensor_type: str = Query(...),
    start: datetime.datetime = Query(None),
    end: datetime.datetime = Query(None)
):
    if end is None: end = datetime.datetime.utcnow()
    if start is None: start = end - datetime.timedelta(days=1)
    analytics_data = crud.get_analytics(db, field_id=field_id, sensor_type=sensor_type, start_time=start, end_time=end)
    if not analytics_data:
        raise HTTPException(status_code=404, detail="No data found for the specified criteria")
    return analytics_data


@app.get("/")
def read_root():
    return {"message": "Welcome to the Field Insights API v2 - CORS Fixed"}
