<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;

require_once('./DB.php');

require('vendor/autoload.php');

class Login extends DB
{
	public function httpGet()
	{
		$columns = array('user_id', 'user_name', 'user_email', 'user_password');
		$get_all = $this->connection->get('tbl_user_account', null, $columns);

		if ($get_all) {
			echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $_SESSION['user_name']));
		} else {
			echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => $this->connection->getLastError()));
		}
	}

	public function httpPost($payload)
	{

		if (is_array($payload['payload']) === true) {
			// log in
			if (count($payload['payload']) === 2) {

				$search_user_id = $this->connection->where('user_email', $payload['payload']['user_email'])->where('user_password', $payload['payload']['user_password'])->getOne('tbl_user_account');

				if ($search_user_id) {
					if ($search_user_id['email_verified_at'] !== null) {
						$_SESSION['user_id'] = $search_user_id['user_id'];
						$_SESSION['user_name'] = $search_user_id['user_name'];
						echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => $search_user_id['user_id'], 'user_name' => $_SESSION['user_name']));
					} else {
						echo json_encode(array('method' => 'POST', 'status' => 'warning', 'data' => $search_user_id['user_id']));
					}
				} else {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => $this->connection->getLastError()));
				}
			}

			// sign up
			else {
				$search_user_email = $this->connection->where('user_email', $payload['payload']['user_email'])->getValue('tbl_user_account', 'user_email');
				// $encrypted_password = password_hash($payload['payload']['user_password'], PASSWORD_DEFAULT);

				if ($search_user_email === null) {

					$verification_code = $this->emailVerification($payload['payload']['user_email']);

					$add_user_account = array(
						'user_name' => $payload['payload']['user_name'],
						'user_email' => $payload['payload']['user_email'],
						'user_password' => $payload['payload']['user_password'],
						// 'user_password' => $encrypted_password,
						'verification_code' => $verification_code,
						'email_verified_at' => NULL
					);

					$new_account = $this->connection->insert('tbl_user_account', $add_user_account);

					if ($new_account)
						echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' =>  $new_account));
					else
						echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Register unsuccessfully.'));
				} else {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Email is already existing.'));
				}
			}
		} else {
			session_destroy();
			echo json_encode(array('method' => 'POST', 'status' => 'success', 'data' => 'Sign out successfully.'));
		}
	}

	public function httpPut($payload)
	{
		if (is_array($payload['payload']) === true) {
			if (
				$payload['payload']['user_email_purpose'] === 'log_in' ||
				$payload['payload']['user_email_purpose'] === 'sign_up' ||
				$payload['payload']['user_email_purpose'] === 'forgot_password'
			) {

				$verification_code = $this->connection->where('user_id', $payload['payload']['user_id'])->getValue('tbl_user_account', 'verification_code');

				date_default_timezone_set('Asia/Singapore');

				$data = array(
					'email_verified_at' => date_create()->format('Y-m-d H:i:s')
				);

				if ($payload['payload']['verification_code'] === $verification_code) {

					$this->connection->where('user_id', $payload['payload']['user_id'])->update('tbl_user_account', $data);

					echo json_encode(array('method' => 'PUT', 'status' => 'success', 'data' => $payload['payload']['user_email_purpose']));
				} else {

					echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'Verification code failed.'));
				}
			} else {

				$data = array(
					'user_password' => $payload['payload']['user_password']
				);

				$update_password = $this->connection->where('user_id', $payload['payload']['user_id'])->update('tbl_user_account', $data);

				if ($update_password)
					echo json_encode(array('method' => 'PUT', 'status' => 'success', 'data' => 'Password changed successfully.'));
				else
					echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'Password changed unsuccessfully.'));
			}
		} else {

			$search_user = $this->connection->where('user_email', $payload['payload'])->getOne('tbl_user_account');

			if ($search_user) {

				$verification_code = $this->emailVerification($search_user['user_email']);

				$data = array(
					'verification_code' => $verification_code
				);

				$this->connection->where('user_id', $search_user['user_id'])->update('tbl_user_account', $data);

				echo json_encode(array('method' => 'PUT', 'status' => 'success', 'user_email' => $search_user['user_email'], 'user_id' => $search_user['user_id']));
			} else {

				echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'data' => 'Email is not existing.'));
			}
		}
	}

	public function httpDelete($payload)
	{

	}

	private function emailVerification($user_email)
	{
		$mail = new PHPMailer(true);

		$mail->SMTPDebug = 0;

		$mail->isSMTP();

		$mail->Host = 'smtp.gmail.com';

		$mail->SMTPAuth = true;

		$mail->Username = 'medicapp.system@gmail.com';

		$mail->Password = 'fzmedkxxdyyrpnsl';

		$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

		$mail->Port = 587;

		$mail->setFrom('medicapp.system@gmail.com', 'Medicapp');

		$mail->addAddress($user_email);

		$mail->isHTML(true);

		$verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);

		$mail->Subject = 'Email verification';

		$mail->Body    = '<p>Your verification code is: <b style="font-size: 30px;">' . $verification_code . '</b></p>';

		$mail->send();

		return $verification_code;
	}
}

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$login = new Login;

if ($request_method === 'GET') {
	$login->httpGet($received_data);
}

if ($request_method === 'POST') {
	$login->httpPost($received_data);
}

if ($request_method === 'PUT') {
	$login->httpPut($received_data);
}

if ($request_method === 'DELETE') {
	$login->httpDelete($received_data);
}
