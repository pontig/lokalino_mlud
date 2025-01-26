-- Table: Provider
CREATE TABLE Provider (
    Provider_Id INT PRIMARY KEY NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Phone_no VARCHAR(15) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Mail_list BOOLEAN NOT NULL
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
