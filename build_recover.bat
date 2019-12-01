@ECHO OFF
CD student_records
docker container rm --force students
docker image build -t students:1.0 . --no-cache
docker run -it -p 8080:8080 -p 8000:8000 --name students students:1.0
CD ..
@ECHO ON