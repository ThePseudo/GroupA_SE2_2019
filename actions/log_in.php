<?php
include "../base/functions.php";
if (!isset($_POST["id"]) || !isset($_POST["pwd"])) exit;
LogIn($_POST["id"], $_POST["pwd"]);
exit;
