<?php


function sendEmail($to, $to_name, $subject, $htmlContent)
{
    require_once("secret.php");

    $data = [
        "sender" => [
            "name" => "Lokalino mlud",
            "email" => "info@lokalino.it"
        ],
        "to" => [
            [
                "email" => $to,
                "name" => $to_name
            ]
        ],
        "subject" => $subject,
        "htmlContent" => $htmlContent
    ];

    echo "Sending email\n";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, 'https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'api-key: ' . $apiKey,
        'content-type: application/json'
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'Curl error: ' . curl_error($ch);
    } else {
        echo $response;
    }

    curl_close($ch);
}
