# api/Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY . /app

RUN pip install flask flask-cors flask-jwt-extended
RUN pip install pwdlib
RUN pip install mysql-connector-python

CMD ["python", "app.py"]