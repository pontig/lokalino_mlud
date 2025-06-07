-- Table: Provider
CREATE TABLE Provider (
    Provider_Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Phone_no VARCHAR(15) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    School INT NOT NULL,
    Mail_list BOOLEAN NOT NULL,
    Delivery_period INT NOT NULL,
    FOREIGN KEY (School) REFERENCES School(School_Id),
    FOREIGN KEY (Delivery_period) REFERENCES Period(P_Id)
);

-- Table: Book
CREATE TABLE Book (
    ISBN CHAR(13) PRIMARY KEY NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Editor VARCHAR(100) NOT NULL,
    Price_new DECIMAL(10, 2) NOT NULL
);

-- Table: School
CREATE TABLE School (
    School_Id SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Is_HighSchool BOOLEAN NOT NULL
);

-- Table: Adoptation (Linking Table)
CREATE TABLE Adoptation (
    A_Id SERIAL PRIMARY KEY,
    ISBN CHAR(13) NOT NULL,
    School_Id INT NOT NULL,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN),
    FOREIGN KEY (School_Id) REFERENCES School(School_Id)
);    

-- Table: Provider_Book (Linking Table)
CREATE TABLE Provider_Book (
    PB_Id SERIAL PRIMARY KEY,
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

-- Table: Period of book delivery
CREATE TABLE Period (
    P_Id SERIAL PRIMARY KEY,
    Description VARCHAR(100) NOT NULL
)
