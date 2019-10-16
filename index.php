<?php
require_once("base/templates.php");
top("Office queues - main");
?>
<h1>Welcome!</h1>
<h1>Which service do you want to select?</h1>

<a href="login.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Login</button></a>

<br /><br />
<div style="display:block; text-align:center; align-content:center; margin:auto;">
    <button class="selectbtn">A - ACCOUNTING</button><br />
    <button class="selectbtn">P - PACKAGES</button><br />
    <a href="called_people.php" style="color:black;text-decoration:none;"><button class="selectbtn">Currently served</button></a>
</div>
<?php
bottom();
?>