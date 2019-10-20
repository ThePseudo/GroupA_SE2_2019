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

function CounterTicket($num){
    $db = DBConnect();
    $stmt = $db->prepare("SELECT ID_ticket_service, ID_ticket_number FROM employee WHERE ID_counter = :ID");
    $stmt->bindParam(':ID', $num);
    $stmt->execute();
    if($stmt->rowCount()!=1){
        return NULL;
    }
    $ticket = $stmt->fetchAll();
    $db = null; 
    if($ticket[0]["ID_ticket_service"]!=NULL&&$ticket[0]["ID_ticket_number"]!=NULL){
        return $ticket[0]["ID_ticket_service"].$ticket[0]["ID_ticket_number"];
    } else {
        return NULL;
    }
}

function serveFirst($ID){
    $db = DBConnect();
    $db->beginTransaction();
    $stmt = $db->prepare("SELECT ID_service FROM employee_service WHERE ID_employee = :ID FOR UPDATE");
    $stmt->bindParam(':ID', $ID);
    $stmt->execute();
    $count = 0;
    $type = NULL;
    $nt = 0;
    $vett = $stmt->fetchAll(0);
    $date = date("Y-m-d");
    foreach($vett as $service){
        $stmt = null;
        $stmt = $db->prepare("SELECT COUNT(*) as c, MIN(number) as m FROM ticket WHERE ID_service = :ID && date = :date && time_end_waiting IS NULL FOR UPDATE");
        $stmt->bindParam(':ID', $service["ID_service"]);
        $stmt->bindParam(':date', $date);
        $stmt->execute();
        $num = $stmt->fetchAll();
        if($stmt->rowCount()!=1){
            exit;
        }
        if($num[0]["c"]>$count){
            $type=$service["ID_service"];
            $count=$num;
            $nt=$num[0]["m"];
        }
    }
    $stmt = null;
    $time_print = date("H:i:s");
    $stmt = $db->prepare("UPDATE ticket SET time_end_waiting = :time WHERE ID_service=:ID AND number=:num AND date = :date");
    $stmt->bindParam(':ID', $type);
    $stmt->bindParam(':num', $nt);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':time', $time_print);
    $stmt->execute();
    $stmt = null;
    if($type!=NULL && $nt!=0){
        $stmt = $db->prepare("UPDATE employee SET status='occupied', ID_ticket_service=:IDS, ID_ticket_number=:num WHERE ID=:IDE");
        $stmt->bindParam(':IDS', $type);
        $stmt->bindParam(':IDE', $ID);
        $stmt->bindParam(':num', $nt);
        $stmt->execute();
        $db->commit();
        return $type.$nt;
    } else {
        $db->commit();
        return NULL;
    }
}

function LogIn($ID,$pwd_inserted){ //transazione necessaria?
    $db = DBConnect();
    //$db->beginTransaction();
    $stmt = $db->prepare("SELECT admin FROM employee WHERE ID = :ID AND password =:pwd"); //FOR UPDATE necessario?
    $stmt->bindParam(':ID', $ID);
    $stmt->bindParam(':pwd', $pwd_inserted);
    $stmt->execute();

    if($stmt->rowCount()!=1){
        header("location: ../login.php?error=1"); 
        exit;
    }

    $admin = $stmt->fetchColumn(0); // retrieve value column "admin"
    $db = NULL;
    
    //TO DO: non riesco a verificare password hash + sale

    // if(password_verify($pwd_inserted,$pwd_db)!=true){
    //     $stmt = NULL;
    //     header("location: ../login.php"); 
    //     exit;
    // }

    //$db->commit();
    $_SESSION["id"]=$ID;
    if(!$admin){
        $_SESSION["type"]="operator";
        header("location: ../operator_page.php");
    } else {
        $_SESSION["type"]="admin";
        header("location: ../administrator_page.php");
    }
    exit;
}

function newTicket($service)
{
    $db = DBConnect();
    
    $date = date("Y-m-d");
    $db->beginTransaction();

    $stmt = $db->prepare("SELECT COUNT(*) FROM ticket WHERE ID_service = :ID_service && date = :date FOR UPDATE");
    $stmt->bindParam(':ID_service', $service);
    $stmt->bindParam(':date', $date);
    $stmt->execute();
    $count = $stmt->fetchColumn(0); // retrieve value column "count"
    $count++;
    $ticket_num = $service.$count;
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
    $db -> commit();

    $stmt = null;
    $db = null; //destroy the db's PDO object in order to close  connection to DB
    return $ticket_num."#".$date." ".$time_print;
}