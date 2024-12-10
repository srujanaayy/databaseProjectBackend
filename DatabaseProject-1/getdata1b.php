/* getdata1b.php */
//need to add a update statement, database name and password
?php

$cid = $_GET['CustomerID']; //possible injection: 123' OR 1 = 1 #
$pid = $_GET['PaymentID'];


//new mysqli(name of host, mySQL username, password, name of database)
$conn = new mysqli("localhost", "root", "password", "db");

$sql = "UPDATE Payment
        SET ShippingFee = 0
        WHERE CustomerID = '$cid' AND PaymentID = '$pid'"

$result = $conn->query($sql);
$conn->close();
