<?php
function DBConnect()
{
    $dbname = "office_db";
    $dbplace = "localhost";
    $user = "root";
    $charset = "utf8";
    $password = "";
    $settings = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
    return new PDO("mysql:host=$dbplace;dbname=$dbname;charset=$charset;", $user, $password, $settings);
}

function serveNext($counter)
{
    // free counter from database
    // select next guy to be served
    // update database with next guy served
}
