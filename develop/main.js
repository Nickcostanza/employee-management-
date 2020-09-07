const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');
const format = require('asciiart-logo');
const { isMainThread } = require('worker_threads');


//establish connection to database
var connection = mysql.Connection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Costanza26.',
    database: 'employee_management_systemdb'
});


//make sure string answer is not a number
function validateString(answer) {
    if (answer != '' && isNaN(pareseInt(answer))) {
        return true;
    }
    return false;
}

//make sure a integer is not a string 
function validateInteger(answer) {
    if (answer != '' && !isNaN(parseInt(answer))) { 
        return true;
    }
        return false;
}


//prompt ran end of main prompts
function continuePrompt() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: 'Would you like to continue?'
        }
    ]).then(function (data) {
        if (data.continue) {
            mainPrompt();
        }
        else {
            return;
        }
    })
}

function mainPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Select an option',
            choices: [
                'View all Employees',
                'Add an Employee',
                'View all Roles',
                'Add a Role'
                'View all Departments',
                'Add a New Department',
                'Update Employees Role'
            ]  
        }
    ]).then(function (answer) {
        switch(answer.mainMenu) {
            //View All Employees
            case 'View all Employees':
                var query = connection.query('SELECT * FROM employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break;
            case 'View all Departments':
                var query = connection.query('SELECT * FROM department', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break;
            
        }
    })
}

