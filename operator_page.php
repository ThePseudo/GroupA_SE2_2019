<?php
require_once("base/templates.php");
session_start();
top("Office queues - operator");
if (isset($_SESSION['id'])) {
    ?>

    <h1>Welcome, operator <?php echo $_SESSION['id']; ?></h1>
    <br /><br /><br />
    <div style="display:block; text-align:center; align-content:center; margin:auto;">
        <button type = "button", onclick=serveNext()>
            CALL NEXT
            <!--<input type="submit" class="selectbtn" style="margin-top:40px;" value="Next user"> -->
        </button>
    </div>
<?php
}
bottom();
?>