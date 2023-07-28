<?php

require_once('./DB.php');
require_once('./Utils.php');

class Consultation extends DB
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
                $search_consultation = $this->getConsultationInformation($user_id, $searchKeyword);

                if ($search_consultation) 
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_consultation));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            } else {
                $get_all_consultations = $this->getConsultationInformation($user_id);
                
                if ($get_all_consultations)
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_consultations));
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
            case 'addConsultation':
                $this->addConsultation($payload);
                break;
            case 'updateConsultation':
                $this->updateConsultation($payload);
                break;
            case 'deleteConsultation':
                $this->deleteConsultation($payload);
                break;
            default:
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
        }
    }

    private function addConsultation($payload) 
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

            $add_consultation = $this->connection->insert('tbl_consultation_information', $data);

            if ($add_consultation)
                echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data, 'message' => 'Consultation added successfully.'));
            else
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Consultation added unsuccessfully.'));
        } catch (Exception $e) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

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

    private function deleteConsultation($payload) 
    {
        $data = array('consultation_deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_consultation = $this->connection->where('consultation_id', $payload['ids'], 'IN')->update('tbl_consultation_information', $data);

        if ($delete_consultation)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Consultation deleted successfully.'));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Consultation deleted unsuccessfully.'));
    }

    private function decodeUserID($token) 
    {
        $token_decoder = new Token();
        $decoded_token = $token_decoder->decodeToken($token);

        return $decoded_token;
    }

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

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$consultation = new Consultation;

if ($request_method == 'GET') {
    $consultation->httpGet($received_data);
}

if ($request_method == 'POST') {
    $consultation->httpPost($received_data);
}
