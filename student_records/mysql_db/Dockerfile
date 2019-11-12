#Load the official mysql image automatically
FROM mysql:5.7

WORKDIR ./
COPY init_db.sql /docker-entrypoint-initdb.d/

