run:
    cd student_records
    docker-compose down
    docker-compose build
    docker-compose up -d
    cd ..