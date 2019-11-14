@ECHO OFF
CD student_records
docker-compose down
docker-compose build
docker-compose up -d
CD ..
@ECHO ON