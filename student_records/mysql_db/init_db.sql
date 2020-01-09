-- ENTITIES

CREATE TABLE teacher
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(16) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL,
    coordinator BOOLEAN NOT NULL
    /* coordinator aggiunto, da mettere not null una volta reso il codice tutto compatibile*/
    /* 1 first_access already done; 0 not yet */
);

CREATE TABLE officer
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(16) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL,
    principal BOOLEAN NOT NULL
);

CREATE TABLE parent
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(16) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_access BOOLEAN NOT NULL
);


CREATE TABLE student
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(16) UNIQUE NOT NULL,
    class_id INT,
    parent_1 VARCHAR(16) NOT NULL,
    parent_2 VARCHAR(16)
);

CREATE TABLE class
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(2) UNIQUE NOT NULL
);

CREATE TABLE course
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(6) UNIQUE NOT NULL
);

CREATE TABLE admin
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    cod_fisc VARCHAR(16) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE topic
(
    id INT UNIQUE NOT NULL AUTO_INCREMENT,
    topic_date DATE NOT NULL,
    id_class INT NOT NULL,
    id_course INT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY(id, topic_date, id_class, id_course)
);

CREATE TABLE note
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    note_date DATE NOT NULL,
    motivation TEXT NOT NULL,
    justified BOOLEAN NOT NULL
);

CREATE TABLE absence
(
    id INT UNIQUE NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    date_ab DATE NOT NULL,
    absence_type ENUM('Absent', 'Late entry', 'Early exit') NOT NULL,
    justified BOOLEAN NOT NULL,
    PRIMARY KEY(student_id, date_ab)
);

CREATE TABLE homework
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    description TEXT NOT NULL,
    date_hw DATE NOT NULL
);

CREATE TABLE material
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NOT NULL,
    date_mt DATE NOT NULL
);

CREATE TABLE mark
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    score FLOAT NOT NULL,
    date_mark DATE NOT NULL,
    period_mark INT NOT NULL,
    mark_subj VARCHAR(50) NOT NULL,
    descr_mark_subj VARCHAR(500),
    type_mark_subj ENUM ('Other','Written','Oral','Project')
);

CREATE TABLE General_Communication
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    communication TEXT,
    comm_date DATE
);

-- RELATIONS

-- Maybe delete (?) Not sure. TODO: review with team
CREATE TABLE student_class
(
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    year INT NOT NULL,
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


CREATE TABLE timetable
(
    start_time_slot INT NOT NULL,
    teacher_id INT NOT NULL,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    day INT NOT NULL,
    FOREIGN KEY (teacher_id,course_id,class_id) 
    REFERENCES teacher_course_class(teacher_id,course_id,class_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    PRIMARY KEY(start_time_slot,day, class_id)
);

CREATE TABLE student_final_term_grade
(
    id_student INT NOT NULL,
    id_course INT NOT NULL,
    period_term INT NOT NULL,
    period_year INT NOT NULL,
    period_grade INT NOT NULL,
    PRIMARY KEY(id_student,id_course,period_term,period_year)
);