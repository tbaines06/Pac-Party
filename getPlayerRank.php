<?php
// Start session if using session-based authentication
session_start();

// Establish database connection
$conn = new mysqli("localhost", "root", "", "pac-party");

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Replace with actual method of retrieving the logged-in player's username
if (!isset($_SESSION['username'])) {
    die(json_encode(["error" => "User not logged in"]));
}

$username = $_SESSION['username']; // Get username from session

// Query to find the player's rank
$sql = "SELECT rank FROM (
            SELECT RANK() OVER (ORDER BY g.highest_score DESC) AS rank, 
                   p.username
            FROM games g
            JOIN players p ON g.playerID = p.playerID
        ) ranked_players
        WHERE username = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["rank" => $row['rank']]);
} else {
    echo json_encode(["error" => "Rank not found"]);
}

// Close database connection
$stmt->close();
$conn->close();
?>
