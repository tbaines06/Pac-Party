<?php
session_start(); // Start the session

// Check if user is logged in
if (!isset($_SESSION['playerID'])) {
    header("Location: login.html"); // Redirect to login page if not logged in
    exit();
}

// Database credentials
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "pac-party";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the playerID from the session
$playerID = $_SESSION['playerID'];

// Prepare and execute the SQL query to get the high score for the logged-in player
$sql = "SELECT highest_score FROM games WHERE playerID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $playerID);
$stmt->execute();
$result = $stmt->get_result();

// Check if a record is found
if ($row = $result->fetch_assoc()) {
    $high_score = $row['highest_score'];
} else {
    // If no score and level is found, set to 0
    $high_score = 0;
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return the high score and level as a JSON response
echo json_encode(['high_score' => $high_score]);
?>
