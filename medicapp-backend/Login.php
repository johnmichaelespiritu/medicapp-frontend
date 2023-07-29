<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once('./DB.php');
require_once('./Utils.php');

require('vendor/autoload.php');

/**
 * Class UserAccounts
 * Represents a UserAccounts entity and provides methods to interact with the database.
 */
class UserAccounts extends DB
{
    /**
     * Handles HTTP GET requests.
     * Decodes the provided token and retrieves the user name from the token payload.
     * Responds with a success message containing the user name if the token is valid,
     * or an error message if the token is invalid or not provided.
     *
     * @return void
     */
    public function httpGet()
    {
        $token_decoder = new Token();
        $token = $_GET['token'];
        
        if ($token) {
            try {
                // Decode the provided token to retrieve the user name.
                $decoded_token = $token_decoder->decodeToken($token);
                $user_name = $decoded_token->user_name;
                
                // Prepare the success response containing the user name.
                $response = array(
                    'method' => 'GET',
                    'status' => 'success',
                    'data' => $user_name
                );
            } catch (Exception $e) {
                // Prepare an error response for an invalid token.
                $response = array(
                    'method' => 'GET',
                    'status' => 'failed',
                    'message' => 'Invalid token.'
                );
            }
        } else {
            // Prepare an error response for a missing token.
            $response = array(
                'method' => 'GET',
                'status' => 'failed',
                'message' => 'Token not provided.'
            );
        }

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Handles HTTP POST requests.
     * Determines the action based on the payload's 'action' field and calls the appropriate method accordingly.
     * Supported actions: 'login', 'signup', 'verify_code', 'resend_verification_code', 'change_password', 'signOut'.
     *
     * @param array $payload The payload containing the data for the specific action.
     * @return void
     */
	public function httpPost($payload)
    {
        // Extract the action from the payload.
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
                // If the 'action' field is not recognized, assume 'signOut'.
                $this->signOut();
                break;
        }
    }

    /**
     * Handles user login.
     * Verifies the provided user email and password, and generates an authentication token
     * if the login is successful. The token contains the user's ID and name.
     *
     * @param array $payload The payload containing the user email and password for login.
     * @return void
     */
	private function login($payload)
    {
        $user_email = $payload['user_email'];
        $user_password = $payload['user_password'];

        // Search for the user ID and other user account details using the provided email.
        $search_user_id = $this->connection->where('user_email', $user_email)->getOne('tbl_user_account');

        if ($search_user_id) {
            if ($search_user_id['email_verified_at'] !== null) {
                // Verify the provided password with the hashed password in the database.
                if (password_verify($user_password, $search_user_id['user_password'])) {
                    $user_id = $search_user_id['user_id'];
                    $user_name = $search_user_id['user_name'];

                    // Generate an authentication token using the user ID and name.
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
                    // The provided password is incorrect.
                    $response = array(
                        'method' => 'POST',
                        'status' => 'failed',
                        'message' => 'Incorrect email address or password.'
                    );
                }
            } else {
                // User's email is not verified yet.
                $response = array(
                    'method' => 'POST',
                    'status' => 'warning',
                    'message' => 'Please verify your email account before signing in.',
                    'data' => $search_user_id['user_id']
                );
            }
        } else {
            // User not found in the database.
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'User not found.'
            );
        }

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Handles user registration (sign up).
     * Registers a new user account with the provided user name, email, and password.
     * Generates a verification code for email verification and sends it to the user's email.
     *
     * @param array $payload The payload containing user name, email, and password for registration.
     * @return void
     */
	private function signUp($payload)
    {
        $user_name = $payload['user_name'];
        $user_email = $payload['user_email'];
        $user_password = $payload['user_password'];

        // Check if the provided email already exists in the database.
        $search_user_email = $this->connection->where('user_email', $user_email)->getValue('tbl_user_account', 'user_email');

        if ($search_user_email === null) {
            // Encrypt the user password and generate a verification code.
            $encrypted_password = password_hash($user_password, PASSWORD_DEFAULT);
            $verification_code = $this->emailVerification($user_email);

            // Create an array with the user account details for insertion.
            $add_user_account = array(
                'user_name' => $user_name,
                'user_email' => $user_email,
                'user_password' => $encrypted_password,
                'verification_code' => $verification_code,
                'email_verified_at' => NULL
            );

            // Insert the new user account into the database.
            $new_account = $this->connection->insert('tbl_user_account', $add_user_account);

            if ($new_account) {
                // Successfully registered, return a success response.
                $response = array(
                    'method' => 'POST',
                    'status' => 'success',
                    'message' => 'Register successfully. Please verify your email account.',
                    'data' =>  $new_account
                );
            } else {
                // Registration failed, return an error response.
                $response = array(
                    'method' => 'POST',
                    'status' => 'failed',
                    'message' => 'Register unsuccessfully.'
                );
            }
        } else {
            // The provided email already exists in the database.
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'Email is already existing.'
            );
        }

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Verifies the user's email verification code and updates the email_verified_at field in the database if the code is correct.
     *
     * @param array $payload The payload containing user_id, verification_code, and user_email_purpose for email verification.
     * @return void
     */
    private function verifyCode($payload)
    {
        $user_id = $payload['user_id'];
        $verification_code = $payload['verification_code'];
        $user_email_purpose = $payload['user_email_purpose'];

        // Retrieve the stored verification code for the user from the database.
        $stored_verification_code = $this->connection->where('user_id', $user_id)->getValue('tbl_user_account', 'verification_code');

        // Set the default timezone to 'Asia/Singapore'.
        date_default_timezone_set('Asia/Singapore');

        if ($verification_code === $stored_verification_code) {
            // If the provided verification code matches the stored one, update the email_verified_at field in the database.
            $data = array(
                'email_verified_at' => date_create()->format('Y-m-d H:i:s')
            );

            $this->connection->where('user_id', $user_id)->update('tbl_user_account', $data);

            // Prepare the appropriate response message based on the user_email_purpose.
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
            // If the provided verification code does not match the stored one, return an error response.
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'Verification code failed.'
            );
        }

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Resends the verification code to the user's email for email verification.
     * Updates the verification_code field in the database with the new code.
     *
     * @param array $payload The payload containing user_email for which the verification code should be resent.
     * @return void
     */
    private function resendVerificationCode($payload)
    {
        $user_email = $payload['user_email'];

        // Retrieve the user details from the database based on the provided email.
        $search_user = $this->connection->where('user_email', $user_email)->getOne('tbl_user_account');

        if ($search_user) {
            // Generate a new verification code for email verification.
            $verification_code = $this->emailVerification($search_user['user_email']);

            // Update the verification_code field in the database with the new code.
            $data = array(
                'verification_code' => $verification_code
            );

            $this->connection->where('user_id', $search_user['user_id'])->update('tbl_user_account', $data);

            // Prepare the success response with user details and the new verification code.
            $response = array(
                'method' => 'POST',
                'status' => 'success',
                'message' => 'Email is existing. Please verify your email address.',
                'user_email' => $search_user['user_email'],
                'user_id' => $search_user['user_id']
            );
        } else {
            // If the provided email does not exist in the database, return an error response.
            $response = array(
                'method' => 'POST',
                'status' => 'failed',
                'message' => 'Email is not existing.'
            );
        }

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Changes the user's password by updating the user_password field in the database.
     *
     * @param array $payload The payload containing user_id and user_password for password change.
     * @return void
     */
    private function changePassword($payload)
    {
        $user_id = $payload['user_id'];
        $user_password = $payload['user_password'];

        // Encrypt the new user password.
        $encrypted_password = password_hash($user_password, PASSWORD_DEFAULT);

        // Prepare the data to update the user_password field in the database.
        $data = array(
            'user_password' => $encrypted_password
        );

        // Update the user password in the database.
        $update_password = $this->connection->where('user_id', $user_id)->update('tbl_user_account', $data);

        // Prepare the response based on the success or failure of password update.
        $response = ($update_password) ?
            array('method' => 'POST', 'status' => 'success', 'message' => 'Password changed successfully.') :
            array('method' => 'POST', 'status' => 'failed', 'message' => 'Password changed unsuccessfully.');

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Signs out the user from the system.
     *
     * @param array $payload The payload for signing out (not used in the method).
     * @return void
     */
	private function signOut()
    {
		$response = (true) ?
		array('method' => 'POST', 'status' => 'success', 'message' => 'Sign out successfully.') :
		array('method' => 'POST', 'status' => 'failed', 'message' => 'Sign out unsuccessfully.');

        // Return the response in JSON format.
        echo json_encode($response);
    }

    /**
     * Sends an email for email verification and returns the verification code.
     *
     * @param string $user_email The email address to which the verification email should be sent.
     * @return string The generated verification code that was sent to the user's email.
     */
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

        // Generate a random 6-digit verification code.
		$verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);

		$mail->Subject = 'Email verification';

		$mail->Body    = '<p>Your verification code is: <b style="font-size: 30px;">' . $verification_code . '</b></p>';

        // Send the verification email.
		$mail->send();

        // Return the verification code, which can be used for verification purposes.
		return $verification_code;
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

$user_accounts = new UserAccounts;

if ($request_method === 'GET') {
    // If the request method is GET, call the httpGet() method in the UserAccounts class.
	$user_accounts->httpGet();
}

if ($request_method === 'POST') {
    // If the request method is POST, call the httpPost() method in the UserAccounts class.
	$user_accounts->httpPost($received_data);
}
?>