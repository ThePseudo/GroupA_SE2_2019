<?php

// session[id] = counter
require_once("../base/functions.php");
session_start();
// if (isset($_SESSION['id'])) {
//     serveNext($_SESSION['id']);
// }
// header("Location: ../operator_home.php");

// --------------

if(isset($_POST["service"])){
    $service = $_POST["service"];

    $db = DBConnect();
    $db->beginTransaction();

    $stmt = $db->prepare("SELECT MIN(number) FROM ticket WHERE ID_service = :service FOR UPDATE");
    $stmt->bindParam(':service', $service);
    $stmt->execute();

    if(!$stmt->rowCount()){
        echo "0";
        $db = NULL;
        $stmt = NULL;
        exit;
    }
    
    
    $next = $stmt->fetchColumn(0);
    
    //delete ticket from the queue
    //CHECK QUERY, non funziona
    $stmt = $db->prepare("DELETE FROM ticket WHERE ID_service = :service AND number = (SELECT MIN(number) FROM ticket WHERE ID_service = :service )");
    $stmt->bindParam(':service', $service);
    $stmt->execute();

    $db->commit();
    $db = NULL;
    $stmt = NULL;

    // add here observable mechanism connected to observer in queues_display (check https://codeburst.io/observer-pattern-object-oriented-php-4e669431bcb9)

    echo $service.$next;
    
} else return false;
?>
