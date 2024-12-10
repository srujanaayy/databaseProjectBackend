/* getdata1a.php */
//add database name and password
?php
$cID = $_GET['CustomerID']; 
//SQL interjection if user input is something like 123' OR 1 = 1 #
//will let someone get card number of customer without knowing their ID

//new mysqli(name of host, mySQL username, password, name of database)
$conn = new mysqli("localhost", "root", "password", "db");

$sql = "SELECT CardNumber
        FROM Customer
        WHERE CustomerID = '$cID' "

$result = $conn->query($sql);
if($result) {
  while($row = $result --> fetch_assoc()) {
    printf(); //print attributes
  }
  $result->free();
}
$conn->close();
