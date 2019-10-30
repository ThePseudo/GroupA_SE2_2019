# Build

docker image build -t students:1.0 .

# Start

docker container run --publish 8000:8000 --detach --name student students:1.0

# Stop

docker container rm --force student