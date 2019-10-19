<?php
require_once("base/templates.php");
top("Office queues - main");

?>
<h1>Welcome!</h1>
<h1>Which service do you want to select?</h1>

<a href="login.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Login</button></a>

<br /><br />
<div style="display:block; text-align:center; align-content:center; margin:auto;">
    <a href="reload.php?type=A"><button class="selectbtn">A - ACCOUNTING</button></a><br />
    <a href="reload.php?type=P"><button class="selectbtn">P - PACKAGES</button></a><br />
    <a href="queues_display.php" style="color:black;text-decoration:none;"><button class="selectbtn">Currently served</button></a>
</div>
<?php
bottom();
?>