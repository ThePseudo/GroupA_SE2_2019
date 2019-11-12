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



-- FOR TORCHIANO

CREATE TABLE states
(
    code VARCHAR(2) PRIMARY KEY,
    taxes INT NOT NULL
);


INSERT INTO states
VALUES('UT', 685);
INSERT INTO states
VALUES('NV', 800);
INSERT INTO states
VALUES('TX', 625);
INSERT INTO states
VALUES('AL', 400);
INSERT INTO states
VALUES('CA', 825);

CREATE TABLE discounts
(
    threshold INT PRIMARY KEY,
    discount INT NOT NULL
);

INSERT INTO discounts
VALUES(1000, 3);
INSERT INTO discounts
VALUES(5000, 5);
INSERT INTO discounts
VALUES(7000, 7);
INSERT INTO discounts
VALUES(10000, 10);
INSERT INTO discounts
VALUES(50000, 15);