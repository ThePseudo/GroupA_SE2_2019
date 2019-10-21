<?php
    session_start();
    include "./base/functions.php";
    if(isset($_GET["ticket"])){
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
    } else {
        $db = DBConnect();
        $db->beginTransaction();
        $stmt = $db->prepare("UPDATE employee SET status = 'free' WHERE ID=:ID");
        $stmt->bindParam(':ID', $_SESSION["id"]);
        $stmt->execute();
        $db->commit();
    }
    unset($_SESSION["id"]);
    unset($_SESSION["type"]);
    header("location: index.php");
    exit;
?>