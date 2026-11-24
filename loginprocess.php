<?php
session_start(); // Start the session

// Database credentials
$servername = "localhost";
$username = "root"; // Change if necessary
$password = ""; // Change if necessary
$dbname = "pac-party";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get user inputs from the form
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST["username"];
    $pass = md5($_POST["password"]); // Hash the password with MD5

    // Prepare and execute the SQL statement
    $sql = "SELECT playerID, username FROM players WHERE username = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $user, $pass);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Store playerID and username in session
        $_SESSION["playerID"] = $row["playerID"];
        $_SESSION["username"] = $row["username"];

        // Redirect to homepage on successful login
        header("Location: homepage.html");
        exit();
    } else {
        // Alert user and keep them on the same page
        echo "<script>alert('No matching record found. Invalid username or password.'); window.location.href='login.html';</script>";
    }

    $stmt->close();
}

$conn->close();
?>
