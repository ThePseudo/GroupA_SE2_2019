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

function newTicket($db, $service)
{
    $date = date("Y-m-d");
    $db->beginTransaction();
    $stmt = $db->prepare("SELECT count(number) FROM ticket WHERE ID_service = :ID_service && date = :date FOR UPDATE");
    $stmt->bindParam(':ID_service', $service);
    $stmt->bindParam(':date', $date);
    $stmt->execute();
    $count = $stmt->fetch();
    $count++;

    $time_print = date("H:i:s");
    $stmt = $db->prepare("INSERT INTO ticket (ID_service,number,data,time_start_waiting,time_end_waiting,time_end_service) VALUES (:id, :number,:data,:time_s_w, :time_e_w, :time_e_s)");
    $stmt->bindParam(':id', $service);
    $stmt->bindParam(':number', $count);
    $stmt->bindParam(':data', $date);
    $stmt->bindParam(':time_s_w', $time_print);
    $stmt->bindParam(':time_e_w', null, PDO::PARAM_NULL);
    $stmt->bindParam(':time_e_s', null, PDO::PARAM_NULL);

    $stmt->execute();
    $db->commit();
    $db->close();
}
