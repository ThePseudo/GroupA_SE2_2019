<?php
require_once("base/templates.php");
session_start();
top("Office queues - operator");
if (1/*isset($_SESSION['id'])*/) {
    ?>

    <!--<h1>Welcome, operator <?php echo $_SESSION['id']; ?></h1> -->
    <br /><br /><br />
    <div id = "show_next"></div> 
    <div style="display:block; text-align:center; align-content:center; margin:auto;">
        <button type = "button", onclick="serveNext(document.getElementById('show_next'))">
            CALL NEXT
            <!--<input type="submit" class="selectbtn" style="margin-top:40px;" value="Next user"> -->
        </button>
    </div>

<?php
}
bottom();
?>