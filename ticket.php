<?php
    include "base/functions.php";
    
    $db = DBConnect();
    if(!isset($_GET["type"])) exit;
    newTicket($db,$_GET["type"]);
    header("Location: index.php");
?>