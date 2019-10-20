<?php
session_start();

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

function serveNext($counter)
{
    // free counter from database
    // select next guy to be served
    // update database with next guy served
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
    
    $date = date("d-m-Y");
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