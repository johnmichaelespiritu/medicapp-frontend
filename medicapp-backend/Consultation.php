<?php
session_start();

require_once('./DB.php');

class Consultation extends DB
{
    public function httpGet($payload)
    {
        $columns = array('u.user_id, c.user_id, c.patient_id, c.doctor_id, c.consultation_id, c.patient_name, c.doctor_name, c.patient_age, c.patient_home_address, c.patient_contact_number, c.complaints, c.diagnosis, c.treatment, c.status, c.consultation_date');

        if (isset($_GET['searchKeyword'])) {

            $search_consultation = $this->connection->join('tbl_user_account u', 'u.user_id=c.user_id', 'INNER')->where('c.user_id', $_SESSION['user_id'])->where("(patient_name like '" . $_GET['searchKeyword'] . "%')")->where('c.consultation_deleted_at', null, 'IS')->get('tbl_consultation_information c', null, $columns);

            if ($search_consultation) {
                echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_consultation));
            } else {
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            }
        } else {

            $get_all_consultations = $this->connection->join('tbl_user_account u', 'u.user_id=c.user_id', 'INNER')->where('c.user_id', $_SESSION['user_id'])->where('c.consultation_deleted_at', null, 'IS')->get('tbl_consultation_information c', null, $columns);

            if ($get_all_consultations)
                echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_consultations));
            else
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
        }
    }

    public function httpPost($payload)
    {
        $data = array(
            'user_id' => $_SESSION['user_id'],
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
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Consultation added unsuccessfully.'));
    }

    public function httpPut($payload)
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
            echo json_encode(array('method' => 'PUT', 'status' => 'success', 'data' => 'Consultation information updated successfully.'));
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'Consultation information updated unsuccessfully.'));
    }

    public function httpDelete($payload)
    {
        $data = array('consultation_deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_consultation = $this->connection->where('consultation_id', $payload['payload'], 'IN')->update('tbl_consultation_information', $data);

        if ($delete_consultation)
            echo json_encode(array('method' => 'DELETE', 'status' => 'success', 'data' => ''));
        else
            echo json_encode(array('method' => 'DELETE', 'status' => 'failed', 'data' => $this->connection->getLastError()));
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

if ($request_method == 'PUT') {
    $consultation->httpPut($received_data);
}

if ($request_method == 'DELETE') {
    $consultation->httpDelete($received_data);
}
