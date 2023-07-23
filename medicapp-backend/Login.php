<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once('./DB.php');
require_once('./Utils.php');

require('vendor/autoload.php');

class UserAccounts extends DB
{
    public function httpGet()
    {
        $token_decoder = new Token();
        $token = $_GET['token'];
        
        if ($token) {
            try {
                $decoded_token = $token_decoder->decodeToken($token);
                $user_name = $decoded_token->user_name;
                
                $response = array(
                    'method' => 'GET',
                    'status' => 'success',
                    'data' => $user_name
                );
            } catch (Exception $e) {
                $response = array(
                    'method' => 'GET',
                    'status' => 'failed',
                    'message' => 'Invalid token.'
                );
            }
        } else {
            $response = array(
                'method' => 'GET',
                'status' => 'failed',
                'message' => 'Token not provided.'
            );
        }

        echo json_encode($response);
    }


	public function httpPost($payload)
    {
        $action = $payload['action'];

        switch ($action) {
            case 'login':
                $this->login($payload);
                break;
            case 'signup':
                $this->signUp($payload);
                break;
            case 'verify_code':
                $this->verifyCode($payload);
                break;
            case 'resend_verification_code':
                $this->resendVerificationCode($payload);
                break;
            case 'change_password':
                $this->changePassword($payload);
                break;
            default:
                $this->signOut($payload);
                break;
        }
    }

	private function login($payload)
    {
        $user_email = $payload['user_email'];
        $user_password = $payload['user_password'];

        $search_user_id = $this->connection->where('user_email', $user_email)->getOne('tbl_user_account');

        if ($search_user_id) {
            if ($search_user_id['email_verified_at'] !== null) {
                if (password_verify($user_password, $search_user_id['user_password'])) {
                    $user_id = $search_user_id['user_id'];
                    $user_name = $search_user_id['user_name'];

                    $token_encoder = new Token();
                    $encodedToken = $token_encoder->encodeToken($user_id, $user_name);

                     $response = array(
                        'method' => 'POST',
                        'status' => 'success',
                        'message' => 'Sign in successfully.',
                        'data' => array(
                            'user_id' => $user_id,
                            'user_name' => $user_name,
                            'token' => $encodedToken,
                        ),
                    );
                } else {
                    $response = array(
                        'method' => 'POST',
                        'status' => 'failed',
                        'message' => 'Incorrect email address or password.'
                    );
                }
            } else {
                $response = array(
                    'method' => 'POST',
                    'status' => 'warning',
                    'message' => 'Please verify your email account before signing in.',
                    'data' => $search_user_id['user_id']
                );
            }
        } else {
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'User not found.'
            );
        }

        echo json_encode($response);
    }

	private function signUp($payload)
    {
        $user_name = $payload['user_name'];
        $user_email = $payload['user_email'];
        $user_password = $payload['user_password'];

        $search_user_email = $this->connection->where('user_email', $user_email)->getValue('tbl_user_account', 'user_email');

        if ($search_user_email === null) {
            $encrypted_password = password_hash($user_password, PASSWORD_DEFAULT);
            $verification_code = $this->emailVerification($user_email);

            $add_user_account = array(
                'user_name' => $user_name,
                'user_email' => $user_email,
                'user_password' => $encrypted_password,
                'verification_code' => $verification_code,
                'email_verified_at' => NULL
            );

            $new_account = $this->connection->insert('tbl_user_account', $add_user_account);

            if ($new_account) {
                $response = array(
                    'method' => 'POST',
                    'status' => 'success',
                    'message' => 'Register successfully. Please verify your email account.',
                    'data' =>  $new_account
                );
            } else {
                $response = array(
                    'method' => 'POST',
                    'status' => 'failed',
                    'message' => 'Register unsuccessfully.'
                );
            }
        } else {
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'Email is already existing.'
            );
        }

        echo json_encode($response);
    }

    private function verifyCode($payload)
    {
        $user_id = $payload['user_id'];
        $verification_code = $payload['verification_code'];
        $user_email_purpose = $payload['user_email_purpose'];

        $stored_verification_code = $this->connection->where('user_id', $user_id)->getValue('tbl_user_account', 'verification_code');

        date_default_timezone_set('Asia/Singapore');

        if ($verification_code === $stored_verification_code) {
            $data = array(
                'email_verified_at' => date_create()->format('Y-m-d H:i:s')
            );

            $this->connection->where('user_id', $user_id)->update('tbl_user_account', $data);

            $response_message = ($user_email_purpose === 'forgot_password') ?
                'You have successfully verified your account. You may now change your password.' :
                'You have successfully verified your account.';

            $response = array(
                'method' => 'POST',
                'status' => 'success',
                'message' => $response_message,
                'data' => ($user_email_purpose === 'forgot_password') ? 'forgot_password' : null
            );
        } else {
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'Verification code failed.'
            );
        }

        echo json_encode($response);
    }

    private function resendVerificationCode($payload)
    {
        $user_email = $payload['user_email'];

        $search_user = $this->connection->where('user_email', $user_email)->getOne('tbl_user_account');

        if ($search_user) {
            $verification_code = $this->emailVerification($search_user['user_email']);

            $data = array(
                'verification_code' => $verification_code
            );

            $this->connection->where('user_id', $search_user['user_id'])->update('tbl_user_account', $data);

            $response = array(
                'method' => 'POST',
                'status' => 'success',
                'message' => 'Email is existing. Please verify your email address.',
                'user_email' => $search_user['user_email'],
                'user_id' => $search_user['user_id']
            );
        } else {
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'Email is not existing.'
            );
        }

        echo json_encode($response);
    }

    private function changePassword($payload)
    {
        $user_id = $payload['user_id'];
        $user_password = $payload['user_password'];

        $encrypted_password = password_hash($user_password, PASSWORD_DEFAULT);

        $data = array(
            'user_password' => $encrypted_password
        );

        $update_password = $this->connection->where('user_id', $user_id)->update('tbl_user_account', $data);

        $response = ($update_password) ?
            array('method' => 'POST', 'status' => 'success', 'message' => 'Password changed successfully.') :
            array('method' => 'POST', 'status' => 'failed', 'message' => 'Password changed unsuccessfully.');

        echo json_encode($response);
    }

	private function signOut($payload)
    {
		$response = (true) ?
		array('method' => 'POST', 'status' => 'success', 'message' => 'Sign out successfully.') :
		array('method' => 'POST', 'status' => 'failed', 'message' => 'Sign out unsuccessfully.');

        echo json_encode($response);
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

$user_accounts = new UserAccounts;

if ($request_method === 'GET') {
	$user_accounts->httpGet();
}

if ($request_method === 'POST') {
	$user_accounts->httpPost($received_data);
}