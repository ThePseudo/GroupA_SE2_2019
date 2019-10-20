<?php
require_once("base/templates.php");
top("Office queues - Called");
include "base/functions.php";
?>

<h1>Currently served</h1>

<a href="index.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Home</button></a>
<div style="display:block; text-align:center; align-content:center; margin:auto">
    <table style="display:block; text-align:center; align-content:center; margin-left:50%; margin-right:50%;">
        <tr>
            <th>Counter</th>
            <th>Ticket</th>
        </tr>
        <?php
        for($i=0; $i<100; $i++){
            $ticket=CounterTicket($i);
            if($ticket!=NULL){
                echo "<tr><td>$i</td><td>$ticket</td></tr>";
            }
        }
        ?>
    </table>
</div>
<script>
                
                setTimeout("location.href = 'queues_display.php' ",10000);
            //</script>
<?php
bottom();
?>