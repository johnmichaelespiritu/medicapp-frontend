<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require('vendor/autoload.php');

class Token
{
    private $secret_key = '8H7!a0RAUXCxjuX8NXMd';

    public function encodeToken($user_id, $user_name)
    {
        $token_payload = array(
            'user_id' => $user_id,
            'user_name' => $user_name,
        );

        $jwt = JWT::encode($token_payload, $this->secret_key, 'HS256');
        
        return $jwt;
    }

    public function decodeToken($token)
    {
        try {
            $decoded_token = JWT::decode($token, new Key($this->secret_key, 'HS256'));
            return $decoded_token;
        } catch (Exception $e) {
            return null;
        }
    }
}
?>
