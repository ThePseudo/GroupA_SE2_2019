<?php
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

function serveNext($counter)
{
    // free counter from database
    // select next guy to be served
    // update database with next guy served
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
    return $ticket_num;
}