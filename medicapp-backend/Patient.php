<?php

require_once('./DB.php');
require_once('./Utils.php');

class Patient extends DB
{
    public function httpGet()
    {
        $token = isset($_GET['token']) ? $_GET['token'] : null;

        if (!$token) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Token not provided.'));
            return;
        }

        try {
            $decoded_user_id = $this->decodeUserID($_GET['token']);

            if (!$decoded_user_id) {
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
                return;
            }

            $user_id = $decoded_user_id->user_id;

            if (isset($_GET['searchKeyword'])) {
                $searchKeyword = $_GET['searchKeyword'];
                $search_patient = $this->getPatientInformation($user_id, $searchKeyword);

                if ($search_patient) 
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_patient));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            } else {
                $get_all_patients = $this->getPatientInformation($user_id);
                
                if ($get_all_patients)
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_patients));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            }
        } catch (Exception $e) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

    public function httpPost($payload)
    {
        $action = $payload['action'];

        switch ($action) {
            case 'addPatient':
                $this->addPatient($payload);
                break;
            case 'updatePatient':
                $this->updatePatient($payload);
                break;
            case 'deletePatient':
                $this->deletePatient($payload);
                break;
            default:
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
        }
    }

    private function addPatient($payload) 
    {
        $token = isset($_GET['token']) ? $_GET['token'] : null;

        if (!$token) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Token not provided.'));
            return;
        }

        try {
            $decoded_user_id = $this->decodeUserID($_GET['token']);

            if (!$decoded_user_id) {
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
                return;
            }

            $user_id = $decoded_user_id->user_id;

             $data = array(
                'user_id' => $user_id,
                'patient_name' => $payload['patient_name'],
                'patient_age' => $payload['patient_age'],
                'patient_home_address' => $payload['patient_home_address'],
                'patient_contact_number' => $payload['patient_contact_number'],
                'patient_gender' => $payload['patient_gender'],
                'patient_birthdate' => $payload['patient_birthdate']
            );

            $add_patient = $this->connection->insert('tbl_patient_information', $data);

            if ($add_patient)
                echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data, 'message' => 'Patient added successfully.'));
            else
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Patient added unsuccessfully.'));
        } catch (Exception $e) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

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

    private function deletePatient($payload) 
    {
        $data = array('patient_deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_patient = $this->connection->where('patient_id', $payload['ids'], 'IN')->update('tbl_patient_information', $data);

        if ($delete_patient)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Patient deleted successfully.'));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Patient deleted unsuccessfully.'));
    }

    private function decodeUserID($token) 
    {
        $token_decoder = new Token();
        $decoded_token = $token_decoder->decodeToken($token);

        return $decoded_token;
    }

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

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$patient = new Patient;

if ($request_method === 'GET') {
    $patient->httpGet();
}

if ($request_method === 'POST') {
    $patient->httpPost($received_data);
}