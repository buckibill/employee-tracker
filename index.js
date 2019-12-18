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
                "View All Employees", // select * from Employee
                "View All Roles",
                "View All Departments",
                "Add Employee", // insert 
                "Add Role",
                "Add Department",
                "Update Employee Roles" // update
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
    })

}


function addEmployee() {
    let questions = [
        {
            name: first_name,
            type: input,
            message: "what is the first name of the employee?"

        }, 
        {
            name: last_name,
            type: input,
            message: "what is the last name of the employee?"

        }, 
        {
            name: role_id,
            type: input,
            message: "what is the role id of the employee?"

        }, 

        {
            name: manager_id,
            type: input,
            message: "what is the manager id of the employee?"

        }
    ]
    inquirer.prompt(questions).then(answers){

        
        connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES(?, ?, ?, ?), [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], 
        function(err){
            if (err) throw err;
            console.log("added employee");
        })
    
    }

    INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES("William", "Smith", 2, 2);
}





