<?php
class Rentals {
    public $rentals;
}
class RentalJson {
    private $json;
    function __construct($city_name) {
        include '../logic/dbFunctions.php';
        $sql = "Select id, city, json, post_added from Rental_Json where city like '$city_name%';";
        $db = new DBConnection();
        $results = $db->CRUD($sql, 'select');
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