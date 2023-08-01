<?php

require_once('./DB.php');
require_once('./Utils.php');

/**
 * Class Patient
 * Represents a Patient entity and provides methods to interact with the database.
 */
class Patient extends DB
{
    /**
     * Handles HTTP GET requests.
     * Retrieves patient information based on the provided token and optional search keyword.
     *
     * @return void
     */
    public function httpGet()
    {
        // Get the token from the query string or set it to null if not provided.
        $token = isset($_GET['token']) ? $_GET['token'] : null;

        if (!$token) {
            // Return an error response if the token is not provided.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Token not provided.'));
            return;
        }

        try {
            // Decode the user ID from the token.
            $decoded_user_id = $this->decodeUserID($_GET['token']);

            if (!$decoded_user_id) {
                // Return an error response if the token is invalid.
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
                return;
            }

            // Extract the user ID from the decoded token.
            $user_id = $decoded_user_id->user_id;

            if (isset($_GET['searchKeyword'])) {
                // If search keyword is provided, retrieve patient information with the search keyword.
                $searchKeyword = $_GET['searchKeyword'];
                $search_patient = $this->getPatientInformation($user_id, $searchKeyword);

                if ($search_patient) 
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_patient));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            } else {
                // If search keyword is not provided, retrieve all patient information for the user.
                $get_all_patients = $this->getPatientInformation($user_id);
                
                if ($get_all_patients)
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_patients));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            }
        } catch (Exception $e) {
            // Return an error response if an exception occurs during token decoding.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

    /**
     * Handles HTTP POST requests.
     * Processes the HTTP POST request based on the provided payload and action.
     *
     * @param array $payload The payload received in the HTTP POST request.
     * @return void
     */
    public function httpPost($payload)
    {
        // Extract the action from the payload.
        $action = $payload['action'];

        switch ($action) {
            case 'addPatient':
                // Add a new patient record.
                $this->addPatient($payload);
                break;
            case 'updatePatient':
                // Update an existing patient record.
                $this->updatePatient($payload);
                break;
            case 'deletePatient':
                // Delete one or more patient records.
                $this->deletePatient($payload);
                break;
            default:
                // Return an error response if an unknown action is provided.
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
        }
    }

    /**
     * Adds a new patient record to the database.
     *
     * @param array $payload The payload containing patient data.
     * @return void
     */
    private function addPatient($payload) 
    {
        // Get the token from the query string or set it to null if not provided.
        $token = isset($_GET['token']) ? $_GET['token'] : null;

        if (!$token) {
            // Return an error response if the token is not provided.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Token not provided.'));
            return;
        }

        try {
            // Decode the user ID from the token.
            $decoded_user_id = $this->decodeUserID($_GET['token']);

            if (!$decoded_user_id) {
                // Return an error response if the token is invalid.
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
                return;
            }

            // Extract the user ID from the decoded token.
            $user_id = $decoded_user_id->user_id;

            // Prepare the data for the new patient record.
             $data = array(
                'user_id' => $user_id,
                'patient_name' => $payload['patient_name'],
                'patient_age' => $payload['patient_age'],
                'patient_home_address' => $payload['patient_home_address'],
                'patient_contact_number' => $payload['patient_contact_number'],
                'patient_gender' => $payload['patient_gender'],
                'patient_birthdate' => $payload['patient_birthdate']
            );

             // Insert the new patient record into the database.
            $add_patient = $this->connection->insert('tbl_patient_information', $data);

            if ($add_patient) {
                $data['patient_id'] = $add_patient;
                echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data, 'message' => 'Patient added successfully.'));
            }
            else {
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Patient added unsuccessfully.'));
            }
        } catch (Exception $e) {
            // Return an error response if an exception occurs during token decoding.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

    /**
     * Updates the patient information in the database based on the provided payload.
     *
     * @param array $payload The payload containing updated patient data.
     * @return void
     */
    private function updatePatient($payload) 
    {
        $data = array(
            'patient_name' => $payload['patient_name'],
            'patient_age' => $payload['patient_age'],
            'patient_home_address' => $payload['patient_home_address'],
            'patient_contact_number' => $payload['patient_contact_number'],
            'patient_gender' => $payload['patient_gender'],
            'patient_birthdate' => $payload['patient_birthdate']
        );

        $update_patient = $this->connection->where('patient_id', $payload['patient_id'])->update('tbl_patient_information', $data);

        if ($update_patient)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Patient information updated successfully.'));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Patient information updated unsuccessfully.'));
    }

    /**
     * Deletes the specified patient record(s) from the database based on the provided payload.
     *
     * @param array $payload The payload containing the patient ID(s) to be deleted.
     * @return void
     */
    private function deletePatient($payload) 
    {
        $data = array('patient_deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_patient = $this->connection->where('patient_id', $payload['ids'], 'IN')->update('tbl_patient_information', $data);

        if ($delete_patient)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Patient deleted successfully.'));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Patient deleted unsuccessfully.'));
    }

    /**
     * Decodes the user ID from the provided token using the Token class.
     *
     * @param string $token The token to be decoded.
     * @return mixed|null Returns the decoded user ID or null if the token is invalid.
     */
    private function decodeUserID($token) 
    {
        $token_decoder = new Token();
        $decoded_token = $token_decoder->decodeToken($token);

        return $decoded_token;
    }

    /**
     * Retrieves patient information for a specific user based on the provided user ID.
     * Optionally, it can filter results based on a search keyword for the patient name.
     *
     * @param int $user_id The user ID for whom to retrieve patient information.
     * @param string|null $search_keyword (Optional) The search keyword for filtering by patient name.
     * @return array Returns an array of patient information or an empty array if no results found.
     */
    private function getPatientInformation($user_id, $search_keyword = null)
    {
        $columns = array('u.user_id, p.user_id, p.patient_id, p.patient_name, p.patient_age, p.patient_home_address, p.patient_contact_number, p.patient_gender, p.patient_birthdate');
    
        $query = $this->connection->join('tbl_user_account u', 'u.user_id=p.user_id', 'INNER')->where('p.user_id', $user_id)->where('p.patient_deleted_at', null, 'IS');
    
        if ($search_keyword !== null) {
            $query->where("(patient_name like '" . $this->connection->escape($search_keyword) . "%')");
        }
    
        $getPatientInformationQuery = $query->get('tbl_patient_information p', null, $columns);
    
        return $getPatientInformationQuery;
    }
}

/**
 * Retrieve the received data from the HTTP request body and the request method.
 * Based on the request method, call the appropriate method in the Doctor class.
 *
 * @param array $received_data The data received in the HTTP request body (decoded JSON).
 * @param string $request_method The HTTP request method (GET, POST).
 * @return void
 */
$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$patient = new Patient;

if ($request_method === 'GET') {
    // If the request method is GET, call the httpGet() method in the Patient class.
    $patient->httpGet();
}

if ($request_method === 'POST') {
    // If the request method is POST, call the httpPost() method in the Patient class.
    $patient->httpPost($received_data);
}
?>