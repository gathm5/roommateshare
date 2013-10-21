<?php

class StateList {

    private $json;

    function __construct($country) {
        include '../logic/dbFunctions.php';
        $sql = "Select state_name 'name', state_short 'abbr' from StateList where CountryList_id = '$country';";
        $db = new DBConnection();
        $result = $db->CRUD($sql);
        $this->json = json_encode($result);
    }

    public function getJson() {
        return $this->json;
    }

}

if (isset($_GET['country'])) {
    $country = $_GET['country'];
    if ($country == 'US') {
        $list = new StateList(2);
        echo $list->getJson();
    } else {
        echo '{"error":true}';
    }
}
?>