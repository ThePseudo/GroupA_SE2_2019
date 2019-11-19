-- CREATE DATABASE IF NOT EXISTS test_db;
-- 
-- ALTER USER 'root'@'db' IDENTIFIED WITH mysql_native_password BY 'pwd'

-- ENTITIES

CREATE TABLE teacher
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access INT NOT NULL
);

CREATE TABLE parent
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access INT NOT NULL
);

CREATE TABLE student
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    class_id INT,
    parent_1 INT,
    parent_2 INT
);
INSERT INTO student (id, first_name, last_name,cod_fisc,parent_1,parent_2)
VALUES (1,"Marco","Pecoraro","00000000",1,2);

-- Classes

CREATE TABLE class
(
    id INT PRIMARY KEY,
    class_name VARCHAR(2) UNIQUE NOT NULL
);

INSERT INTO class
    (id,class_name)
VALUES(1, "1A");

INSERT INTO class
    (id,class_name)
VALUES(2, "1B");

INSERT INTO class
    (id,class_name)
VALUES(3, "1C");

-- courses

CREATE TABLE course
(
    id INT PRIMARY KEY ,
    course_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO course
    (id,course_name)
VALUES
    (1, 'Math');

INSERT INTO course
    (id,course_name)
VALUES
    (2, 'History');

INSERT INTO course
    (id,course_name)
VALUES
    (3, 'Science');

CREATE TABLE admin
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE note
(
    id INT NOT NULL,
    student_id INT,
    note_date DATE,
    PRIMARY KEY(id, student_id, note_date)
);

CREATE TABLE topic
(
    id INT NOT NULL,
    topic_date VARCHAR(20) UNIQUE NOT NULL,
    id_class INT,
    id_course INT,
    description TEXT NOT NULL,
    PRIMARY KEY(id, id_class, id_course)
);


-- Marks

CREATE TABLE mark
(
    id INT NOT NULL,
    student_id INT,
    course_id INT,
    score INT NOT NULL,
    date_mark DATE NOT NULL,
    PRIMARY KEY(id, student_id, course_id)
);


INSERT INTO mark
    (id,student_id, course_id, score, date_mark)
VALUES
    (1, 1, 1, 6, '2019-9-10');

INSERT INTO mark
    (id,student_id, course_id, score, date_mark)
VALUES
    (2, 1, 2, 8, '2019-9-11');

INSERT INTO mark
    (id,student_id, course_id, score, date_mark)
VALUES
    (3, 1, 3, 10, '2019-9-12');

-- RELATIONS

CREATE TABLE student_class
(
    student_id INT,
    class_id INT,
    year INT,
    PRIMARY KEY(student_id, class_id, year)
);

CREATE TABLE teacher_course_class
(
    teacher_id INT,
    course_id INT,
    class_id INT,
    year INT,
    PRIMARY KEY(teacher_id, course_id, class_id, year)
);

-- FOR TORCHIANO - 12/11/19
-- 
-- CREATE TABLE states
-- (
--     code VARCHAR(2) PRIMARY KEY,
--     taxes INT NOT NULL
-- );
-- 
-- 
-- INSERT INTO states
-- VALUES('UT', 685);
-- INSERT INTO states
-- VALUES('NV', 800);
-- INSERT INTO states
-- VALUES('TX', 625);
-- INSERT INTO states
-- VALUES('AL', 400);
-- INSERT INTO states
-- VALUES('CA', 825);
-- 
-- CREATE TABLE discounts
-- (
--     threshold INT PRIMARY KEY,
--     discount INT NOT NULL
-- );
-- 
-- INSERT INTO discounts
-- VALUES(1000, 3);
-- INSERT INTO discounts
-- VALUES(5000, 5);
-- INSERT INTO discounts
-- VALUES(7000, 7);
-- INSERT INTO discounts
-- VALUES(10000, 10);
-- INSERT INTO discounts
-- VALUES(50000, 15);