# Instructions

## Build

docker image build -t students:1.0 .

## Start

docker container run --publish 8000:8000 --detach --name student students:1.0

## Stop

docker container rm --force student

## Usage

Open browser at address:

<http://localhost:8000/>

## See logs

### Windows

docker logs $(docker ps -aq --filter name=student)

### Linux

docker logs $(sudo docker ps -aq --filter name=student)

## Use cases 

Use cases can be found [here](../use_cases/sprint1.md).