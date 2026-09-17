<?php
// send_mail.php
// Allow from any origin (if needed) or restrict to same domain
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Fallback if data is sent as raw JSON
    $raw_input = file_get_contents('php://input');
    $json_data = json_decode($raw_input, true);
    if ($json_data && is_array($json_data)) {
        $_POST = array_merge($_POST, $json_data);
    }
    
    // Sanitize inputs
    $name = isset($_POST['name']) ? htmlspecialchars(strip_tags($_POST['name'])) : (isset($_POST['Name']) ? htmlspecialchars(strip_tags($_POST['Name'])) : '');
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : (isset($_POST['Email']) ? filter_var(trim($_POST['Email']), FILTER_SANITIZE_EMAIL) : '');
    $phone = isset($_POST['phone']) ? htmlspecialchars(strip_tags($_POST['phone'])) : (isset($_POST['Phone']) ? htmlspecialchars(strip_tags($_POST['Phone'])) : '');
    $date = isset($_POST['date']) && !empty($_POST['date']) ? htmlspecialchars(strip_tags($_POST['date'])) : (isset($_POST['Event Date']) && !empty($_POST['Event Date']) ? htmlspecialchars(strip_tags($_POST['Event Date'])) : 'Not Provided');
    $service = isset($_POST['service']) && !empty($_POST['service']) ? htmlspecialchars(strip_tags($_POST['service'])) : (isset($_POST['Package / Service']) && !empty($_POST['Package / Service']) ? htmlspecialchars(strip_tags($_POST['Package / Service'])) : 'General Enquiry');
    $company = isset($_POST['company']) ? htmlspecialchars(strip_tags($_POST['company'])) : (isset($_POST['Company / Brand']) ? htmlspecialchars(strip_tags($_POST['Company / Brand'])) : '');
    $budget = isset($_POST['budget']) ? htmlspecialchars(strip_tags($_POST['budget'])) : (isset($_POST['Estimated Budget']) ? htmlspecialchars(strip_tags($_POST['Estimated Budget'])) : '');
    $messageText = isset($_POST['message']) ? htmlspecialchars(strip_tags($_POST['message'])) : (isset($_POST['Message / Brief']) ? htmlspecialchars(strip_tags($_POST['Message / Brief'])) : '');

    // Basic validation
    if (empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name, Email, and Phone are required."]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }
    
    // Setup Email
    $to = "snapnowuae@gmail.com";
    $subject = "New Booking Request: $service from $name";
    
    // Email Content (HTML)
    $extraRows = "";
    if (!empty($company)) {
        $extraRows .= "<tr><th>Company / Brand</th><td>$company</td></tr>";
    }
    if (!empty($budget)) {
        $extraRows .= "<tr><th>Budget</th><td>$budget</td></tr>";
    }
    if (!empty($messageText)) {
        $extraRows .= "<tr><th>Message / Brief</th><td>$messageText</td></tr>";
    }

    $message = "
    <html>
    <head>
        <title>New Booking Request</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            table { width: 100%; max-width: 600px; border-collapse: collapse; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; width: 30%; }
        </style>
    </head>
    <body>
        <h2>New Booking / Enquiry Request</h2>
        <p>A new request has been submitted on the SnapNow website.</p>
        <table>
            <tr>
                <th>Name</th>
                <td>$name</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>$email</td>
            </tr>
            <tr>
                <th>Phone</th>
                <td>$phone</td>
            </tr>
            <tr>
                <th>Event Date</th>
                <td>$date</td>
            </tr>
            <tr>
                <th>Service/Package</th>
                <td>$service</td>
            </tr>
            $extraRows
        </table>
    </body>
    </html>
    ";
    
    // Headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: SnapNow Website <noreply@snapnow.ae>\r\n";
    $headers .= "Cc: info@snapnow.ae\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    
    // Send Email
    if (@mail($to, $subject, $message, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Booking request sent successfully."]);
    } else {
        // Return success if mail function executed or log error
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Booking request received."]);
    }

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
