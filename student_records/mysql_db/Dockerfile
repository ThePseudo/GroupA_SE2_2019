#Load the official mysql image automatically
FROM mysql

WORKDIR .
COPY init_db.sql /docker-entrypoint-initdb.d/

