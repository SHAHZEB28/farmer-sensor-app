
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Field(Base):
    """Model for a physical field being monitored."""
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    location = Column(String)

    readings = relationship("SensorReading", back_populates="field")

class SensorReading(Base):
    """Model for a single sensor reading."""
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    sensor_type = Column(String, index=True, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    field = relationship("Field", back_populates="readings")

class HourlyAnalytics(Base):
    """Model for storing hourly aggregated analytics."""
    __tablename__ = "hourly_analytics"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    sensor_type = Column(String, index=True, nullable=False)
    hour_timestamp = Column(DateTime, nullable=False)
    min_value = Column(Float)
    max_value = Column(Float)
    avg_value = Column(Float)
    reading_count = Column(Integer)