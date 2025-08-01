# backend/Dockerfile

FROM python:3.9-slim-buster

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code
COPY ./app /code/app

# THE FIX: Copy the tests directory as well
COPY ./tests /code/tests

# Set the python path so imports work correctly
ENV PYTHONPATH=/code

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
