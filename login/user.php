<?php

class User {

    private $name;
    private $email;
    private $isValid;
    private $json;

    function __construct($email, $password) {
        include '../logic/dbFunctions.php';
        $sql = "Select username, first_name, last_name, email, phone from user where email='$email' and password='$password';";
        $db = new DBConnection();
        $result = $db->CRUD($sql);
        if (sizeof($result) == 1) {
            $this->isValid = true;
            $this->name = $result['name'];
            $this->email = $result['email'];
            $this->json = json_encode($result);
        }
        else
            $this->isValid = false;
    }

    public function getJson() {
        return $this->json;
    }

    public function getName() {
        return $this->name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getIsValid() {
        return $this->isValid;
    }

}

?>
