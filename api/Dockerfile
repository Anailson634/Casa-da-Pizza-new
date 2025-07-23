# api/Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY . /app

RUN pip install flask
RUN pip install flask-cors
RUN pip install Flask-JWT-Extended
RUN pip install pwdlib
RUN pip install mysql-connector

CMD ["python", "app.py"]