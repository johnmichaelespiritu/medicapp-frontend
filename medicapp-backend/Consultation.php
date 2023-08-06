<?php

require_once('./DB.php');
require_once('./Utils.php');

/**
 * Class Consultation
 * Represents a Consultation entity and provides methods to interact with the database.
 */
class Consultation extends DB
{
    /**
     * Handles HTTP GET requests.
     * Retrieves consultation information based on the provided token and optional search keyword.
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
                // If search keyword is provided, retrieve consultation information with the search keyword.
                $searchKeyword = $_GET['searchKeyword'];
                $search_consultation = $this->getConsultationInformation($user_id, $searchKeyword);

                if ($search_consultation) 
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_consultation));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            } else {
                // If search keyword is not provided, retrieve all consultation information for the user.
                $get_all_consultations = $this->getConsultationInformation($user_id);
                
                if ($get_all_consultations)
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_consultations));
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
            case 'addConsultation':
                // Add a new consultation record.
                $this->addConsultation($payload);
                break;
            case 'updateConsultation':
                // Update an existing consultation record.
                $this->updateConsultation($payload);
                break;
            case 'deleteConsultation':
                // Delete one or more consultation records.
                $this->deleteConsultation($payload);
                break;
            default:
                // Return an error response if an unknown action is provided.
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
        }
    }

    /**
     * Adds a new consultation record to the database.
     *
     * @param array $payload The payload containing consultation data.
     * @return void
     */
    private function addConsultation($payload) 
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

            // Prepare the data for the new consultation record.
            $data = array(
                'user_id' => $user_id,
                'patient_id' => $payload['patient_id'],
                'doctor_id' => $payload['doctor_id'],
                'patient_name' => $payload['patient_name'],
                'doctor_name' => $payload['doctor_name'],
                'patient_age' => $payload['patient_age'],
                'patient_home_address' => $payload['patient_home_address'],
                'patient_contact_number' => $payload['patient_contact_number'],
                'complaints' => $payload['complaints'],
                'diagnosis' => $payload['diagnosis'],
                'treatment' => $payload['treatment'],
                'status' => 'Scheduled',
                'consultation_date' => $payload['consultation_date']
            );

            // Insert the new consultation record into the database.
            $add_consultation = $this->connection->insert('tbl_consultation_information', $data);

            if ($add_consultation) {
                $data['consultation_id'] = $add_consultation;
                echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data, 'message' => 'Consultation added successfully.'));
            }
            else {
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Consultation added unsuccessfully.'));
            }
        } catch (Exception $e) {
            // Return an error response if an exception occurs during token decoding.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

    /**
     * Updates the consultation information in the database based on the provided payload.
     *
     * @param array $payload The payload containing updated consultation data.
     * @return void
     */
    private function updateConsultation($payload) 
    {
        $data = array(
            'patient_id' => $payload['patient_id'],
            'doctor_id' => $payload['doctor_id'],
            'patient_name' => $payload['patient_name'],
            'doctor_name' => $payload['doctor_name'],
            'patient_age' => $payload['patient_age'],
            'patient_home_address' => $payload['patient_home_address'],
            'patient_contact_number' => $payload['patient_contact_number'],
            'complaints' => $payload['complaints'],
            'diagnosis' => $payload['diagnosis'],
            'treatment' => $payload['treatment'],
            'status' => $payload['status'],
            'consultation_date' => $payload['consultation_date']
        );

        $update_consultation = $this->connection->where('consultation_id', $payload['consultation_id'])->update('tbl_consultation_information', $data);

        if ($update_consultation)
            echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'Consultation information updated successfully.'));
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Consultation information updated unsuccessfully.'));
    }

    /**
     * Deletes the specified consultation record(s) from the database based on the provided payload.
     *
     * @param array $payload The payload containing the consultation ID(s) to be deleted.
     * @return void
     */
    private function deleteConsultation($payload) 
    {
        $data = array('consultation_deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_consultation = $this->connection->where('consultation_id', $payload['ids'], 'IN')->update('tbl_consultation_information', $data);

        if ($delete_consultation)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Consultation deleted successfully.'));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Consultation deleted unsuccessfully.'));
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
     * Retrieves consultation information for a specific user based on the provided user ID.
     * Optionally, it can filter results based on a search keyword for the patient name.
     *
     * @param int $user_id The user ID for whom to retrieve consultation information.
     * @param string|null $search_keyword (Optional) The search keyword for filtering by patient name.
     * @return array Returns an array of consultation information or an empty array if no results found.
     */
    private function getConsultationInformation($user_id, $search_keyword = null)
    {
        $columns = array('u.user_id, c.user_id, c.patient_id, c.doctor_id, c.consultation_id, c.patient_name, c.doctor_name, c.patient_age, c.patient_home_address, c.patient_contact_number, c.complaints, c.diagnosis, c.treatment, c.status, c.consultation_date');

        $query = $this->connection->join('tbl_user_account u', 'u.user_id=c.user_id', 'INNER')->where('c.user_id', $user_id)->where('c.consultation_deleted_at', null, 'IS');

        if ($search_keyword !== null) {
            $query->where("(patient_name like '" . $this->connection->escape($search_keyword) . "%')");
        }

        $getConsultationInformationQuery = $query->get('tbl_consultation_information c', null, $columns);

        return $getConsultationInformationQuery;
    }
}

/**
 * Retrieve the received data from the HTTP request body and the request method.
 * Based on the request method, call the appropriate method in the Consultation class.
 *
 * @param array $received_data The data received in the HTTP request body (decoded JSON).
 * @param string $request_method The HTTP request method (GET, POST).
 * @return void
 */
$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$consultation = new Consultation;

if ($request_method === 'GET') {
    // If the request method is GET, call the httpGet() method in the Consultation class.
    $consultation->httpGet($received_data);
}

if ($request_method === 'POST') {
    // If the request method is POST, call the httpPost() method in the Consultation class.
    $consultation->httpPost($received_data);
}
?>