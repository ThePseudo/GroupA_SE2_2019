@ECHO OFF
CD student_records
docker-compose down
docker-compose build --no-cache
docker-compose up -d
CD ..
@ECHO ON