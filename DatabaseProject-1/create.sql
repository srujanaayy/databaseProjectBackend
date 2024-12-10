CREATE DATABASE commerceDb;
USE commerceDb;

CREATE TABLE CardInformation (
    CardNumber VARCHAR(19) PRIMARY KEY,
    BillingAddress VARCHAR(255)
);

CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    EmailAddress VARCHAR(100),
    PhoneNumber VARCHAR(15),
    CardNumber VARCHAR(19),
    FOREIGN KEY (CardNumber) REFERENCES CardInformation(CardNumber)
);

CREATE TABLE Product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(255),
    ProdDescription TEXT,
    Brand VARCHAR(100),
    Price DECIMAL(10,2),
    Category VARCHAR(100),
    StockQuantity INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ReOrderLevel INT,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    WarehouseLocation VARCHAR(255)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    OrderTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Shipped', 'Delivered'),
    ShippingAddress VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE Price(
    BasePrice DECIMAL(10,2),
    Discount DECIMAL(5,2),
    Tax DECIMAL(5,2), 
    ShippingFee DECIMAL(10,2),
    TotalPrice DECIMAL(10,2), 
    PRIMARY KEY(BasePrice, Discount, Tax, ShippingFee)
);

CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    BasePrice DECIMAL(10,2),
    Discount DECIMAL(5,2),
    Tax DECIMAL(5,2), 
    ShippingFee DECIMAL(10,2),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (BasePrice) REFERENCES Price(BasePrice),
    FOREIGN KEY (Discount) REFERENCES Price(Discount),
    FOREIGN KEY (Tax) REFERENCES Price(Tax),
    FOREIGN KEY (ShippingFee) REFERENCES Price(ShippingFee)
);

CREATE TABLE OrderedItem (
    ProductID INT,
    OrderID INT, 
    PaymentID INT,
    Quantity INT,
    PRIMARY KEY (ProductID, OrderID),
    FOREIGN KEY (OrderID) REFERENCES Orders (OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID), 
    FOREIGN KEY (PaymentID) REFERENCES Payment(PaymentID)
);

