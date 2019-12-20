var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1Laurie82$",
    database: "employees_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee Roles"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    console.log("here")
                    employeePrint();
                    break;

                case "View All Roles":
                    rolePrint();
                    break;

                case "View All Departments":
                    departmentPrint();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Update Employee Roles":
                    updateEmRole();
                    break;



                case "Find artists with a top song and top album in the same year":
                    songAndAlbumSearch();
                    break;
            }
        });
}

function employeePrint() {
    var query = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT( m.first_name, " ", m.last_name ) AS manager'
    query += ' FROM employee e INNER JOIN role on e.role_id = role.id INNER JOIN department on role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id;';
    connection.query(query, function (err, res) {
        console.table(res)
    });
}

function rolePrint() {
    var query = 'SELECT * FROM role;';
    connection.query(query, function (err, res) {
        console.table(res)
    });
}

function departmentPrint() {
    var query = 'SELECT * FROM department;';
    connection.query(query, function (err, res) {
        console.table(res)
    });
}




