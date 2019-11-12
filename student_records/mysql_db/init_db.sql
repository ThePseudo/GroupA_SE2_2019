-- CREATE DATABASE IF NOT EXISTS test_db;
-- 
-- ALTER USER 'root'@'db' IDENTIFIED WITH mysql_native_password BY 'pwd'

CREATE TABLE employees
(
    first_name varchar(25),
    last_name varchar(25),
    department varchar(15),
    email varchar(50)
);

INSERT INTO employees
    (first_name, last_name, department, email)
VALUES
    ('Lorenz', 'Vanthillo', 'IT', 'lvthillo@mail.com');



