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

INSERT INTO parent
    (id, first_name, last_name, cod_fisc, email, password, first_access)
VALUES
    (1, "Alessio", "Pecoraro", "lsspcr", "a@a.a", "a", 0);

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

INSERT INTO student
    (id, first_name, last_name, cod_fisc, class_id, parent_1)
VALUES
    (1, "Marco", "Pecoraro", "PCRMRC95C02L219X", 1, 1);

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
    id INT PRIMARY KEY,
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
    id INT,
    student_id INT NOT NULL,
    note_date DATE NOT NULL,
    motivation TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE topic
(
    id INT UNIQUE NOT NULL,
    topic_date DATE NOT NULL,
    id_class INT NOT NULL,
    id_course INT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY(id, topic_date, id_class, id_course)
);

-- Marks

CREATE TABLE mark
(
    id INT UNIQUE NOT NULL,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    score INT NOT NULL,
    date_mark DATE NOT NULL,
    PRIMARY KEY(id)
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