<?php

// session[id] = counter
require_once("../base/functions.php");
session_start();
if (isset($_SESSION['id'])) {
    serveNext($_SESSION['id']);
}
header("Location: ../operator_home.php");
