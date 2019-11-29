
-- ENTITIES

CREATE TABLE teacher
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL
    /* 1 first_ccess already done; 0 not yet */
);

INSERT INTO teacher
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (1, "Afrodite", "Venere", "AV85T", "venere85@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

CREATE TABLE officer
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL
);

INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (1, "Ciccio", "Pasticcio", "CP80X", "pasticcio80@gmail.com", "CiccioPast80", 1);
INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (2, "Carlo", "Magno", "CM10A", "magno10@gmail.com", "CarloM10", 0);

CREATE TABLE parent
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL
);

INSERT INTO parent
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (1, "Garga", "Mella", "GM75X", "garga.mella@yahoo.com", "GargaM75", 0);
INSERT INTO parent
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (2, "Stella", "Luna", "SL78A", "stella.luna@yahoo.com", "StellaL78", 1);

INSERT INTO parent
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (3, "Tizio", "Caio", "1111", "tizio@caio.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

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
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (1, "Giove", "Zeus", "GZ03A", 2, 1, 2);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (2, "Martino", "Arte", "GPP3A", 2, 1, 2);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (3, "Martinella", "Leone", "AA03A", 2, 1, 2);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (4, "Serena", "Fetta", "GZ0OO", 2, 3, 4);

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

INSERT INTO admin
    (id,first_name,last_name,cod_fisc,email,password)
VALUES
    (1, "Giovanni", "PaoloSecondo", "GPS67", "gesu00@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO");

CREATE TABLE note
(
    id INT,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
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

CREATE TABLE absence
(
    id INT PRIMARY KEY,
    student_id INT NOT NULL,
    date_ab DATE NOT NULL,
    start_h INT NOT NULL,
    end_h INT NOT NULL,
    justified BOOLEAN NOT NULL
);

-- Marks

CREATE TABLE mark
(
    id INT UNIQUE NOT NULL,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    score INT NOT NULL,
    date_mark DATE NOT NULL,
    period_mark INT NOT NULL,
    PRIMARY KEY(id)
);


INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark)
VALUES
    (1, 1, 1, 6, '2019-9-10', 1);

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark)
VALUES
    (2, 1, 2, 8, '2019-9-11', 2);

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark)
VALUES
    (3, 1, 3, 10, '2019-9-12', 1);

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

CREATE TABLE General_Communication
(
    id INT PRIMARY KEY,
    communication TEXT,
    comm_date DATE
);

INSERT INTO General_Communication
    (id,communication, comm_date)
VALUES
    (1, "2 million euros for a 5 years grant at Politecnico di Torino to pave new routes for the design of innovative materials with various technological applications. Giovanni Maria Pavan has been awarded a prestigious European Research Council (ERC) Consolidator Grant with his research project DYNAPOL - Modeling approaches toward bioinspired dynamic materials", '2019-11-26');

INSERT INTO General_Communication
    (id,communication, comm_date)
VALUES
    (2, "In order to raise awareness inside our University on the wide variation of this concept, adv. Arianna Enrichens, Politecnico Confidential Counsellor, prepared a short video to inform the community about verbal violence on the web as well as on social media.o", '2019-11-26');

INSERT INTO General_Communication
    (id,communication, comm_date)
VALUES
    (3, "See the pdf on site", '2019-11-27');


CREATE TABLE officer
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL
);

INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (1, "Ciccio", "Pasticcio", "CP80X", "pasticcio80@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);
INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (2, "Carlo", "Magno", "CM10A", "magno10@gmail.com", "CarloM10", 0);

INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (3, "Giovanni", "PaoloSecondo", "GPS67", "gesu00@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

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
