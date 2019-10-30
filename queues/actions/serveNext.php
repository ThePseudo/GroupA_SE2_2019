<?php
    session_start();
    include "../base/functions.php";
    if(!isset($_GET["ticket"]))
        return -1;
    $count=0;
    $service=NULL;
    $num=0;
    $arr=str_split($_GET["ticket"]);
    foreach($arr as $var){
        if($count==0){
            $service=$var;
        } else {
            $num=$num*10+(int)$var;
        }
        $count++;
    }
    serveNext($_SESSION["id"],$service,$num);
    return;
?>