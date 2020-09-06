const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');


//establish connection to database
var connection = mysql.Connection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Costanza26.',
    database: 'employee_management_systemdb'
});