-- Table: Provider
CREATE TABLE Provider (
    Provider_Id INT PRIMARY KEY NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Phone_no VARCHAR(15) NOT NULL,
    Email VARCHAR(100) NOT NULL
);

-- Table: Book
CREATE TABLE Book (
    ISBN CHAR(13) PRIMARY KEY NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Editor VARCHAR(100) NOT NULL,
    Price_new DECIMAL(10, 2) NOT NULL
);

-- Table: Provider_Book (Linking Table)
CREATE TABLE Provider_Book (
    PB_Id INT PRIMARY KEY NOT NULL,
    ISBN CHAR(13) NOT NULL,
    Provider_Id INT NOT NULL,
    Dec_conditions VARCHAR(100) NOT NULL,
    Comment VARCHAR(200),
    Consign_date TIMESTAMP DEFAULT NULL,
    Sold_date TIMESTAMP DEFAULT NULL,
    Liquidation_date TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN),
    FOREIGN KEY (Provider_Id) REFERENCES Provider(Provider_Id)
);


-- Insert data into Provider table
INSERT INTO Provider (Provider_Id, Name, Surname, Phone_no, Email) VALUES
(1, 'John', 'Doe', '123-456-7890', 'john.doe@example.com'),
(2, 'Jane', 'Smith', '234-567-8901', 'jane.smith@example.com'),
(3, 'Alice', 'Johnson', '345-678-9012', 'alice.johnson@example.com'),
(4, 'Bob', 'Brown', '456-789-0123', 'bob.brown@example.com'),
(5, 'Charlie', 'Davis', '567-890-1234', 'charlie.davis@example.com'),
(6, 'Diana', 'Evans', '678-901-2345', 'diana.evans@example.com'),
(7, 'Eve', 'Foster', '789-012-3456', 'eve.foster@example.com'),
(8, 'Frank', 'Green', '890-123-4567', 'frank.green@example.com'),
(9, 'Grace', 'Harris', '901-234-5678', 'grace.harris@example.com'),
(10, 'Hank', 'Ivy', '012-345-6789', 'hank.ivy@example.com');

-- Insert data into Book table
INSERT INTO Book (ISBN, Title, Author, Editor, Price_new) VALUES
('9783161484100', 'Book One', 'Author A', 'Editor X', 29.99),
('9781234567897', 'Book Two', 'Author B', 'Editor Y', 19.99),
('9780123456789', 'Book Three', 'Author C', 'Editor Z', 39.99),
('9789876543210', 'Book Four', 'Author D', 'Editor W', 24.99),
('9788765432101', 'Book Five', 'Author E', 'Editor V', 34.99),
('9787654321092', 'Book Six', 'Author F', 'Editor U', 44.99),
('9786543210983', 'Book Seven', 'Author G', 'Editor T', 49.99),
('9785432109874', 'Book Eight', 'Author H', 'Editor S', 22.99),
('9784321098765', 'Book Nine', 'Author I', 'Editor R', 27.99),
('9783210987656', 'Book Ten', 'Author J', 'Editor Q', 31.99);
