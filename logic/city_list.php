<?php

if (isset($_REQUEST["findCity"]) && isset($_REQUEST["param"])) {
    $param = $_REQUEST["param"];
    include 'connection.php';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass) OR DIE("");
    mysql_select_db($dbname, $conn);
    //Fetching from your database table.
    $query = 'SELECT DISTINCT '
            . ' CONCAT( city_name, IF( state_name = \'unknown\', \'\', CONCAT( \', \', state_name ) ) ) city'
            . ' FROM CityList t1, StateList t2'
            . ' WHERE t1.StateList_id = t2.id'
            . ' AND city_name LIKE \'' . $param . '%\' GROUP BY city'
            . ' UNION ALL '
            . ' SELECT DISTINCT CONCAT( \'|state|\', state_name ) state'
            . ' FROM StateList'
            . ' WHERE state_name LIKE \'' . $param . '%\''
            . ' AND state_name != \'unknown\''
            . ' GROUP BY SOUNDEX(state_name)';

    $query = "SELECT city_name city
            FROM `US_City` 
            WHERE city_name like '$param%'
            UNION
            SELECT city_name city
            FROM  `US_City` 
            WHERE LPAD( zip_code, 5,  '0' ) like '$param%'";
    $result = mysql_query($query, $conn);
    $resultArr = array();
    if ($result) {
        while ($row = mysql_fetch_array($result)) {
            array_push($resultArr, $row["city"]);
        }
    }
    mysql_close($conn);
    echo json_encode($resultArr);
}
?>