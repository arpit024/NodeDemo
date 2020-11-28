CREATE SCHEMA `demoDb` ;

CREATE TABLE Users (
    ID int NOT NULL auto_increment,
    FirstName varchar(255) NOT NULL,
    LastName varchar(255),
    Email varchar(255) unique NOT NULL,
    Age int,
    PRIMARY KEY (ID)
);