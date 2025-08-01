# backend/tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app, database
from app.models import Base

# Use a pure in-memory SQLite database.
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """Dependency override to use the in-memory test database."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[database.get_db] = override_get_db

@pytest.fixture()
def client():
    """
    A fixture that creates a fresh, empty database for every single test.
    """
    # THE FIX: Create and drop tables inside the fixture for each test.
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

