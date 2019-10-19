<?php
require_once("base/templates.php");
top("Office queues - login");
?>
<h1>Log in</h1>
<br /><br /><br /><br /><br /><br />
<a href="index.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Home</button></a>
<div style="display:block; text-align:center; align-content:center; margin:auto">
    <form action="actions/log_in.php" method="POST">
        <a style="font-size:20px;">Username</a><input type="text" name="id" class="text" /><br />
        <a style="font-size:20px;">Password</a><input type="password" name="pwd" class="text" /><br />
        <input type="submit" class="loginbtn" style="margin-top:40px;" value="Sign in">
    </form>
</div>
<?php
    if(isset($_GET["error"]))
        echo "<h1>Credential not valid<h1>";
?>
<?php
bottom();
