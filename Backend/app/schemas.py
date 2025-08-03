from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

class SensorReadingCreate(BaseModel):
    field_id: int
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime = None

class SensorReading(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    field_id: int
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime

class SensorReadingBulk(BaseModel):
    readings: List[SensorReadingCreate]

class AnalyticsData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    min: float
    max: float
    avg: float
    count: int
