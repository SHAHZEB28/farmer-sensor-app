# backend/tests/test_api.py

from fastapi.testclient import TestClient
import os
import pytest # Import pytest to use its features

# The 'client' fixture is automatically provided by conftest.py
def test_create_sensor_reading(client: TestClient):
    """
    Test creating a single sensor reading.
    """
    response = client.post(
        "/api/v1/sensors",
        json={
            "field_id": 1,
            "sensor_type": "temperature",
            "value": 25.5,
            "unit": "°C"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["field_id"] == 1
    assert data["value"] == 25.5

def test_get_analytics_no_data(client: TestClient):
    """
    Test that the analytics endpoint returns 404 when no data exists.
    This will now pass because the database is guaranteed to be empty.
    """
    response = client.get("/api/v1/analytics?field_id=1&sensor_type=temperature")
    assert response.status_code == 404

def test_get_analytics_with_data(client: TestClient):
    """
    Test the analytics endpoint after posting some data.
    """
    client.post("/api/v1/sensors", json={"field_id": 1, "sensor_type": "temperature", "value": 20, "unit": "°C"})
    client.post("/api/v1/sensors", json={"field_id": 1, "sensor_type": "temperature", "value": 30, "unit": "°C"})

    response = client.get("/api/v1/analytics?field_id=1&sensor_type=temperature")
    assert response.status_code == 200
    data = response.json()
    assert data["min"] == 20
    assert data["max"] == 30
    # THE FIX: Use pytest.approx to handle floating point numbers
    assert data["avg"] == pytest.approx(25.0)
    assert data["count"] == 2

def test_bulk_upload_csv(client: TestClient):
    """
    Test uploading a CSV file.
    """
    csv_content = "field_id,sensor_type,value,unit\n1,temperature,22,C\n1,soil_moisture,60,%"
    
    # Use an in-memory file instead of writing to disk
    from io import BytesIO
    file_content = BytesIO(csv_content.encode('utf-8'))
    
    response = client.post(
        "/api/v1/sensors/bulk",
        files={"file": ("test_upload.csv", file_content, "text/csv")}
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Successfully ingested 2 readings from CSV."}

    # Verify the data was added
    analytics_response = client.get("/api/v1/analytics?field_id=1&sensor_type=temperature")
    assert analytics_response.status_code == 200
    # THE FIX: The count will now correctly be 1 because the database is clean for this test.
    assert analytics_response.json()["count"] == 1
