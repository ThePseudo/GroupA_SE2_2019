<?php
require_once("base/templates.php");
top("Office queues - login");
?>
<h1>Log in employee</h1>
<br /><br /><br /><br /><br /><br />

<div style="display:block; text-align:center; align-content:center; margin:auto">
    <a style="font-size:20px;">Username</a><input type="text" name="id" class="text" /> <br />
    <a style="font-size:20px;">Password</a><input type="password" name="pwd" class="text" />
    <form action="actions/log_in.php" method="get">
        <input type="submit" class="loginbtn" value="Sign in">

    </form>
</div>
<?php
bottom();
