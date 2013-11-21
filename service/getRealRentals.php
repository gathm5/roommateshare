<?php
class Rentals {
    public $rentals;
}
class RentalJson {
    private $json;
    function __construct($city_name) {
        include '../logic/dbFunctions.php';
        $sql = "SELECT id, city, json, DATE_FORMAT(post_added,'%M %e, %Y %k:%i:%s') post_added FROM Rental_Json WHERE SOUNDEX(city) LIKE CONCAT(SOUNDEX('$city_name'), '%') ORDER BY Rental_Json.post_added DESC;";
        $db = new DBConnection();
        $results = $db->CRUD($sql, 'insert');
        $rentals = new Rentals();
		$rentals->rentals = $results;
		$this->json = json_encode($rentals);
    }

    public function getJson() {
        return $this->json;
    }

}
if (isset($_GET['city_name'])) {
    $city_name = $_GET['city_name'];
	try{
		$list = new RentalJson($city_name);
		echo $list->getJson();
	} catch(Exception $e) {
		echo '{"error":true}';
	}
}
?>