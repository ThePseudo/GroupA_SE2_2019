run:
    cd student_records
    docker-compose down
    docker-compose build
    docker-compose up -d
    cd ..
recover_run:
    cd student_records
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    cd ..
fg_run:
    cd student_records
    docker-compose downche