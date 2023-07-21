<?php
session_start();

require_once('./DB.php');

class Patient extends DB
{
    public function httpGet()
    {
        $columns = array('u.user_id, p.user_id, p.patient_id, p.patient_name, p.patient_age, p.patient_home_address, p.patient_contact_number, p.patient_gender, p.patient_birthdate');

        if (isset($_GET['searchKeyword'])) {

            $search_patient = $this->connection->join('tbl_user_account u', 'u.user_id=p.user_id', 'INNER')->where('p.user_id', $_SESSION['user_id'])->where("(patient_name like '" . $_GET['searchKeyword'] . "%')")->where('p.patient_deleted_at', null, 'IS')->get('tbl_patient_information p', null, $columns);

            if ($search_patient) {
                echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_patient));
            } else {
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            }
        } else {

            $get_all_patients = $this->connection->join('tbl_user_account u', 'u.user_id=p.user_id', 'INNER')->where('p.user_id', $_SESSION['user_id'])->where('p.patient_deleted_at', null, 'IS')->get('tbl_patient_information p', null, $columns);

            if ($get_all_patients)
                echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_patients));
            else
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
        }
    }

    public function httpPost($payload)
    {
        $data = array(
            'user_id' => $_SESSION['user_id'],
            'patient_name' => $payload['patient_name'],
            'patient_age' => $payload['patient_age'],
            'patient_home_address' => $payload['patient_home_address'],
            'patient_contact_number' => $payload['patient_contact_number'],
            'patient_gender' => $payload['patient_gender'],
            'patient_birthdate' => $payload['patient_birthdate']
        );

        $add_patient = $this->connection->insert('tbl_patient_information', $data);

        if ($add_patient)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Patient added unsuccessfully.'));
    }

    public function httpPut($payload)
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
            echo json_encode(array('method' => 'PUT', 'status' => 'success', 'data' => 'Patient information updated successfully.'));
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'Patient information updated unsuccessfully.'));
    }

    public function httpDelete($payload)
    {
        $data = array('patient_deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_patient = $this->connection->where('patient_id', $payload['payload'], 'IN')->update('tbl_patient_information', $data);

        if ($delete_patient)
            echo json_encode(array('method' => 'DELETE', 'status' => 'success', 'data' => ''));
        else
            echo json_encode(array('method' => 'DELETE', 'status' => 'failed', 'data' => $this->connection->getLastError()));
    }
}

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$patient = new Patient;

if ($request_method === 'GET') {
    $patient->httpGet($received_data);
}

if ($request_method === 'POST') {
    $patient->httpPost($received_data);
}

if ($request_method === 'PUT') {
    $patient->httpPut($received_data);
}

if ($request_method === 'DELETE') {
    $patient->httpDelete($received_data);
}
