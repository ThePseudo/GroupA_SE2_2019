<?php
    session_start();
    unset($_SESSION["id"]);
    unset($_SESSION["type"]);
    header("location: index.php");
?>