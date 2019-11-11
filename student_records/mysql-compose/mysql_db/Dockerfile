#Load the official mysql image automatically
FROM mysql
#populate the db with the file "init_db.sql" stored on the host machine.
# "/docker-entrypoint-initdb.d/" is a path INSIDE the container
COPY init_db.sql /docker-entrypoint-initdb.d/
