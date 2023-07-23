<?php
header("Access-Control-Allow-Origin: http://localhost:9000");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once('MysqliDb.php');

class DB {
  private $host = 'localhost';
  private $username = 'root';
  private $password = 'jackfrost050100';
  private $database = 'medicapp';

  // private $host = 'localhost';
  // private $username = 'id21065806_medicapp';
  // private $password = '8H7!a0RAUXCxjuX8NXMd';
  // private $database = 'id21065806_medicapp';

  protected $connection;

  public function __construct() {
      $this->connection = new MysqliDB($this->host, $this->username, $this->password, $this->database);
  }
}
?>
