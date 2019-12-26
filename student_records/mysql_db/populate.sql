-- Teacher
INSERT INTO teacher
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (1, "Elena", "Baralis", "AV85T", "elena.baralis.polito@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

INSERT INTO teacher
    (id,first_name,last_name,cod_fisc,email,password,first_access)
VALUES
    (2, "Marina", "Indri", "RVEQXX32E18B392G", "marina64@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

-- Officer
INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access, principal)
VALUES
    (1, "Giorno", "Giovanna", "CP80X", "pasticcio80@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0);

INSERT INTO officer
    (id,first_name,last_name,cod_fisc,email,password,first_access, principal)
VALUES
    (2, "Tommaso", "Bodda", "FTEZMF95C47E840N", "bodda75@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1, 0);

-- Parent
INSERT INTO parent
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (1, "Alberto", "Rosso", "1111", "alberto.rosso@gmail.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

INSERT INTO parent
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (2, "Piero", "Fetta", "HDDRWU63L46D667M", "giorno@giovanna.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);
INSERT INTO parent
    (id, first_name, last_name,cod_fisc,email,password, first_access)
VALUES
    (3, "Jotaro", "Kujo", "DZJVSL56R55D763T", "marco@verdi.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO", 1);

-- Student
INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (1, "Angelo", "Rosso", "NJRGTD35P14B145Z", 2, 1, 2);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (2, "Martino", "Arte", "RLIZFH80S05E249F", 2, 1, 2);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (3, "Martinella", "Leone", "JDKDMY59L04H816S", 2, 1, 2);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (4, "Serena", "Fetta", "BSOWTD48P60F492T", 2, 2, 3);

INSERT INTO student
    (id,first_name,last_name,cod_fisc,class_id,parent_1,parent_2)
VALUES
    (5, "Francesca", "Fetta", "DVBGDD76L56E934Y", 2, 2, 3);

-- Class
INSERT INTO class
    (id,class_name)
VALUES(1, "1A");

INSERT INTO class
    (id,class_name)
VALUES(2, "1B");

INSERT INTO class
    (id,class_name)
VALUES(3, "1C");

-- Course
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

-- Admin
INSERT INTO admin
    (id,first_name,last_name,cod_fisc,email,password)
VALUES
    (1, "Giovanni", "Girrgio", "GPS67", "rossi@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO");

INSERT INTO admin
    (id,first_name,last_name,cod_fisc,email,password)
VALUES
    (2, "Arturo", "Merzario", "SJINBL63M03B687S", "racers@yahoo.com", "$2a$10$0tXRERd11hkw3zKQQmFeTOAuUcMiI6/ThiMNvfMUvKmYkWkL0BRkO");

-- Topic
INSERT INTO topic
    (id, topic_date, id_class, id_course, description)
VALUES(1, "2019-09-30", 1, 1, "Monoms");

INSERT INTO topic
    (id, topic_date, id_class, id_course, description)
VALUES(2, "2019-09-29", 2, 1, "Monoms");

INSERT INTO topic
    (id, topic_date, id_class, id_course, description)
VALUES(3, "2019-09-30", 2, 1, "Polynoms");

-- Note
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

-- Absence
INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(1, 1, "2019-09-30", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(2, 1, "2019-09-29", "08:00", "13:15", 0);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(3, 1, "2019-10-20", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(4, 1, "2019-10-21", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(5, 1, "2019-10-22", "08:00", "13:15", 1);

INSERT INTO absence
    (id, student_id, date_ab, start_h, end_h, justified)
VALUES(6, 1, "2019-10-10", "08:00", "13:15", 0);

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
INSERT INTO homework
    (id, course_id, class_id, description, date_hw)
VALUES
    (1, 1, 1, "Study pages 5-6-7", "2019-10-17");

-- Path: Angelo Rosso -> Science -> materials and homeworks
INSERT INTO homework
    (id, course_id, class_id, description, date_hw)
VALUES
    (2, 3, 2, "Study pages 5-6-7", "2019-10-17");
INSERT INTO homework
    (id, course_id, class_id, description, date_hw)
VALUES
    (3, 3, 2, "Ex 1 pag 12", "2019-10-17");

-- Material (TODO: see again links)
INSERT INTO material
    (id,course_id, class_id, description, link, date_mt)
VALUES
    (1, 3, 2, "questo è un test per vedere come si comporta la tabella con stringhe lunghe", "test.txt", '2019-9-12');

INSERT INTO material
    (id,course_id, class_id, description, link, date_mt)
VALUES
    (2, 3, 2, "prova descrizione1", "file.pdf", '2019-9-12');

INSERT INTO material
    (id,course_id, class_id, description, link, date_mt)
VALUES
    (3, 3, 2, "prova descrizione2", "file.pdf", '2019-9-12');

INSERT INTO material
    (id,course_id, class_id, description, link, date_mt)
VALUES
    (4, 3, 2, "prova descrizione3", "file.pdf", '2019-9-12');

INSERT INTO material
    (id,course_id, class_id, description, link, date_mt)
VALUES
    (5, 3, 2, "prova descrizione4", "file.pdf", '2019-9-12');

INSERT INTO material
    (id,course_id, class_id, description, link, date_mt)
VALUES
    (6, 3, 2, "prova descrizione5", "file.pdf", '2019-9-12');

-- Mark
INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (1, 1, 1, 6, '2019-9-10', 1, 'Chim 1', '3 domande', 'Other');

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (2, 1, 2, 8, '2019-9-11', 2, 'Chim 1', '3 domande', 'Other');

INSERT INTO mark
    (id,student_id, course_id, score, date_mark, period_mark,mark_subj,descr_mark_subj,type_mark_subj)
VALUES
    (3, 1, 3, 10, '2019-9-12', 1, 'Chim 1', '3 domande', 'Other');

-- General communication
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


-- Teacher-course-class
INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES(1, 1, 1, 2019);

INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES(1, 3, 1, 2019);

INSERT INTO teacher_course_class
    (teacher_id, course_id, class_id, year)
VALUES(1, 3, 2, 2019);