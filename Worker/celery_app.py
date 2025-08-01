# worker/celery_app.py

from celery import Celery
import os

redis_url = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")

celery_app = Celery(
    "tasks",
    broker=redis_url,
    backend=redis_url,
    include=["tasks"] # <-- Changed from "worker.tasks" to just "tasks"
)

celery_app.conf.update(
    task_track_started=True,
)
