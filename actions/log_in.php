<?php
    require_once("../base/templates.php");
    top("Office queues - main");
    include "../base/functions.php";
    if(!isset($_POST["id"])||!isset($_POST["pwd"])) exit;
    $login = LogIn($_POST["id"],$_POST["pwd"]);
    echo "<h1>You are a ".$login."</h1>";
?>

<a href="../index.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Home</button></a>