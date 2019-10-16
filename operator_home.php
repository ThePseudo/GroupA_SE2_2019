<?php
require_once("base/templates.php");
session_start();
top("Office queues - operator");
?>

<h1>Welcome, operator <?php echo $_SESSION['id']; ?></h1>
<br /><br /><br />
<div style="display:block; text-align:center; align-content:center; margin:auto;">
    <form action="actions/next.php" method="POST">
        <input type="submit" class="selectbtn" style="margin-top:40px;" value="Next user">
    </form>
</div>
<?php
bottom();
?>