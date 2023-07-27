<?php

require_once('./DB.php');
require_once('./Utils.php');

class Doctor extends DB
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
                $search_doctor = $this->getDoctorInformation($user_id, $searchKeyword);

                if ($search_doctor) 
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $search_doctor, 'search' => 'doctor'));
                else 
                    echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
            } else {
                $get_all_doctors = $this->getDoctorInformation($user_id);
                
                if ($get_all_doctors)
                    echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $get_all_doctors));
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
            case 'addDoctor':
                $this->handleAddDoctor($payload);
                break;
            case 'updateDoctor':
                $this->handleUpdateDoctor($payload);
                break;
            case 'deleteDoctor':
                $this->handleDeleteDoctor($payload);
                break;
            default:
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
        }
    }

    private function handleAddDoctor($payload)
    {
        if ($this->checkDoctorExistence($payload['doctor_name'], $payload['specialization'])) {
            $this->addDoctor($payload);
        } else {
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'The doctor you entered is already existing.'));
        }
    }

    private function addDoctor($payload)
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
                'doctor_name' => $payload['doctor_name'],
                'specialization' => $payload['specialization'],
                'contact_number' => $payload['contact_number'],
                'email_address' => $payload['email_address'],
                'home_address' => $payload['home_address']
            );

            $add_doctor = $this->connection->insert('tbl_doctor_information', $data);

            if ($add_doctor)
                echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $data, 'message' => 'Doctor added successfully.'));
            else
                echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Doctor added unsuccessfully.'));
        } catch (Exception $e) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }

    private function handleUpdateDoctor($payload)
    {
        if ($this->checkDoctorExistence($payload['doctor_name'], $payload['specialization'], $payload['doctor_id'])) {
            $this->updateDoctor($payload);
        } else {
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'The doctor you entered is already existing.'));
        }
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
            echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'Doctor information updated successfully.'));
        else
            echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Doctor information updated unsuccessfully.'));
    }

    private function handleDeleteDoctor($payload)
    {
        $data = array('deleted_at' => date_create()->format('Y-m-d H:i:s'));
        $delete_doctor = $this->connection->where('doctor_id', $payload['doctor_ids'], 'IN')->update('tbl_doctor_information', $data);

        if ($delete_doctor) {
            echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Doctor deleted successfully.'));
        } else {
            echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Doctor deleted unsuccessfully.'));
        }
    }

    private function decodeUserID($token) 
    {
        $token_decoder = new Token();
        $decoded_token = $token_decoder->decodeToken($token);

        return $decoded_token;
    }

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

            if($doctor_id === null) {

               $search_name_specializations = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->getValue('tbl_doctor_information', 'user_id', null);
               $search_name_specialization_deleted_at_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS')->getValue('tbl_doctor_information', 'user_id', null);
               $search_name_specialization_deleted_at_not_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS NOT')->getValue('tbl_doctor_information', 'user_id', null);

               if($search_name_specializations === null || ($search_name_specialization_deleted_at_null === null && $search_name_specialization_deleted_at_not_null !== null)) 
                   return true;
               else
                   return false;
            } else {

                $search_name_specializations = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->getValue('tbl_doctor_information', 'user_id', null);
                $search_name_specialization_deleted_at_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS')->where('doctor_id', $doctor_id, '=')->getValue('tbl_doctor_information', 'user_id', null);
                $search_name_specialization_deleted_at_not_null = $this->connection->where('user_id', $user_id)->where('doctor_name', $doctor_name)->where('specialization', $specialization)->where('deleted_at', null, 'IS NOT')->where('doctor_id', $doctor_id, '!=')->getValue('tbl_doctor_information', 'user_id', null);
        
                if($search_name_specializations === null || ($search_name_specialization_deleted_at_null !== null || $search_name_specialization_deleted_at_not_null !== null)) 
                    return true;
                else
                    return false;
            }
        } catch (Exception $e) {
            echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'Invalid token.'));
        }
    }
}

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$doctor = new Doctor;

if ($request_method === 'GET') {
    $doctor->httpGet();
}

if ($request_method === 'POST') {
    $doctor->httpPost($received_data);
}