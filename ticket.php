<?php
    include "base/functions.php";
    if(!isset($_GET["type"])) exit;
    $ticket_num = newTicket($_GET["type"]);
?>

<html lang = "en">
    <head>
        <meta charset="UTF-8">
        <title>Printed</title>
    </head>

    <body>
        <div>
            <p> Ticket Printed! <p>
            <?php 
                echo "<p> $ticket_num <p>"; 
                $date = date("d-m-Y H:i:s");
                echo "<p> $date <p>";
                echo "<img src = \"resource/logo.png\">";
                echo "<p> ADD WAITING TIME HERE <p>";
                echo "<p> ADD ESTIMATED NUMBER OF PEOPLE HERE <p>";
            ?>

            <script><!--
                setTimeout("location.href = 'index.php' ",4000);
            //</script>

    

    