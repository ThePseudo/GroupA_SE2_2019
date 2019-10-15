<?php
require_once("base/templates.php");
top("Office queues - main");
?>
<h1>Welcome!</h1>
<h1>Which service do you want to select?</h1>

<a href="login_select.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Login</button></a>

<br /><br /><br /><br />
<div style="display:block; text-align:center; align-content:center; margin:auto;">
    <button class="selectbtn">A - ACCOUNTING</button><br />
    <button class="selectbtn">P - PACKAGES</button>
</div>
<?php
bottom();
?>