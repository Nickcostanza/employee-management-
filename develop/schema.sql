DROP DATABASE IF EXISTS employee_management_systemDB;

CREATE database employee_management_systemDB;

USE employee_management_systemDB;


CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
        PRIMARY KEY(id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;