<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

function DBConnect()
{
    $dbname = "office_db";
    $dbplace = "localhost";
    $user = "root";
    $charset = "utf8";
    $password = "";
    $settings = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false);
    return new PDO("mysql:host=$dbplace;dbname=$dbname;charset=$charset;", $user, $password, $settings);
}

function CounterTicket($num)
{
    $db = DBConnect();
    $stmt = $db->prepare("SELECT ID_ticket_service, ID_ticket_number FROM employee WHERE ID_counter = :ID");
    $stmt->bindParam(':ID', $num);
    $stmt->execute();
    if ($stmt->rowCount() != 1) {
        return NULL;
    }
    $ticket = $stmt->fetchAll();
    $db = null;
    if ($ticket[0]["ID_ticket_service"] != NULL && $ticket[0]["ID_ticket_number"] != NULL) {
        return $ticket[0]["ID_ticket_service"] . $ticket[0]["ID_ticket_number"];
    } else {
        return NULL;
    }
}

function PeopleExtimation($ticket)
{
    $count = 0;
    $service = NULL;
    $num = 0;
    $arr = str_split($ticket);
    foreach ($arr as $var) {
        if ($count == 0) {
            $service = $var;
        } else {
            $num = $num * 10 + (int) $var;
        }
        $count++;
    }
    $db = DBConnect();
    $stmt = $db->prepare("SELECT DISTINCT COUNT(*) FROM ticket WHERE ID_service = :ID AND time_end_waiting IS NULL AND date = :DATE");
    $stmt->bindParam(':ID', $service);
    $date = date("Y-m-d");
    $stmt->bindParam(":DATE", $date);
    $stmt->execute();
    $num = $stmt->fetchColumn(0);
    $db = null;
    return $num - 1;
}

function WaitExtimation($ticket)
{
    $count = 0;
    $service = NULL;
    $num = 0;
    $arr = str_split($ticket);
    foreach ($arr as $var) {
        if ($count == 0) {
            $service = $var;
        } else {
            $num = $num * 10 + (int) $var;
        }
        $count++;
    }
    $db = DBConnect();
    $stmt = $db->prepare("SELECT DISTINCT COUNT(*) FROM employee_service, ticket
     WHERE employee_service.ID_service = :ID AND ID_employee IN (SELECT ID_employee FROM employee_service WHERE ID_service <> :ID1) 
");
    $stmt->bindParam(':ID', $service);
    $stmt->bindParam(':ID1', $service);
    $stmt->execute();
    $combined = $stmt->fetchColumn(0);
    $stmt = $db->prepare("SELECT DISTINCT COUNT(*) FROM employee_service WHERE ID_service = :ID AND ID_employee NOT IN (SELECT ID_employee FROM employee_service WHERE ID_service != :ID1)");
    $stmt->bindParam(':ID', $service);
    $stmt->bindParam(':ID1', $service);
    $stmt->execute();
    $service1 = $stmt->fetchColumn(0);
    $stmt = $db->prepare("SELECT service_time_estimate FROM service WHERE ID = :ID");
    $stmt->bindParam(':ID', $service);
    $stmt->execute();
    $time = $stmt->fetchColumn(0);
    $stmt = $db->prepare("SELECT service_time_estimate FROM service WHERE ID != :ID");
    $stmt->bindParam(':ID', $service);
    $stmt->execute();
    $time1 = $stmt->fetchColumn(0);
    $stmt = $db->prepare("SELECT DISTINCT COUNT(*) FROM ticket WHERE ID_service = :ID AND time_end_waiting IS NULL");
    $stmt->bindParam(':ID', $service);
    $stmt->execute();
    $num = $stmt->fetchColumn(0);
    $stmt = $db->prepare("SELECT DISTINCT COUNT(*) FROM ticket WHERE ID_service != :ID AND time_end_waiting IS NULL");
    $stmt->bindParam(':ID', $service);
    $stmt->execute();
    $num1 = $stmt->fetchColumn(0);
    $vett = explode(":", $time);
    $vett1 = explode(":", $time1);
    $num--;
    $t = (int) $vett[2] + (int) $vett[1] * 60 + (int) $vett[0] * 3600;
    $t1 = (int) $vett1[2] + (int) $vett1[1] * 60 + (int) $vett1[0] * 3600;
    $coeff = $num * $t + $num1 * $t1;
    $den = $service1 * $coeff + $combined * $num * $t;
    $numeratore = $num * $coeff;
    if ($den != 0)
        $calc = $numeratore / $den;
    else if (($t == 0 || $num == 0) && ($combined != 0 || $service1 != 0))
        $calc = 0;
    else {
        return "INFINITE";
    }
    $stmt = $db->prepare("SELECT DISTINCT COUNT(ID_employee) FROM employee_service WHERE ID_employee IN (SELECT ID FROM employee WHERE status='occupied')");
    $stmt->bindParam(':ID', $service);
    $stmt->execute();
    $occ = $stmt->fetchColumn(0);
    $stmt = $db->prepare("SELECT DISTINCT COUNT(ID_employee) FROM employee_service");
    $stmt->bindParam(':ID', $service);
    $stmt->execute();
    $tot = $stmt->fetchColumn(0);

    if ($tot != 0)
        $calc += ($occ / $tot);
    $calc *= $t;
    $calc = round($calc, 0);
    return (($calc - $calc % 3600) / 3600) . ":" . (($calc % 3600 - $calc % 60) / 60) . ":" . ($calc % 60);
}

function serveNext($ID, $service, $num)
{
    $db = DBConnect();
    $db->setAttribute(PDO::ATTR_AUTOCOMMIT, 0);
    $db->beginTransaction();
    $date = date("Y-m-d");
    $time_print = date("H:i:s");
    $stmt = $db->prepare("UPDATE ticket SET time_end_service = :time WHERE ID_service=:ID AND number=:num AND date = :date");
    $stmt->bindParam(':ID', $service);
    $stmt->bindParam(':num', $num);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':time', $time_print);
    $stmt->execute();
    $stmt = $db->prepare("UPDATE employee SET status = 'free' WHERE ID=:ID");
    $stmt->bindParam(':ID', $ID);
    $stmt->execute();
    $db->commit();
    $db->setAttribute(PDO::ATTR_AUTOCOMMIT, 1);
    $db = null;
    return;
}

function serveFirst($ID)
{
    $db = DBConnect();
    $db->beginTransaction();
    $stmt = $db->prepare("SELECT ID_service FROM employee_service WHERE ID_employee = :ID FOR UPDATE");
    $stmt->bindParam(':ID, ', $ID);
    $stmt->execute();
    $count = 0;
    $type = NULL; // service id
    $nt = 0;
    $vett = $stmt->fetchAll(0);
    $date = date("Y-m-d");
    foreach ($vett as $service) {
        $stmt = $db->prepare("SELECT COUNT(*) as c, MIN(number) as m FROM ticket WHERE ID_service = :ID && date = :date && time_end_waiting IS NULL FOR UPDATE");
        $stmt->bindParam(':ID', $service["ID_service"]);
        $stmt->bindParam(':date', $date);
        $stmt->execute();
        $num = $stmt->fetchAll();

        if ($stmt->rowCount() != 1) { //Check if only one result is returned, else exit (error) 
            exit;
        }

        //If a counter manages more than one service, 
        //than search the longest queue and pop the first citizen from that queue
        if ($num[0]["c"] > $count) {
            $count = $num;
            $type = $service["ID_service"];
            $nt = $num[0]["m"]; // next number ticket to serve from the longest queue
        }
    }
    $time_print = date("H:i:s");
    $stmt = $db->prepare("UPDATE ticket SET time_end_waiting = :time WHERE ID_service=:ID AND number=:num AND date = :date");
    $stmt->bindParam(':ID', $type);
    $stmt->bindParam(':num', $nt);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':time', $time_print);
    $stmt->execute();
    if ($type != NULL && $nt != 0) {
        $stmt = $db->prepare("UPDATE employee SET status='occupied', ID_ticket_service=:IDS, ID_ticket_number=:num WHERE ID=:IDE");
        $stmt->bindParam(':IDS', $type);
        $stmt->bindParam(':IDE', $ID);
        $stmt->bindParam(':num', $nt);
        $stmt->execute();
        $db->commit();
        $db->setAttribute(PDO::ATTR_AUTOCOMMIT, 1);
        $db = null;
        return $type . $nt;
    } else {
        $stmt = $db->prepare("UPDATE employee SET status='occupied', ID_ticket_service=:IDS, ID_ticket_number=:num WHERE ID=:IDE");
        $stmt->bindParam(':IDS', $type);
        $stmt->bindParam(':IDE', $ID);
        $stmt->bindParam(':num', $nt);
        $stmt->execute();
        $db->commit();
        $db->setAttribute(PDO::ATTR_AUTOCOMMIT, 1);
        $db = null;
        return NULL;
    }
}

function LogIn($ID, $pwd_inserted)
{
    $db = DBConnect();
    $stmt = $db->prepare("SELECT * FROM employee WHERE ID = :ID"); // TODO: improve security
    $stmt->bindParam(':ID', $ID);
    $stmt->execute();

    $usr = $stmt->fetch();


    if ($stmt->rowCount() != 1 || $usr['password'] != $pwd_inserted) {
        header("location: ../login.php?error=1");
        exit;
    }
    $db = null;

    //TO DO: No password hash still

    // if(password_verify($pwd_inserted,$pwd_db)!=true){
    //     $stmt = NULL;
    //     header("location: ../login.php"); 
    //     exit;
    // }

    $admin = $usr['admin'];

    $_SESSION["id"] = $ID;
    if (!$admin) {
        $_SESSION["type"] = "operator";
        header("location: ../operator_page.php");
    } else {
        $_SESSION["type"] = "admin";
        header("location: ../administrator_page.php");
    }
    exit;
}

function newTicket($service)
{
    $db = DBConnect();
    $db->setAttribute(PDO::ATTR_AUTOCOMMIT, 0);
    $date = date("Y-m-d");
    $db->beginTransaction();

    $stmt = $db->prepare("SELECT COUNT(*) FROM ticket WHERE ID_service = :ID_service && date = :date FOR UPDATE");
    $stmt->bindParam(':ID_service', $service);
    $stmt->bindParam(':date', $date);
    $stmt->execute();
    $count = $stmt->fetchColumn(0); // retrieve value column "count"
    $count++;
    $ticket_num = $service . $count;
    //TODO: check max citizen served?

    $stmt = null;

    $time_print = date("H:i:s");
    $stmt = $db->prepare("INSERT INTO ticket (ID_service,number,date,time_start_waiting,time_end_waiting,time_end_service) VALUES (:id, :number,:date,:time_s_w, :time_e_w, :time_e_s)");
    $stmt->bindParam(':id', $service);
    $stmt->bindParam(':number', $count);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':time_s_w', $time_print);
    $stmt->bindValue(':time_e_w', null, PDO::PARAM_NULL);
    $stmt->bindValue(':time_e_s', null, PDO::PARAM_NULL);

    $stmt->execute();
    $db->commit();
    $db->setAttribute(PDO::ATTR_AUTOCOMMIT, 1);

    $stmt = null;
    $db = null; //destroy the db's PDO object in order to close  connection to DB
    return $ticket_num . "#" . $date . " " . $time_print;
}
