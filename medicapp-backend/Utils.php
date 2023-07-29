<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require('vendor/autoload.php');

/**
 * The Token class provides methods to encode and decode JSON Web Tokens (JWT).
 *
 * This class uses the Firebase JWT library for encoding and decoding tokens.
 * The secret key used for encoding and decoding is provided in the constructor.
 */
class Token
{
    /**
     * The secret key used for encoding and decoding JWTs.
     *
     * @var string
    */
    private $secret_key = '8H7!a0RAUXCxjuX8NXMd';

    /**
     * Encodes a new JWT with the given user ID and user name.
     *
     * @param int $user_id The ID of the user to be included in the token payload.
     * @param string $user_name The name of the user to be included in the token payload.
     * @return string The encoded JWT containing the user ID and user name.
     */
    public function encodeToken($user_id, $user_name)
    {
        $token_payload = array(
            'user_id' => $user_id,
            'user_name' => $user_name,
        );

        // Encode the token payload using the secret key and the HS256 algorithm.
        $jwt = JWT::encode($token_payload, $this->secret_key, 'HS256');
        
        return $jwt;
    }

    /**
     * Decodes the provided JWT and returns the token payload.
     *
     * If the token is valid and successfully decoded, the payload is returned as an object.
     * If the token is invalid or decoding fails, null is returned.
     *
     * @param string $token The JWT to be decoded.
     * @return object|null The decoded token payload as an object, or null if the token is invalid.
     */
    public function decodeToken($token)
    {
        try {
            // Decode the token using the secret key and the HS256 algorithm.
            $decoded_token = JWT::decode($token, new Key($this->secret_key, 'HS256'));
            return $decoded_token;
        } catch (Exception $e) {
            // Return null if an exception occurs during token decoding (i.e., token is invalid).
            return null;
        }
    }
}
?>