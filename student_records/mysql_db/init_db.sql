
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
    /* 1 first_access already done; 0 not yet */
);

INSERT INTO teacher
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (1, "Elena", "Baralis", "AV85T", "venere85@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

INSERT INTO teacher
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (2, "Marina", "Indri", "MR64Y", "marina64@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

CREATE TABLE officer
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL,
    principal BOOLEAN NOT NULL
);

INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access, principal)
VALUES
    (1, "Ciccio", "Pasticcio", "CP80X", "pasticcio80@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0);

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
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (1, "Tizio", "Caio", "1111", "tizio@caio.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

INSERT INTO parent
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (2, "Giorno", "Giovanna", "2222", "giorno@giovanna.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);
INSERT INTO parent
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (3, "Marco", "Verdi", "3333", "marco@verdi.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

CREATE TABLE student
(
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(20) UNIQUE NOT NULL,
    class_id INT,
    parent_1 INT NOT NULL,
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
    (4, "Serena", "Fetta", "GZ0OO", 2, 2, 3);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (5, "Francesca", "Fetta", "PX7OO", 2, 2, 3);

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
    course_name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(6) UNIQUE NOT NULL
);

INSERT INTO course
    (id,course_name, color)
VALUES
    (1, 'Math', 'FF0000');

INSERT INTO course
    (id,course_name, color)
VALUES
    (2, 'History', '0000FF');

INSERT INTO course
    (id,course_name, color)
VALUES
    (3, 'Science', '00FF00');

INSERT INTO course
    (id,course_name, color)
VALUES
    (4, 'Chemistry', "008080");

INSERT INTO course
    (id,course_name, color)
VALUES
    (5, 'Art', '008000');

INSERT INTO course
    (id,course_name, color)
VALUES
    (6, 'Geography', '00FFFF');


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
    (1, "Giovanni", "Rossi", "GPS67", "Rossi@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO");

CREATE TABLE topic
(
    id INT UNIQUE NOT NULL,
    topic_date DATE NOT NULL,
    id_class INT NOT NULL,
    id_course INT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY(id, topic_date, id_class, id_course)
);

INSERT INTO topic
    (id, topic_date, id_class, id_course, description)
VALUES(1, "2019-09-30", 1, 1, "Monoms");

INSERT INTO topic
    (id, topic_date, id_class, id_course, description)
VALUES(2, "2019-09-29", 2, 1, "Monoms");

INSERT INTO topic
    (id, topic_date, id_class, id_course, description)
VALUES(3, "2019-09-30", 2, 1, "Polynoms");


CREATE TABLE note
(
    id INT,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    note_date DATE NOT NULL,
    motivation TEXT NOT NULL,
    justified BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(1, 1, 1, "2019-09-30", "L'alunno fa rumore in classe", 1);

INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(2, 1, 2, "2019-09-29", "L'alunno fa ANCORA rumore in classe", 0);

INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(3, 1, 1, "2019-09-29", "L'alunno fa ANCORA rumore 3 ora provo a mettere una stringa lunga, ancora più lunga vediamo ora", 0);

INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(4, 1, 2, "2019-09-29", "L'alunno fa ANCORA rumore 4", 0);

INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(5, 1, 2, "2019-09-29", "L'alunno fa ANCORA rumore 5", 1);


INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(6, 2, 1, "2019-09-29", "L'alunno fa ANCORA rumore 4", 0);

INSERT INTO note
    (id, student_id, teacher_id, note_date, motivation, justified)
VALUES(7, 2, 2, "2019-09-29", "L'alunno fa ANCORA rumore 5", 1);


CREATE TABLE absence
(
    id INT ,
    student_id INT NOT NULL,
    date_ab DATE NOT NULL,
    start_h TIME NOT NULL,
    end_h TIME NOT NULL,
    justified BOOLEAN NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(1, 1, "2019-09-30", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(2, 1, "2019-09-29", "08:00", "13:15", 0);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(3, 1, "2019-09-30", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(4, 1, "2019-09-29", "08:00", "13:15", 0);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(5, 1, "2019-09-30", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(6, 1, "2019-09-29", "08:00", "13:15", 0);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(7, 2, "2019-09-30", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(8, 2, "2019-09-29", "08:00", "13:15", 0);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(9, 3, "2019-09-30", "08:00", "13:15", 1);

-- Homework

CREATE TABLE homework
(
    id INT UNIQUE NOT NULL,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    description TEXT NOT NULL,
    date_hw DATE NOT NULL,
    PRIMARY KEY(id)
);

-- Materials

CREATE TABLE material
(
    id INT UNIQUE NOT NULL,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NOT NULL,
    date_mt DATE NOT NULL,
    PRIMARY KEY
    (id)
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
    mark_subj VARCHAR(50),
    descr_mark_subj VARCHAR(500),
    type_mark_subj ENUM ('Other','Written','Oral','Project'),
    PRIMARY KEY(id)
);

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (1, 1, 1, 6, '2019-9-10', 1,'Chim 1','3 domande','Other');

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (2, 1, 2, 8, '2019-9-11', 2,'Chim 1','3 domande','Other');

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (3, 1, 3, 10, '2019-9-12', 1,'Chim 1','3 domande','Other');

-- RELATIONS

CREATE TABLE student_class
(
    student_id INT,
    class_id INT,
    year INT,
    PRIMARY KEY(student_id, class_id, year)
);

-- The year field refers to the starting year.
-- EX: year starting sep 2019 (case considered), year = 2019
CREATE TABLE teacher_course_class
(
    teacher_id INT NOT NULL,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    year INT NOT NULL,
    PRIMARY KEY(teacher_id, course_id, class_id, year)
);

INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES(1, 1, 1, 2019);

INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES(1, 3, 1, 2019);

INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES(1, 3, 2, 2019);

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
