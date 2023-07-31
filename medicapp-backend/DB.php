<?php
header("Access-Control-Allow-Origin: https://medicapp-system.netlify.app");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once('MysqliDb.php');

/**
 * DB Class
 *
 * This class provides a connection to the MySQL database using MysqliDB library.
 * It sets up the necessary headers for enabling Cross-Origin Resource Sharing (CORS).
 */
class DB {
    private $host = 'localhost';
    private $username = 'id21065806_medicapp';
    private $password = '8H7!a0RAUXCxjuX8NXMd';
    private $database = 'id21065806_medicapp';

    /**
     * The database connection object.
     *
     * @var MysqliDB
     */
    protected $connection;

    /**
     * Constructor
     *
     * Initializes the database connection using the provided credentials.
     * Sets up the necessary headers for enabling Cross-Origin Resource Sharing (CORS).
     */
    public function __construct() {
        // Create a new MysqliDB instance and establish the database connection.
        $this->connection = new MysqliDB($this->host, $this->username, $this->password, $this->database);
    }
}
?>
