# backend/app/routers/sensors.py
import datetime
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from celery.result import AsyncResult
from typing import Dict

from .. import crud, schemas, database
from worker.celery_app import celery_app
from worker.tasks import process_csv_file

router = APIRouter(
    prefix="/api/v1",
    tags=["sensors"],
)

@router.post("/sensors/bulk", status_code=202)
async def create_bulk_sensor_readings(
    file: UploadFile = File(...),
):
    """
    Accepts a CSV file, starts a background processing task, and returns a task ID.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    csv_content = (await file.read()).decode('utf-8')
    task = process_csv_file.delay(csv_content)
    
    return JSONResponse({"task_id": task.id})

@router.get("/tasks/{task_id}")
def get_task_status(task_id: str):
    """
    Retrieves the status of a background task.
    """
    task_result = AsyncResult(task_id, app=celery_app)
    
    response = {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result
    }
    return JSONResponse(response)

@router.post("/sensors", response_model=schemas.SensorReading)
def create_sensor_reading(
    reading: schemas.SensorReadingCreate, db: Session = Depends(database.get_db)
):
    """
    Ingests a single sensor reading.
    """
    return crud.create_sensor_reading(db=db, reading=reading)

@router.get("/analytics", response_model=schemas.AnalyticsData)
def read_analytics(
    db: Session = Depends(database.get_db),
    field_id: int = Query(...),
    sensor_type: str = Query(...),
    start: datetime.datetime = Query(None),
    end: datetime.datetime = Query(None)
):
    """
    Gets aggregated analytics for a sensor.
    """
    if end is None: end = datetime.datetime.utcnow()
    if start is None: start = end - datetime.timedelta(days=1)
    analytics_data = crud.get_analytics(db, field_id=field_id, sensor_type=sensor_type, start_time=start, end_time=end)
    if not analytics_data or analytics_data.count == 0:
        raise HTTPException(status_code=404, detail="No data found for the specified criteria")
    return analytics_data

@router.get("/readings/chart")
def get_chart_data(
    db: Session = Depends(database.get_db),
    field_id: int = Query(1),
    hours: int = Query(24)
):
    """
    Provides data formatted for time-series charts.
    """
    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(hours=hours)
    temp_readings = crud.get_readings_for_chart(db, field_id, "temperature", start_time, end_time)
    moisture_readings = crud.get_readings_for_chart(db, field_id, "soil_moisture", start_time, end_time)
    
    combined_data: Dict[str, Dict] = {}
    for ts, value in temp_readings:
        time_key = ts.strftime('%Y-%m-%d %H:%M')
        if time_key not in combined_data: combined_data[time_key] = {'time': ts.strftime('%H:%M')}
        combined_data[time_key]['temperature'] = value
    for ts, value in moisture_readings:
        time_key = ts.strftime('%Y-%m-%d %H:%M')
        if time_key not in combined_data: combined_data[time_key] = {'time': ts.strftime('%H:%M')}
        combined_data[time_key]['soil_moisture'] = value
        
    return sorted(list(combined_data.values()), key=lambda x: x['time'])
