<?php

require_once('./DB.php');
require_once('./Utils.php');

/**
 * Class Doctor
 * Represents a Doctor entity and provides methods to interact with the database.
 */
class Doctor extends DB
{
    /**
     * Handles HTTP GET requests.
     * Retrieves doctor information based on the provided token and optional search keyword.
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
                // If search keyword is provided, retrieve doctor information with the search keyword.
                $searchKeyword = $_GET['searchKeyword'];
                $search_doctor = $this->getDoctorInformation($user_id, $searchKeyword);

                if ($search_doctor) 
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_doctor, 'search' => 'doctor'));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            } else {
                // If search keyword is not provided, retrieve all doctor information for the user.
                $get_all_doctors = $this->getDoctorInformation($user_id);
                
                if ($get_all_doctors)
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_doctors));
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
            case 'addDoctor':
                // Add a new doctor record.
                $this->handleAddDoctor($payload);
                break;
            case 'updateDoctor':
                // Update an existing doctor record.
                $this->handleUpdateDoctor($payload);
                break;
            case 'deleteDoctor':
                // Delete one or more doctor records.
                $this->handleDeleteDoctor($payload);
                break;
            default:
                // Return an error response if an unknown action is provided.
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
        }
    }

    /**
     * Handles the process of adding a new doctor to the system.
     * If the doctor with the given name and specialization does not already exist,
     * the method will add the doctor. Otherwise, it will return an error message.
     *
     * @param array $payload The payload containing the data of the doctor to be added.
     * @return void
     */
    private function handleAddDoctor($payload)
    {
        if ($this->checkDoctorExistence($payload['doctor_name'], $payload['specialization'])) {
            // If the doctor does not exist, proceed to add the new doctor.
            $this->addDoctor($payload);
        } else {
            // If the doctor already exists, return an error message.
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'The doctor you entered is already existing.'));
        }
    }

    /**
     * Adds a new doctor record to the database.
     *
     * @param array $payload The payload containing doctor data.
     * @return void
     */
    private function addDoctor($payload)
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

            // Prepare the data for the new doctor record.
            $data = array(
                'user_id' => $user_id,
                'doctor_name' => $payload['doctor_name'],
                'specialization' => $payload['specialization'],
                'contact_number' => $payload['contact_number'],
                'email_address' => $payload['email_address'],
                'home_address' => $payload['home_address']
            );

            // Insert the new doctor record into the database.
            $add_doctor = $this->connection->insert('tbl_doctor_information', $data);

            if ($add_doctor) {
                $data['doctor_id'] = $add_doctor;
                echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data, 'message' => 'Doctor added successfully.'));
            }
            else {
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Doctor added unsuccessfully.'));
            }
        } catch (Exception $e) {
            // Return an error response if an exception occurs during token decoding.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

    /**
     * Handles the process of updating an existing doctor's information in the system.
     * If the doctor with the given name, specialization, and doctor ID already exists,
     * the method will update the doctor's information. Otherwise, it will return an error message.
     *
     * @param array $payload The payload containing the updated data of the doctor.
     * @return void
     */
    private function handleUpdateDoctor($payload)
    {
        if ($this->checkDoctorExistence($payload['doctor_name'], $payload['specialization'], $payload['doctor_id'])) {
            // If the doctor does not exist, proceed with the update.
            $this->updateDoctor($payload);
        } else {
            // If the doctor already exists, return an error message.
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'The doctor you entered is already existing.'));
        }
    }

    /**
     * Updates the doctor information in the database based on the provided payload.
     *
     * @param array $payload The payload containing updated doctor data.
     * @return void
     */
    private function updateDoctor($payload)
    {
        $data = array(
            'doctor_name' => $payload['doctor_name'],
            'specialization' => $payload['specialization'],
            'contact_number' => $payload['contact_number'],
            'email_address' => $payload['email_address'],
            'home_address' => $payload['home_address']
        );

        $update_doctor = $this->connection->where('doctor_id', $payload['doctor_id'])->update('tbl_doctor_information', $data);

        if ($update_doctor)
            echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'Doctor information updated successfully.'));
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Doctor information updated unsuccessfully.'));
    }

    /**
     * Deletes the specified doctor record(s) from the database based on the provided payload.
     *
     * @param array $payload The payload containing the doctor ID(s) to be deleted.
     * @return void
     */
    private function handleDeleteDoctor($payload)
    {
        $data = array('deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_doctor = $this->connection->where('doctor_id', $payload['ids'], 'IN')->update('tbl_doctor_information', $data);

        if ($delete_doctor) {
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Doctor deleted successfully.'));
        } else {
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Doctor deleted unsuccessfully.'));
        }
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
     * Retrieves doctor information for a specific user based on the provided user ID.
     * Optionally, it can filter results based on a search keyword for the patient name.
     *
     * @param int $user_id The user ID for whom to retrieve doctor information.
     * @param string|null $search_keyword (Optional) The search keyword for filtering by patient name.
     * @return array Returns an array of doctor information or an empty array if no results found.
     */
    private function getDoctorInformation($user_id, $search_keyword = null)
    {
        $columns = array('u.user_id, d.user_id, d.doctor_id, d.doctor_name, d.specialization, d.contact_number, d.email_address, d.home_address');

        $query = $this->connection->join('tbl_user_account u', 'u.user_id=d.user_id', 'INNER')->where('d.user_id', $user_id)->where('d.deleted_at', null, 'IS');

        if ($search_keyword !== null) {
            $query->where("(doctor_name like '" . $this->connection->escape($search_keyword) . "%')");
        }

        $getDoctorInformationQuery = $query->get('tbl_doctor_information d', null, $columns);

        return $getDoctorInformationQuery;
    }

    private function checkDoctorExistence($doctor_name, $specialization, $doctor_id = null)
    {
        // Get the token from the query string or set it to null if not provided.
        $token = isset($_GET['token']) ? $_GET['token'] : null;

        if (!$token) {
            // Get the token from the query string or set it to null if not provided.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Token not provided.'));
            return;
        }

        try {
            // Get the token from the query string or set it to null if not provided.
            $decoded_user_id = $this->decodeUserID($_GET['token']);

            if (!$decoded_user_id) {
                // Return an error response if the token is invalid.
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
                return;
            }

            // Extract the user ID from the decoded token.
            $user_id = $decoded_user_id->user_id;

            if($doctor_id === null) {
            // When adding a new doctor, check if a doctor with the same name and specialization exists,
            // or if there is a deleted doctor with the same name and specialization.
               $search_name_specializations = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->getValue('tbl_doctor_information', 'user_id', null);
               $search_name_specialization_deleted_at_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS')->getValue('tbl_doctor_information', 'user_id', null);
               $search_name_specialization_deleted_at_not_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS NOT')->getValue('tbl_doctor_information', 'user_id', null);

               if($search_name_specializations === null || ($search_name_specialization_deleted_at_null === null && $search_name_specialization_deleted_at_not_null !== null)) 
                   return true;
               else
                   return false;
            } else {
                // When updating an existing doctor, check if a doctor with the same name and specialization exists,
                // excluding the doctor with the provided doctor_id, and check for conflicting deleted records.
                $search_name_specializations = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->getValue('tbl_doctor_information', 'user_id', null);
                $search_name_specialization_deleted_at_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS')->where('doctor_id', $doctor_id, '=')->getValue('tbl_doctor_information', 'user_id', null);
                $search_name_specialization_deleted_at_not_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS NOT')->where('doctor_id', $doctor_id, '!=')->getValue('tbl_doctor_information', 'user_id', null);
        
                if($search_name_specializations === null || ($search_name_specialization_deleted_at_null !== null || $search_name_specialization_deleted_at_not_null !== null)) 
                    return true;
                else
                    return false;
            }
        } catch (Exception $e) {
            // Return an error response if an exception occurs during token decoding.
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
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

$doctor = new Doctor;

if ($request_method === 'GET') {
    // If the request method is GET, call the httpGet() method in the Doctor class.
    $doctor->httpGet();
}

if ($request_method === 'POST') {
    // If the request method is POST, call the httpPost() method in the Doctor class.
    $doctor->httpPost($received_data);
}
?>