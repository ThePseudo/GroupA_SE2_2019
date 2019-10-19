<?php
    require_once("base/templates.php");
    top("Office queues - main");
    if(!isset($_GET["ticketnum"])&!isset($_GET["date"])) header("location: ./index.php");
?>

<html lang = "en">
    <head>
        <meta charset="UTF-8">
        <title>Printed</title>
    </head>

    <body>
        <div>
            <div style="display:block; text-align:center; align-content:center; margin:auto;">
                <h1> Ticket Printed! </h1>
                <?php 
                    echo "<h1> ".$_GET['ticketnum']." </h1>"; 
                    echo "<h1> ".$_GET['date']." </h1>";
                    //echo "<img src = \"resource/logo.png\">";
                    echo "<h1> ADD WAITING TIME HERE </h1>";
                    echo "<h1> ADD ESTIMATED NUMBER OF PEOPLE HERE </h1>";
                ?>
                <a href="index.php"><button class="topright loginbtn">Home</button></a><br />
            </div>
            <script>
                
                setTimeout("location.href = 'index.php' ",4000);
            //</script>

    

    