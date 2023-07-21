<?php
session_start();

require_once('./DB.php');

class Doctor extends DB
{
    public function httpGet()
    {
        $columns = array('u.user_id, d.user_id, d.doctor_id, d.doctor_name, d.specialization, d.contact_number, d.email_address, d.home_address');

        if (isset($_GET['searchKeyword'])) {

            $search_doctor = $this->connection->join('tbl_user_account u', 'u.user_id=d.user_id', 'INNER')->where('d.user_id', $_SESSION['user_id'])->where("(doctor_name like '" . $_GET['searchKeyword'] . "%')")->where('d.deleted_at', null, 'IS')->get('tbl_doctor_information d', null, $columns);

            if ($search_doctor)
                echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_doctor));
            else 
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
        } else {

            $get_all_doctors = $this->connection->join('tbl_user_account u', 'u.user_id=d.user_id', 'INNER')->where('d.user_id', $_SESSION['user_id'])->where('d.deleted_at', null, 'IS')->get('tbl_doctor_information d', null, $columns);

            if ($get_all_doctors)
                echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_doctors));
            else
                echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
        }
    }

    public function httpPost($payload)
    {
        if ($this->checkDoctorExistence($payload['doctor_name'], $payload['specialization']))
            $this->addDoctor($payload);
        else 
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'The doctor you entered is already existing.'));
    }

    public function httpPut($payload)
    {
        if ($this->checkDoctorExistence($payload['doctor_name'], $payload['specialization'], $payload['doctor_id']))
            $this->updateDoctor($payload);
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'The doctor you entered is already existing.'));
    }

    public function httpDelete($payload)
    {
        $data = array('deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_doctor = $this->connection->where('doctor_id', $payload['payload'], 'IN')->update('tbl_doctor_information', $data);

        if ($delete_doctor)
            echo json_encode(array('method' => 'DELETE', 'status' => 'success', 'data' => ''));
        else
            echo json_encode(array('method' => 'DELETE', 'status' => 'failed', 'data' => $this->connection->getLastError()));
    }

    private function checkDoctorExistence($doctor_name, $specialization, $doctor_id = null)
    {
        if($doctor_id === null) {

           $search_name_specializations = $this->connection->where('user_id', $_SESSION['user_id'])->where('doctor_name', $doctor_name)->where('specialization', $specialization)->getValue('tbl_doctor_information', 'user_id', null);
           $search_name_specialization_deleted_at_null = $this->connection->where('user_id', $_SESSION['user_id'])->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS')->getValue('tbl_doctor_information', 'user_id', null);
           $search_name_specialization_deleted_at_not_null = $this->connection->where('user_id', $_SESSION['user_id'])->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS NOT')->getValue('tbl_doctor_information', 'user_id', null);

           if($search_name_specializations === null || ($search_name_specialization_deleted_at_null === null && $search_name_specialization_deleted_at_not_null !== null)) 
               return true;
           else
               return false;
        }
        else {

            $search_name_specializations = $this->connection->where('user_id', $_SESSION['user_id'])->where('doctor_name', $doctor_name)->where('specialization', $specialization)->getValue('tbl_doctor_information', 'user_id', null);
            $search_name_specialization_deleted_at_null = $this->connection->where('user_id', $_SESSION['user_id'])->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS')->where('doctor_id', $doctor_id, '=')->getValue('tbl_doctor_information', 'user_id', null);
            $search_name_specialization_deleted_at_not_null = $this->connection->where('user_id', $_SESSION['user_id'])->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS NOT')->where('doctor_id', $doctor_id, '!=')->getValue('tbl_doctor_information', 'user_id', null);
    
            if($search_name_specializations === null || ($search_name_specialization_deleted_at_null !== null || $search_name_specialization_deleted_at_not_null !== null)) 
                return true;
            else
                return false;
        }
    }

    private function addDoctor($payload)
    {
        $data = array(
            'user_id' => $_SESSION['user_id'],
            'doctor_name' => $payload['doctor_name'],
            'specialization' => $payload['specialization'],
            'contact_number' => $payload['contact_number'],
            'email_address' => $payload['email_address'],
            'home_address' => $payload['home_address']
        );

        $add_doctor = $this->connection->insert('tbl_doctor_information', $data);

        if ($add_doctor)
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data));
        else
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Doctor added unsuccessfully.'));
    }

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
            echo json_encode(array('method' => 'PUT', 'status' => 'success', 'data' => 'Doctor information updated successfully.'));
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'Doctor information updated unsuccessfully.'));
    }
}

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$doctor = new Doctor;

if ($request_method === 'GET') {
    $doctor->httpGet($received_data);
}

if ($request_method === 'POST') {
    $doctor->httpPost($received_data);
}

if ($request_method === 'PUT') {
    $doctor->httpPut($received_data);
}

if ($request_method === 'DELETE') {
    $doctor->httpDelete($received_data);
}
