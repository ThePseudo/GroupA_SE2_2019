<?php
session_start();
require_once("base/templates.php");
top("Office queues - login");
/*session_start();
if(isset($_SESSION["id"])&&isset($_SESSION["type"])){
    if($_SESSION["type"]=="admin")
        header("location: administrator_page.php");
    if($_SESSION["type"]=="operator")
        header("location: operator_page.php");*/
?>
<h1 style="font-size:40px">Log in</h1>
<br /><br /><br /><br /><br /><br />
<a href="index.php" style="color:black;text-decoration:none;"><button class="topright loginbtn" style="font-size:25px">Home</button></a>
<div style="display:block; text-align:center; align-content:center; margin:auto">
    <form action="actions/log_in.php" method="POST">
        <a style="font-size:30px;">Username</a><input type="text" name="id" class="text" /><br />
        <a style="font-size:30px;">Password</a><input type="password" name="pwd" class="text" /><br />
        <input type="submit" class="loginbtn" style="margin-top:40px; font-size:25px" value="Sign in">
    </form>
</div>
<?php
    if(isset($_GET["error"]))
        echo "<h1>Credential not valid<h1>";
?>
<?php
bottom();