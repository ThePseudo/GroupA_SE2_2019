<?php

// session[id] = counter
require_once("../base/functions.php");
session_start();
if (isset($_SESSION['id'])) {
    serveNext($_SESSION['id']);
}
header("Location: ../operator_home.php");

// --------------

if(isset($_POST["service"])){
    $service = $_POST["service"];

    $db = DBConnect();
    $db->beginTransaction();

    $stmt = $db->prepare("SELECT MIN(number) FROM ticket WHERE service = :service FOR UPDATE");
    $stmt->bindParam(':service', $service);
    $stmt->execute();

    if(!$stmt->rowCount()){
        return false;
        exit;
    }
    
    $next = $stmt->fetchColumn(0);
        
    $db->commit();
    $db = NULL;
    $stmt = NULL;

    // add here observable mechanism connected to observer in queues_display

    return $next;
}

else return false;
?>
