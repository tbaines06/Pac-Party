<?php
session_start();



ini_set('display_errors', 0);
error_reporting(E_ALL);

// Check if the user is logged in
if (!isset($_SESSION['playerID'])) {
    echo json_encode([]);
    exit;
}

$playerID = $_SESSION['playerID'];

// Establish database connection
$conn = new mysqli("localhost", "root", "", "pac-party");

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch the player's high score
$playerScore = getPlayerHighScore($playerID, $conn);


// Query to get all achievements
$sql = "SELECT achievementID, name, description, criteria FROM achievements";
$result = $conn->query($sql);

$achievements = [];
while ($row = $result->fetch_assoc()) {
    $achievementName = $row['name'];
    $achievementCriteria = $row['criteria'];
    
    
    // Compare the player's score with the achievement's criteria
    $isUnlocked = ($playerScore >= $row['criteria']);  // Unlock if score >= criteria



    // If the achievement is unlocked and the player doesn't already have it, insert it into the playerAchievements table
    if ($isUnlocked) {
        unlockAchievement($playerID, $row['achievementID'], $conn);
    }

    // Store the achievement data (locked or unlocked)
    $achievements[] = [
        'name' => $row['name'],
        'description' => $row['description'],
        'unlocked' => $isUnlocked
    ];
}

$conn->close();

// Return the achievements as a JSON response
echo json_encode($achievements, JSON_PRETTY_PRINT);
exit;

// Function to retrieve the player's highest score
function getPlayerHighScore($playerID, $conn) {
    $sql = "SELECT highest_score FROM games WHERE playerID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $playerID);
    $stmt->execute();
    $result = $stmt->get_result();
    $score = 0;
    if ($row = $result->fetch_assoc()) {
        $score = $row['highest_score'];
    }
    $stmt->close();
    return $score;
}

// Function to unlock an achievement and insert it into the playerAchievements table
function unlockAchievement($playerID, $achievementID, $conn) {
    // Validate inputs
    if (empty($achievementID)) {
        error_log("Error: Attempted to unlock achievement with NULL or empty ID for player $playerID");
        return;
    }

    // Check if the achievement is already unlocked
    $checkStmt = $conn->prepare("SELECT * FROM playerAchievements WHERE playerID = ? AND achievementID = ?");
    $checkStmt->bind_param("ii", $playerID, $achievementID);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        error_log("Notice: Achievement ID $achievementID is already unlocked for player $playerID");
        return;
    }
    
    // Insert new achievement
    $stmt = $conn->prepare("INSERT INTO playerAchievements (playerID, achievementID) VALUES (?, ?)");
    if (!$stmt) {
        error_log("Error preparing statement: " . $conn->error);
        return;
    }

    $stmt->bind_param("ii", $playerID, $achievementID);

    if ($stmt->execute()) {
        error_log("Success: Achievement ID $achievementID unlocked for player $playerID - all is working");
    } else {
        error_log("Error unlocking achievement: " . $stmt->error);
    }

    header('Content-Type: application/json');
    echo json_encode($achievements, JSON_PRETTY_PRINT);


    $stmt->close();
}

?>


