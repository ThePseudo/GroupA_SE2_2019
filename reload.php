<?php
    require_once("base/templates.php");
    top("Office queues - main");
    include "base/functions.php";
    if(!isset($_GET["type"])) exit;
    $string = newTicket($_GET["type"]);
    $array=explode("#",$string);
    header("location: ./ticket.php?ticketnum=$array[0]&date=$array[1]");
?>