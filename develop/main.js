const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');
const format = require('asciiart-logo');
//const { isMainThread } = require('worker_threads');


//establish connection to database
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Costanza26.',
    database: 'employee_management_systemdb'
});


//make sure string answer is not a number
function validateString(answer) {
    if (answer != '' && isNaN(parseInt(answer))) {
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
                'Add a Role',
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
                var query = connection.query('SELECT * FROM departments', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break;
                //View All Roles
            case 'View all Roles':
                var query = connection.query('SELECT * FROM role', function (err,data) {
                    if (err) throw err;
                    console.table(data);
                    continuePrompt();
                });
                break;
                //Add Roles
            case 'Add a Role':
                var query = connection.query('SELECT id, department FROM departments', function (err, data) {
                    if (err) throw err;
                    let choices = data.map(x => `${x.id} - ${x.department}`);
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'What is the Role?',
                            validate: validateString
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter Salary',
                            validate: validateInteger
                        },
                        {
                            type: 'list',
                            name: 'department',
                            message: 'What Department?',
                            choices: [...choices]
                        }
                    ]).then(function (data) {
                        var arr = data.department.split('');
                        var deptID = parseInt(arr[0]);
                        var query = connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.title}', ${data.salary}, ${deptID})`, function (err, data) {
                            if (err) throw err;
                            console.log('Role has been Added');
                            continuePrompt();
                        });
                    });
                });
                break;
            //Added an employee
            case 'Add an Employee':
                var query = connection.query('SELECT id, title FROM role', function(err,data) {
                    if (err) throw err;
                    let choices = data.map(x => `${x.id} - ${x.title}`);
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'Employees First Name?',
                            validate: validateString
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'Employees Last Name?',
                            validate: validateString
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Select Employees Role',
                            choices: [...choices]
                        }
                    ]).then(function(data) {
                        var arr = data.role.split('');
                        var roleID = parseInt(arr[0]);
                        var query = connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.firstName}', '${data.lastName}', ${roleID}, 0)`, function (err, data) {
                            if (err) throw err;
                            console.log("Employee has been Added")
                            continuePrompt();
                        });   
                    });
                });
                break;
                //Add a department
            case "Add a New Department":
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: 'Enter the New Departments Name',
                        validate: validateString
                    }
                ]).then(function(data) {
                    var query = connection.query(`INSERT INTO departments (department) VALUES ('${data.department}');`, function(err,data) {
                        if (err) throw err;
                        return data;
                    })
                    console.log('Department Has Been Added')
                    continuePrompt();
                });
                break;
            //Update current employee
            case 'Update Employees Role':
                const emp = {
                    first_name: "",
                    last_name: "",
                    role_id: 0,
                    manager_id: 0,
                    empId: 0
                };
                var query = connection.query('SELECT id, first_name, last_name FROM employee', function(err, data) {
                    if (err) throw err;
                    let choices = data.map(x => `${x.id} - $${x.first_name} ${x.last_name}`);
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Select an Employee',
                            choices: [...choices]
                        }
                    ]).then(function(err, data) {
                        var arr = data.employee.split('');
                        emp.empID = parseInt(arr[0]);
                        inquirer.prompt([
                            {
                               type: 'input',
                               name: 'firstName', 
                               message: 'Enter Employees First Name:',
                               validate: validateString()

                            }
                        ]).then(function(data) {
                            emp.first_name = data.firstName;
                            emp.last_name = data.lastName;
                            var query = connection.query('SELECT id, title FROM role', function (err, data) {
                                if (err) throw err;
                                let choices = data.map(x => `${x.id} - ${x.title}`);
                                inquirer.prompt([
                                    {
                                        type: 'list',
                                        name: 'title',
                                        message: 'Select a Title:',
                                        choices: [...choices]
                                    }
                                ]).then(function(data) {
                                    var arr = data.title.split('');
                                    emp.role_id = parseInt(arr[0]);
                                    var query = connection.query('SELECT id, first_name, last_name FROM employee', function(err, data) {
                                        if (err) throw err;
                                        let choices = data.map(x => `${x.id} - ${x.first_name}`);
                                        choices.push('This employee does not have a Manager');
                                        inquirer.prompt([
                                            {
                                                type: 'list',
                                                name: 'manager',
                                                message: 'Select this Employees Manager:',
                                                choices: [...choices]
                                            }
                                        ]).then(function(data) {
                                            if (data.manager === 'This employee does not have a Manager') {
                                                emp.manager_id = null;
                                            }
                                            else {
                                                var arr = data.manager.split('');
                                                emp.manager_id = parseInt(arr[0]);
                                            }
                                            var query = connection.query(`UPDATE employee SET first_name = '${emp.first_name}', last_name = '${emp.last_name}', role_id = ${emp.role_id}, manager_id = ${emp.manager_id} WHERE id = ${emp.empID}`, function (err, data) {
                                                if (err) throw err;
                                                continuePrompt();
                                                return data;
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
                break;
        }
    });
}

mainPrompt();

