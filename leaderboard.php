<?php
// Establish database connection
$conn = new mysqli("localhost", "root", "", "pac-party");

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch top 10 players ordered by highest score
$sql = "SELECT RANK() OVER (ORDER BY g.highest_score DESC) AS rank, 
                p.username, 
                g.highest_score 
        FROM games g
        JOIN players p ON g.playerID = p.playerID
        ORDER BY g.highest_score DESC
        LIMIT 10";

$result = $conn->query($sql);

// Start outputting table
echo '<div class="leaderboard-container"><table>';
echo '<tr><th>Rank</th><th>Username</th><th>Score</th></tr>';

// Display leaderboard if data is available
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['rank']}</td>
                <td>{$row['username']}</td>
                <td>{$row['highest_score']}</td>
              </tr>";
    }
} else {
    // Display message if no scores exist
    echo "<tr><td colspan='3'>No scores available</td></tr>";
}

echo '</table></div>';

// Close database connection
$conn->close();
?>


