<?php

/**
 * Description of PostClass
 * @author Gautham
 */
class PostClass {

    private static $json;

    public static function StorePost($id, $type, $city, $jsonStr) {
        try {
            self::$json = $jsonStr;
            include '../dbFunctions.php';
            $db = new DBConnection();
            $sql = "INSERT INTO  findeasyrentals.Rental_Json (user_id , user_type , city , json) VALUES ('$id',  '$type', '$city', '$jsonStr');";
            $result = $db->CRUD($sql, 'insert');
            return $result;
        } catch (Exception $exc) {
            
        }
    }

}

if (isset($_GET['inputJson'])) {
    echo PostClass::StorePost($_GET['id'], $_GET['type'], $_GET['city'], $_GET['inputJson']);
}
?>
