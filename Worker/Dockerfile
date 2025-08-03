FROM python:3.9-slim-buster

WORKDIR /worker_code

COPY ./requirements.txt /worker_code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /worker_code/requirements.txt

COPY . /worker_code/

CMD ["celery", "-A", "worker.celery_app", "worker", "--loglevel=info"]