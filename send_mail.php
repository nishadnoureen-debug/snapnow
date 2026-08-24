<?php
// send_mail.php
// Allow from any origin (if needed) or restrict to same domain
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Fallback if data is sent as raw JSON
    $json_data = json_decode(file_get_contents('php://input'), true);
    if($json_data) {
        $_POST = array_merge($_POST, $json_data);
    }
    
    // Sanitize inputs
    $name = isset($_POST['name']) ? htmlspecialchars(strip_tags($_POST['name'])) : 'Not Provided';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : 'Not Provided';
    $phone = isset($_POST['phone']) ? htmlspecialchars(strip_tags($_POST['phone'])) : 'Not Provided';
    $date = isset($_POST['date']) && !empty($_POST['date']) ? htmlspecialchars(strip_tags($_POST['date'])) : 'Not Provided';
    $service = isset($_POST['service']) && !empty($_POST['service']) ? htmlspecialchars(strip_tags($_POST['service'])) : 'General Enquiry';
    
    // Basic validation
    if(empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name, Email, and Phone are required."]);
        exit;
    }
    
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }
    
    // Setup Email — both addresses receive every submission directly
    $to = "info@snapnow.ae, nishadnoureen@gmail.com";
    $subject = "New Booking Request: $service from $name";
    
    // Email Content (HTML)
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
        </table>
    </body>
    </html>
    ";
    
    // Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: SnapNow Website <noreply@snapnow.ae>" . "\r\n";
    $headers .= "Reply-To: $name <$email>" . "\r\n";
    
    // Send Email
    if(mail($to, $subject, $message, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Booking request sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email. Please try again later."]);
    }

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
