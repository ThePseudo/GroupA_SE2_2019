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
    ("Giorno", "Giovanna", "GG80X", "giovanna80@hotmail.it", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0),
    ("Tommaso", "Bodda", "FTEZMF95C47E840N", "bodda75@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0);

-- Parent
INSERT INTO parent
    (first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    ("Alberto", "Rosso", "1111", "alberto.rosso@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Piero", "Fetta", "HDDRWU63L46D667M", "giorno@giovanna.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1),
    ("Jotaro", "Kujo", "DZJVSL56R55D763T", "marco@verdi.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

-- Student
INSERT INTO student
    (first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    ("Angelo", "Rosso", "NJRGTD35P14B145Z", 2, 1, 2),
    ("Martino", "Arte", "RLIZFH80S05E249F", 2, 1, 2),
    ("Martinella", "Leone", "JDKDMY59L04H816S", NULL, 1, 2),
    ("Serena", "Fetta", "BSOWTD48P60F492T", 3, 2, 3),
    ("Francesca", "Fetta", "DVBGDD76L56E934Y", 1, 2, 3),
    ("Alessandro", "Sardegna", "PPPGDD76L56E934Y",NULL, 2, 3),
    ("Alessandra", "Pugliese", "AAAGDD76L56E934Y" ,NULL, 2, 3);

-- Class
INSERT INTO class
    (class_name)
VALUES
    ("1A"),
    ("1B"),
    ("1C");

-- Course
INSERT INTO course
    (course_name, color)
VALUES
    ('Math', 'FF0000'),
    ('History', '0000FF'),
    ('Science', '00FF00'),
    ('Chemistry', "008080"),
    ('Art', '008000'),
    ('Geography', '00FFFF');

-- Admin
INSERT INTO admin
    (first_name,last_name,cod_fisc,email,password)
VALUES
    ("Giovanni", "Girrgio", "GPS67", "rossi@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO"),
    ("Arturo", "Merzario", "SJINBL63M03B687S", "racers@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO");

-- Topic
INSERT INTO topic
    ( topic_date, id_class, id_course, description)
VALUES
    ("2019-09-30", 1, 1, "Monoms"),
    ("2019-09-29", 2, 1, "Monoms"),
    ("2019-09-30", 2, 1, "Polynoms");

-- Note
INSERT INTO note
    (student_id, teacher_id, note_date, motivation, justified)
VALUES
    (1, 1, "2019-09-30", "L'alunno fa rumore in classe", 1),
    (1, 2, "2019-09-29", "L'alunno fa ANCORA rumore in classe", 0),
    (1, 1, "2019-09-29", "L'alunno fa ANCORA rumore 3 ora provo a mettere una stringa lunga, ancora più lunga vediamo ora", 0),
    (1, 2, "2019-09-29", "L'alunno fa ANCORA rumore 4", 0),
    (1, 2, "2019-09-29", "L'alunno fa ANCORA rumore 5", 1),
    (2, 1, "2019-09-29", "L'alunno fa ANCORA rumore 4", 0),
    (2, 2, "2019-09-29", "L'alunno fa ANCORA rumore 5", 1);

-- Absence
INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(1, "2019-09-30", "Absent", 1);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(1, "2019-09-29", "Absent", 1);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(1, "2019-09-28", "Absent", 1);

INSERT INTO absence
    (student_id, date_ab, absence_type, justified)
VALUES(1, "2020-01-02", "Late entry", 0);


-- Homework
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (1, 1, "Study pages 5-6-7", "2019-10-17");

-- Path: Angelo Rosso -> Science -> materials and homeworks
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (3, 2, "Study pages 5-6-7", "2019-10-17");
INSERT INTO homework
    (course_id, class_id, description, date_hw)
VALUES
    (3, 2, "Ex 1 pag 12", "2019-10-17");

-- Material (TODO: see again links)
INSERT INTO material
    (course_id, class_id, description, link, date_mt)
VALUES
    (3, 2, "questo è un test per vedere come si comporta la tabella con stringhe lunghe", "/upload/text.txt", '2019-9-12');

-- Mark
INSERT INTO mark
    (student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (1, 3, 6, '2019-9-10', 1, 'Science 1', '3 domande', 'Other'),
    (1, 4, 8, '2019-9-11', 2, 'Chim 1', '3 domande', 'Other'),
    (1, 3, 10, '2019-9-12', 1, 'Science 1', '3 domande', 'Other'),
    (2, 3, 10, '2019-9-12', 1, 'Science 1', '3 domande', 'Other'),
    (2, 3, 6, '2019-9-12', 1, 'Science 1', '3 domande', 'Oral');

-- General communication
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

