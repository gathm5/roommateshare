<?php

final class DBConnection {

    private $dbhost, $dbname, $dbuser, $dbpass, $baseURL, $site;
    private $conn;
    private $error_connection;

    public function __construct() {
        include_once 'connection.php';
        $this->dbhost = $dbhost;
        $this->dbname = $dbname;
        $this->dbuser = $dbuser;
        $this->dbpass = $dbpass;
        $this->baseURL = $baseURL;
        $this->site = $site;
    }

    public function __destruct() {
        
    }

    public function connect() {
        $this->conn = mysql_connect($this->dbhost, $this->dbuser, $this->dbpass) OR DIE($this->error_connection = mysql_error($link));
        mysql_select_db($this->dbname, $this->conn);
    }

    public function close() {
        mysql_close($this->conn);
    }

    public function getConnection() {
        return $this->conn;
    }

    public function CRUD($sql, $queryType = "select") {
        $returnVal = false;
        if ($sql == "") {
            return false;
        }
        if ($queryType == "select") {
            $this->connect();
            $result = mysql_query($sql, $this->conn);
            $returnVal = $this->mysql_fetch_all($result);
            $this->close();
            return $returnVal;
        }
        else if($queryType == "update"){
            $this->connect();
            $result = mysql_query($sql, $this->conn);
            $result = mysql_affected_rows($this->conn);
            $this->close();
            return $result;
        }
        else if($queryType == "insert"){
            $this->connect();
            $result = mysql_query($sql, $this->conn);
            $result = mysql_affected_rows($this->conn);
            $this->close();
            return $result;
        }
        return false;
    }

    private function mysql_fetch_all($result) {
        $all = array();
        while ($all[] = mysql_fetch_assoc($result));array_pop($all);
        return $all;
    }
}

?>
