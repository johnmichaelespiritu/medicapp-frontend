<?php
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

header('Access-Control-Allow-Credentials: true');

header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');

header('Access-Control-Allow-Headers: Content-Type');

require_once('MysqliDb.php');

class DB {
  private $host = 'localhost';
  private $username = 'root';
  private $password = 'jackfrost050100';
  private $database = 'medicapp';

  protected $connection;

  public function __construct() {
      $this->connection = new MysqliDB($this->host, $this->username, $this->password, $this->database);
  }
}
?>
