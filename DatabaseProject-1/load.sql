LOAD DATA INFILE 'CardInformation.csv'
INTO TABLE CardInformation
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(CardNumber, BillingAddress);

LOAD DATA INFILE 'Customer.csv'
INTO TABLE Customer
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(FirstName, LastName, EmailAddress, PhoneNumber, CardNumber);

LOAD DATA INFILE 'Product.csv'
INTO TABLE Product
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(ProductName, ProdDescription, Brand, Price, Category, StockQuantity, ReOrderLevel, WarehouseLocation)
SET CreatedAt = NOW(), LastUpdated = NOW();

LOAD DATA INFILE 'Orders.csv'
INTO TABLE Orders  
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(CustomerID, Status, ShippingAddress)
SET Date = NOW(), OrderTime = NOW();

LOAD DATA INFILE 'Price.csv'
INTO TABLE Price  
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(BasePrice, Discount, Tax, ShippingFee, TotalPrice);

LOAD DATA INFILE 'Payment.csv'
INTO TABLE Payment  
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(CustomerID, BasePrice, Discount, Tax, ShippingFee);

LOAD DATA INFILE 'OrderedItem.csv'
INTO TABLE OrderedItem  
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(OrderID, ProductID, PaymentID, Quantity);
