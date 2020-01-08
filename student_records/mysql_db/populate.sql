SET CHARSET utf8mb4;

-- Teacher
INSERT INTO teacher
    (first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    ("Elena", "Baralis", "AV85T", "elena.baralis.polito@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Marina", "Indri", "RVEQXX32E18B392G", "marina64@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Giulio", "Barilli", "GB78A", "giulio.barilli@hotmail.it", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Vittorio", "Labate", "VL60B", "labate60@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

-- Officer
INSERT INTO officer
    (first_name,last_name,cod_fisc,email,password,first_access, principal)
VALUES
    ("Giorno", "Giovanna", "CP80X", "giovanna80@hotmail.it", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0),
    ("Tommaso", "Bodda", "FTEZMF95C47E840N", "bodda75@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0);

-- Parent
INSERT INTO parent
    (first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    ("Alberto", "Rossi", "1111", "alberto.rossi@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Stefania", "Lucci", "2222", "stefania.lucci@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),    
    ("Pietro", "Gasparini", "HDDRWU63L46D667M", "pietro.gaspa@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Alessia", "Ciani", "AC70A", "alessia70@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Jotaro", "Kujo", "DZJVSL56R55D763T", "jotaro77@hotmail.it", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Lucia", "Benzio", "LB75A", "lucia.benzio@hotmail.it", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

-- Student
INSERT INTO student
    (first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    ("Angelo", "Rossi", "NJRGTD35P14B145Z", 1, 1, 2),
    ("Martino", "Rossi", "RLIZFH80S05E249F", 8, 1, 2),
    ("Giorgia", "Rossi", "JDKDMY59L04H816S", 10, 1, 2),
    ("Serena", "Gasparini", "BSOWTD48P60F492T", 3, 3, 4),
    ("Alessandro", "Gasparini", "PPPGDD76L56E934Y",NULL, 3, 4),
    ("Francesca", "Kujo", "DVBGDD76L56E934Y", 12, 5, 6),
    ("Alessandra", "Kujo", "AAAGDD76L56E934Y",NULL, 5, 6);

-- Class
INSERT INTO class
    (class_name)
VALUES
    ("1A"),
    ("2A"),
    ("3A"),
    ("4A"),
    ("5A"),
    ("1B"),
    ("2B"),
    ("3B"),
    ("4B"),
    ("5B"),
    ("1C"),
    ("2C"),
    ("3C"),
    ("4C"),
    ("5C");

-- Course
INSERT INTO course
    (course_name, color)
VALUES
    ('Mathematics', 'FF0000'),
    ('English', '008080'),
    ('History', '5b4ce0'),
    ('Geography', '00FFFF'),
    ('Science', '00FF00'),
    ('Art', '008000'),
    ('Music', '09a0ba'),
    ('Physical Education', '099e22');

-- Admin
INSERT INTO admin
    (first_name,last_name,cod_fisc,email,password)
VALUES
    ("Giovanni", "Ghirotti", "GG72A", "giova.ghirotti@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO"),
    ("Arturo", "Marzano", "AM68A", "arturo.marzano@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO");

-- Note
INSERT INTO note
    (student_id, teacher_id, note_date, motivation, justified)
VALUES
    (1, 1, "2019-09-30", "L'alunno fa rumore in classe", 1),
    (2, 2, "2019-10-19", "L'alunno disturba il compagno di banco", 0),
    (3, 3, "2019-11-29", "L'alunno corre nel corridoio", 0),
    (1, 4, "2019-12-18", "L'alunno fa ANCORA rumore in classe", 0),
    (2, 1, "2019-10-28", "L'alunno risponde maleducatamente all'insegnante", 1),
    (4, 2, "2019-11-07", "L'alunno corre nel corridoio", 0),
    (6, 3, "2019-12-03", "L'alunno gioca con il telefono durante la lezione", 1);

-- Absence
INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(1, "2019-11-30", "Absent", 1);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(2, "2019-10-10", "Absent", 1);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(3, "2019-12-11", "Absent", 1);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(4, "2019-12-02", "Late entry", 0);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(6, "2019-11-02", "Late entry", 0);

-- Topic
INSERT INTO topic
    ( topic_date, id_class, id_course, description)
VALUES
    ("2019-09-29", 1, 1, "numbers"),
    ("2019-12-10", 6, 1, "addition"),
    ("2019-09-30", 11, 2, "letters"),
    ("2019-10-15", 2, 3, "ancient egyptian"),
    ("2019-11-15", 10, 4, "china"),
    ("2019-12-05", 12, 5, "trees"),
    ("2019-10-22", 9, 6, "Florence"),
    ("2019-12-18", 15, 7, "classic"),
    ("2019-10-30", 3, 8, "basket");

-- Homework
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (1, 1, "Ex 2-3 pag 15", "2019-09-29");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (2, 11, "Ex 1 pag 10", "2019-09-30");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (3, 2, "Study pages 10-12", "2019-10-15");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (4, 10, "Study pages 20-21", "2019-11-15");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (5, 12, "Study pages 30-33", "2019-12-05");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (6, 9, "Study pages 5-6-7", "2019-10-22");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (7, 15, "Study pages 12-14", "2019-12-18");

-- Mark
INSERT INTO mark
    (student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (1, 1, 6, '2019-10-06', 1, 'math 1', '3 questions', 'Written'),
    (2, 2, 8, '2019-10-11', 2, 'eng 1', '4 questions', 'Oral'),
    (3, 3, 10, '2019-09-28', 1, 'history 1', '3 questions', 'Oral'),
    (4, 4, 9, '2019-12-12', 2, 'geography 2', '2 questions', 'Written'),
    (6, 5, 7, '2019-12-16', 1, 'science 2', '3 questions', 'Oral'),
    (1, 6, 6, '2019-09-22', 2, 'art 1', 'practice test', 'Other'),
    (2, 7, 8, '2019-09-29', 1, 'music 1', 'practice test', 'Other'),
    (3, 8, 9, '2019-11-15', 1, 'run', 'test 1000m', 'Other');
    
-- General communication -- DA QUIIIIIIIIIII!
INSERT INTO General_Communication
    (communication, comm_date)
VALUES
    ("2 million euros for a 5 years grant at Politecnico di Torino to pave new routes for the design of innovative materials with various technological applications. Giovanni Maria Pavan has been awarded a prestigious European Research Council (ERC) Consolidator Grant with his research project DYNAPOL - Modeling approaches toward bioinspired dynamic materials", '2019-11-26'),
    ("In order to raise awareness inside our University on the wide variation of this concept, adv. Arianna Enrichens, Politecnico Confidential Counsellor, prepared a short video to inform the community about verbal violence on the web as well as on social media.o", '2019-11-26'),
    ("See the pdf on site", '2019-11-27');


-- Teacher-course-class
INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES
    (1, 1, 1, 2019),
    (1, 3, 1, 2019),
    (1, 3, 2, 2019),
    (2, 4, 2, 2019),
    (2, 5, 1, 2019);

-- timetable
INSERT INTO timetable
    (start_time_slot, teacher_id, course_id, class_id,day)
VALUES
    (1,1,1,1,1),
    (1,1,3,1,2),
    (1,1,3,1,3),
    (4,1,3,1,3),
    (3,1,3,2,3),
    (2,2,4,2,1),
    (2,2,4,2,2),
    (4,2,5,1,5);

