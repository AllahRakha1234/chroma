<?php
require 'vendor/autoload.php';
$client = new MongoDB\Client('mongodb+srv://arakhabscs21seecs:rakha12345@webcluster.gneqvc0.mongodb.net/?retryWrites=true&w=majority');
// DATABASE AND COLLECTION ACCESS THROUGH CLIENT
$webEngDatabase = $client->webEngDatabase;
$usersData = $webEngDatabase->usersData;
// GET DATA FROM POST
if ($_POST) {
    $dataToInsert = array(
        'email' => $_POST['email'],
        'password' => $_POST['password']
    );
    // INSERTING DATA INTO MONGODB
    if ($usersData->insertOne($dataToInsert)) {
        echo '("Data inserted successfully")';
    } else {
        echo '("Error in inserting data")';
    }
}

?>