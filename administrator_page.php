<?php
require_once("base/templates.php");
session_start();
top("Office queues - operator");
if (isset($_SESSION['id'])) {
    ?>
    <a href="actions/logout.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Logout</button></a>
    <h1>I'm the administrator</h1>
<?php
} else {
    header("location: ./index.php");
}
bottom();
?>