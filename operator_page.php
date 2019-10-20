<?php
require_once("base/templates.php");
session_start();
top("Office queues - operator");
include "base/functions.php";
if (isset($_SESSION['id'])) {
    ?>
    <a href="logout.php" style="color:black;text-decoration:none;"><button class="topright loginbtn">Logout</button></a>
    <h1>Welcome, operator <?php echo $_SESSION['id']; ?></h1>
    <br /><br /><br />
    <div id = "show_next"><?php
    $ticket=serveFirst($_SESSION['id']);
    if($ticket==NULL){
        ?>
        <h1>Noone in the queue</h1>
        <script>
             setTimeout("location.href = 'operator_page.php' ",1000);
        </script>
        <?php
    } else {
        echo "<h1> $ticket </h1>";
    }
    ?></div> 
    <div style="display:block; text-align:center; align-content:center; margin:auto;">
        <button type = "button", onclick="serveNext(document.getElementById('show_next'))">
            CALL NEXT
            <!--<input type="submit" class="selectbtn" style="margin-top:40px;" value="Next user"> -->
        </button>
    </div>

<?php
} else {
    header("location: ./index.php");
}
bottom();
?>