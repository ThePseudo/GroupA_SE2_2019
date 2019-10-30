<?php
require_once("base/templates.php");
top("Office queues - Called");
include "base/functions.php";
?>

<h1>Currently served</h1>
<style>
    td,
    th {
        font-size: 30px;
        border: 1px solid #dddddd;
        width: 200px;
    }

    table {
        margin: 0 auto;
        text-align: center;
        align-content: center;
    }
</style>
<a href="index.php" style="color:black;text-decoration:none;"><button class="topright loginbtn" style="font-size:25px">Home</button></a>
<div>
    <table>
        <tr>
            <th>Counter</th>
            <th>Ticket</th>
        </tr>
        <?php
        for ($i = 1; $i < 100; $i++) {
            $ticket = CounterTicket($i);
            if ($ticket != NULL) {
                echo "<tr><td>$i</td><td>$ticket</td></tr>";
            }
        }
        ?>
    </table>
</div>
<script>
    setTimeout("location.href = 'queues_display.php' ", 3000);
</script>
<?php
bottom();
?>