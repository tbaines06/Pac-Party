
<?php
// Debugging: Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
} else {
    echo "No data received.";
}
?>