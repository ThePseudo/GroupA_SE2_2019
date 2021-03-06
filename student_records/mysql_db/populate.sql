SET CHARSET utf8mb4;

-- Teacher
INSERT INTO teacher
    (first_name,last_name,cod_fisc,email,password,first_access,coordinator)
VALUES
    ("Elena", "Baralis", "AV85T", "elena.baralis.polito@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1,1),
    ("Marina", "Indri", "RVEQXX32E18B392G", "marina64@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1,0),
    ("Giulio", "Barilli", "GB78A", "giulio.barilli@hotmail.it", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1,0),
    ("Vittorio", "Labate", "VL60B", "labate60@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1,0);

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
    ("Martino", "Rossi", "RLIZFH80S05E249F", 1, 1, 2),
    ("Angelo", "Rossi", "NJRGTD35P14B145Z", 3, 1, 2), -- 3A
    ("Giorgia", "Rossi", "JDKDMY59L04H816S", 15, 1, 2),
    ("Serena", "Gasparini", "BSOWTD48P60F492T", 8, 3, 4), -- 3B
    ("Alessandro", "Gasparini", "PPPGDD76L56E934Y",NULL, 3, 4),
    ("Francesca", "Kujo", "DVBGDD76L56E934Y", 14, 5, 6),
    ("Alessandra", "Kujo", "AAAGDD76L56E934Y",NULL, 5, 6),
    ("Guido", "Kujo", "GKBGDD76L56E934Y", 3, 5, 6), -- 3A
    ("Luca", "Kujo", "LGOWTD48P60F492T", 8, 5, 6); -- 3B

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
    (3, 4, "2019-11-29", "L'alunno corre nel corridoio", 0),
    (1, 1, "2019-12-18", "L'alunno fa ANCORA rumore in classe", 0),
    (2, 1, "2019-10-28", "L'alunno risponde maleducatamente all'insegnante", 1),
    (4, 3, "2019-11-07", "L'alunno corre nel corridoio", 0),
    (6, 4, "2019-12-03", "L'alunno gioca con il telefono durante la lezione", 1);

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
    (topic_date, id_class, id_course, description)
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


-- General communication
INSERT INTO General_Communication
    (communication, comm_date)
VALUES
    ("See the pdf on site", '2019-10-27'),
    ("2 million euros for a 5 years grant at Politecnico di Torino to pave new routes for the design of innovative materials with various technological applications. Giovanni Maria Pavan has been awarded a prestigious European Research Council (ERC) Consolidator Grant with his research project DYNAPOL - Modeling approaches toward bioinspired dynamic materials", '2019-11-20'),
    ("In order to raise awareness inside our University on the wide variation of this concept, adv. Arianna Enrichens, Politecnico Confidential Counsellor, prepared a short video to inform the community about verbal violence on the web as well as on social media.o", '2019-11-26');


-- Teacher-course-class
INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES
    -- teacher 1
    (1, 1, 1, 2019), -- math
    (1, 1, 2, 2019),
    (1, 1, 3, 2019),
    (1, 5, 1, 2019), -- science
    (1, 5, 2, 2019),
    (1, 5, 3, 2019),
    -- teacher 2
    (2, 2, 3, 2019), -- english
    (2, 2, 4, 2019),
    (2, 2, 5, 2019),
    (2, 3, 3, 2019), -- history
    (2, 3, 4, 2019),
    (2, 3, 5, 2019),
    -- teacher 3
    (3, 4, 8, 2019), -- geog
    (3, 4, 9, 2019),
    (3, 4, 10, 2019),
    (3, 6, 8, 2019), -- art
    (3, 6, 9, 2019),
    (3, 6, 10, 2019),
    -- teacher 4
    (4, 8, 11, 2019), -- p.e.
    (4, 8, 12, 2019),
    (4, 8, 13, 2019),
    (4, 8, 14, 2019),
    (4, 8, 15, 2019);

-- timetable
INSERT INTO timetable
    (start_time_slot, teacher_id, course_id, class_id,day)
VALUES  -- example: (4,2,5,1,5),
    -- teacher 1
    (1, 1, 1, 1, 1), -- math
    (2, 1, 1, 2, 1),
    (3, 1, 1, 3, 1),
    (5, 1, 5, 1, 2), -- science
    (5, 1, 5, 2, 3),
    (5, 1, 5, 3, 4),
    -- teacher 2
    (3, 2, 2, 3, 2), -- english
    (4, 2, 2, 4, 2),
    (5, 2, 2, 5, 2),
    (2, 2, 3, 3, 3), -- history
    (2, 2, 3, 4, 4),
    (2, 2, 3, 5, 5),
    -- teacher 3
    (2, 3, 4, 8, 3), -- geog
    (3, 3, 4, 9, 3),
    (4, 3, 4, 10, 3),
    (1, 3, 6, 8, 1), -- art
    (2, 3, 6, 9, 4),
    (3, 3, 6, 10, 5),
    -- teacher 4
    (1, 4, 8, 11, 1), -- p.e.
    (2, 4, 8, 12, 1),
    (4, 4, 8, 13, 3),
    (4, 4, 8, 14, 4),
    (4, 4, 8, 15, 5);

-- Mark
INSERT INTO mark
    (student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj) -- student class / course
VALUES
    (1, 1, 6, '2019-10-06', 1, 'math 1', '3 questions', 'Written'), -- 1 / 1,5
    (1, 5, 5, '2020-04-22', 2, 'science 4', '2 questions', 'Written'), -- 1 / 1,5
    (1, 5, 6, '2020-04-27', 2, 'science 4', '2 questions', 'Written'), -- 1 / 1,5

    (2, 1, 6, '2019-10-11', 1, 'math 1', '4 questions', 'Oral'), -- 3 / 1,2,3,5
    (2, 2, 8, '2019-09-29', 1, 'eng 1', '3 questions', 'Written'), -- 3 / 1,2,3,5
    (2, 2, 9, '2019-10-20', 1, 'eng 2', '3 questions', 'Written'), -- 3 / 1,2,3,5
    (2, 3, 7, '2020-03-18', 2, 'hist 3', '2 questions', 'Oral'), -- 3 / 1,2,3,5
    (2, 5, 8, '2020-04-29', 2, 'science 4', '4 questions', 'Oral'), -- 3 / 1,2,3,5

    (3, 8, 9, '2019-11-15', 1, 'run', 'test 1000m', 'Other'), -- 15 / 8

    (4, 4, 8, '2019-12-12', 1, 'geography 2', '2 questions', 'Written'), -- 8 / 4,6
    (4, 6, 9, '2020-05-12', 2, 'portrait', 'practice test', 'Other'), -- 8 / 4,6
    
    (6, 8, 8, '2019-12-16', 1, 'run', 'test 100m', 'Other'), -- 14 / 8
    (6, 8, 8, '2020-03-15', 2, 'run', 'test 200m', 'Other'), -- 14 / 8
    
    (8, 2, 6, '2020-01-14', 1, 'eng 2', '4 questions', 'Written'), -- 3 / 1,2,3,5
    (8, 3, 7, '2020-04-12', 2, 'hist 3', '3 questions', 'Oral'), -- 3 / 1,2,3,5
    (8, 3, 6, '2020-05-12', 2, 'hist 4', '3 questions', 'Oral'); -- 3 / 1,2,3,5


-- final term grade
-- fake data angelo rosso (id 1)for parent visualization
INSERT INTO student_final_term_grade
    (id_student,id_class,id_course,period_term,period_year,period_grade)
VALUES -- example: (1,3,1,2019,5),
    (1, 1, 1, 1, '2018', 6), -- 1 / 1,5
    (1, 1, 5, 2, '2020', 6), -- 1 / 1,5

    (2, 3, 1, 1, '2018', 9), -- 3 / 1,2,3,5
    (2, 3, 2, 1, '2019', 8), -- 3 / 1,2,3,5
    (2, 3, 3, 1, '2020', 8), -- 3 / 1,2,3,5
    (2, 3, 3, 2, '2020', 7), -- 3 / 1,2,3,5
    (2, 3, 5, 1, '2020', 7), -- 3 / 1,2,3,5
    (2, 3, 5, 2, '2020', 8), -- 3 / 1,2,3,5

    (3, 15, 8, 1,'2019', 9), -- 15 / 8

    (4, 8, 4, 1, '2020', 8), -- 8 / 4,6
    (4, 8, 6, 2, '2020', 9), -- 8 / 4,6
    
    (6, 14, 8, 1, '2019', 8), -- 14 / 8
    
    (8, 3, 1, 1, '2019', 0), -- 3 / 1,2,3,5
    (8, 3, 2, 2, '2020', 6), -- 3 / 1,2,3,5
    (8, 3, 3, 2, '2020', 7), -- 3 / 1,2,3,5
    (8, 3, 5, 1, '2018', 0), -- 3 / 1,2,3,5

    (9, 8, 4, 1, '2019', 0), -- 8 / 4,6
    (9, 8, 6, 1, '2020', 0); -- 8 / 4,6

INSERT INTO teacher_timeslot_meeting
    (start_time_slot, teacher_id, course_id, class_id,day,parent_id, year)
VALUES
    -- teacher 1
    (1,1,1,2,3,1,2019),
    (1,1,1,4,5,2,2019),
    (1,1,3,3,4,2,2019),
    -- teacher 2
    (5,1,1,2,3,1,2019),
    (5,1,1,4,5,1,2019),
    (5,1,3,3,4,3,2019);