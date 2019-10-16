<?php
require_once("base/templates.php");
top("Office queues - Called");
?>

<h1>Currently served</h1>

<a href="index.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Home</button></a>
<div style="display:block; text-align:center; align-content:center; margin:auto">
    <table>
        <tr>
            <th>Counter</th>
            <th>Ticket</th>
        </tr>
        <tr>
            <td>1</td>
            <td>P 001</td>
        </tr>
        <tr>
            <td>2</td>
            <td>A 001</td>
        </tr>
        <tr>
            <td>3</td>
            <td>A 002</td>
        </tr>
    </table>
</div>

<?php
bottom();
?>