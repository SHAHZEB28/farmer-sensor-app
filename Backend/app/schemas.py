# backend/app/schemas.py

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

# Schema for creating a single sensor reading
class SensorReadingCreate(BaseModel):
    field_id: int
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime = None

# Schema for displaying a single sensor reading
class SensorReading(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    field_id: int
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime

# Schema for bulk ingestion of sensor readings
class SensorReadingBulk(BaseModel):
    readings: List[SensorReadingCreate]

# Schema for aggregated analytics
class AnalyticsData(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    min: float
    max: float
    avg: float
    count: int
