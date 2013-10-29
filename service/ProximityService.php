<?php
class ProximityService {
	private $zipcode;
	private $distance;
	
	function __construct($zipcode, $distance = 20) {
		$this->zipcode = $zipcode;
		$this->distance = $distance;
		$lat = 0;
		$lng = 0;
		include '../logic/dbFunctions.php';
		$sql = "SELECT latitude, longitude FROM ZipCodes WHERE city_name LIKE '$zipcode%' OR postal_code LIKE '$zipcode';";
        $db = new DBConnection();
        $results = $db->CRUD($sql, 'select');
		for($i=0; $i<sizeof($results); $i++){
			$lat = $results[$i]['latitude'];
			$lng = $results[$i]['longitude'];
			break;
		};
		if($lat > 0){
			echo $this->stored_procedure($lat, $lng);
		}
	}
	function stored_procedure($lat1, $lng1){
		$distance = $this->distance;
		$max_lng = $this->LongitudePlusDistance($lng1, $lat1, $distance);
		$max_lat = $this->LatitudePlusDistance($lat1, $distance);
		
		$min_lat = 2 * $lat1 - $max_lat;
		$min_lng = 2 * $lng1 - $max_lng;
		
		$sql = "Select postal_code
				From ZipCodes
				Where  Longitude Between $min_lng And $max_lng
					And Latitude Between $min_lat And $max_lat
					And 3958.75586574 * acos(sin($lat1/57.2957795130823) * sin(Latitude/57.2957795130823) + cos($lat1/57.2957795130823) * cos(Latitude/57.2957795130823) * cos(Longitude/57.2957795130823 - ($lng1/57.2957795130823))) <= $distance;";
		return $sql;
	}
	function CalculateDistance($lat1, $lng1, $lat2, $lng2){
		$temp = sin($lat1/57.2957795130823) * sin($lat2/57.2957795130823) + cos($lat1/57.2957795130823) * cos($lat2/57.2957795130823) * cos($lng2/57.2957795130823 - $lng1/57.2957795130823);
		if($temp > 1)
			$temp = 1;
		else if($temp < -1)
			$temp = -1;
		return (3958.75586574 * acos($temp));
	}
	function LatitudePlusDistance($start_latitude, $distance){
		return ($start_latitude + sqrt($distance * $distance / 4766.8999155991));
	}
	function LongitudePlusDistance($start_latitude, $start_longitude, $distance){
		return ($start_longitude + sqrt($distance * $distance / (4784.39411916406 * cos(2 * $start_latitude / 114.591559026165) * cos(2 * $start_latitude / 114.591559026165))));
	}
}
$proximity_service = new ProximityService('94040', 20);
?>