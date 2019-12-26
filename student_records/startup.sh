#!/bin/bash
echo "Starting MySql"
dpkg-reconfigure mysql-server-5.7 > /dev/null 2>&1
service mysql start > /dev/null 2>&1
mkdir -p ./uploads/materials
mysql -u root "-ppwd" -e "Alter USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pwd'" > /dev/null 2>&1
mysql -u root "-ppwd" -e "CREATE DATABASE students; USE students;" > /dev/null 2>&1
mysql -u root "-ppwd" students -e "source ./db/init_db.sql"
mysql -u root "-ppwd" students -e "source ./db/populate.sql"
echo "MySql Ok"
rm -rf ./db
rm -f startup.sh
echo "Starting Node"
node server.js &
/bin/bash