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
    $db = DBConnect();
    $db->beginTransaction();
    $date = date("Y-m-d");
    $time_print = date("H:i:s");
    $stmt = $db->prepare("UPDATE ticket SET time_end_service = :time WHERE ID_service=:ID AND number=:num AND date = :date");
    $stmt->bindParam(':ID', $service);
    $stmt->bindParam(':num', $num);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':time', $time_print);
    $stmt->execute();
    $db->commit();
    return;
?>