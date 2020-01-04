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
                "Update Employee Roles",
                "Quit"
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

                case "Quit":
                    quit();
                    break;
            }
        });
}

function employeePrint() {
    var query = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT( m.first_name, " ", m.last_name ) AS manager'
    query += ' FROM employee e INNER JOIN role on e.role_id = role.id INNER JOIN department on role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id;';
    connection.query(query, function (err, res) {
        console.table(res)
        runSearch();
    });
}

function rolePrint() {
    var query = 'SELECT * FROM role;';
    connection.query(query, function (err, res) {
        console.table(res)
        runSearch();
    });
}

function departmentPrint() {
    var query = 'SELECT * FROM department;';
    connection.query(query, function (err, res) {
        console.table(res)
        runSearch();
    });
}

function quit() {
    connection.end();
}

function addEmployee() {
    var queryManagers = 'SELECT first_name, last_name FROM employee;';
    var employeeList = [];
    employeeList.push("None")
    connection.query(queryManagers, function (err, res) {
        res.forEach(element => {
            var employeeName = element.first_name + " " + element.last_name
            employeeList.push(employeeName)

        });
        

        var queryroles = 'SELECT title FROM role;';
        var roleList = [];
        connection.query(queryroles, function (err, res) {
            res.forEach(element => {
                //var roleName = element.first_name + " " + element.last_name
                roleList.push(element.title)

            });

            // console.log(employeeList)
            inquirer
                .prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "What is their first name?"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is their last name?"
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is their role?",
                        choices: roleList
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is their manager?",
                        choices: employeeList
                    }

                ]
                )
                .then(function (answer) {
                    let i = 0;
                    let trueI;
                    let trueJ;
                    employeeList.forEach(el => {
                        if (answer.manager === el) {
                            trueI = i;
                        } else {
                            i++;
                            // console.log(el)
                        }
                    })
                    if(i===0){
                        i = null;
                    }
                    let j = 1;
                    roleList.forEach(el => {
                        if (answer.role === el) {
                            trueJ = j;
                        } else {
                            j++;
                        }
                    })
                    var query = 'INSERT INTO employee SET ?;';
                    // console.log(i)
                    // console.log(employeeList)
                    // console.log(answer.manager)
                    connection.query(query,
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: trueJ,
                            manager_id: trueI
                        }, function (err, res) {
                            if (err) throw err;
                            //console.table(answer)
                            runSearch();
                        });
                })
        })

    })
}


function addRole() {
    var queryDepartment = 'SELECT name FROM department;';
    var departmentList = [];
    connection.query(queryDepartment, function (err, res) {
        res.forEach(element => {
            departmentList.push(element.name)

        });




        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is new title?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary?"
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department is this in?",
                    choices: departmentList
                }

            ]
            )
            .then(function (answer) {
                let i = 1;
                let trueI
                departmentList.forEach(el => {
                    if (answer.department === el) {
                        trueI=i;
                    } else {
                        i++;
                    }
                })
                var query = 'INSERT INTO role SET ?;';
                connection.query(query,
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: trueI
                    }, function (err, res) {
                        if (err) throw err;
                        //console.table(answer)
                        runSearch();
                    });
            })
    })

}


function addDepartment() {



    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What the name of the new department?"
            }

        ]
        )
        .then(function (answer) {
            var repeatBoo;
            var queryDepartment = 'SELECT name FROM department;';
            var departmentList = [];
            connection.query(queryDepartment, function (err, res) {
                res.forEach(element => {
                    if (answer.name === element) {
                        repeatBoo = true;
                        return;
                    }
                });

                if (repeatBoo) {
                    console.log("Department already exists.")
                    runSearch()
                } else {
                    var query = 'INSERT INTO department SET ?;';
                    connection.query(query,
                        {
                            name: answer.name
                        }, function (err, res) {
                            if (err) throw err;
                            //console.table(answer)
                            runSearch();
                        });
                }

            })
        })
}


function updateEmRole() {
    var queryemployee = 'SELECT first_name, last_name FROM employee;';
    var employeeList = [];
    connection.query(queryemployee, function (err, res) {
        res.forEach(element => {
            var employeeName = element.first_name + " " + element.last_name
            employeeList.push(employeeName)

        });
        var queryroles = 'SELECT title FROM role;';
        var roleList = [];
        connection.query(queryroles, function (err, res) {
            res.forEach(element => {

                roleList.push(element.title)

            });
            inquirer
                .prompt([
                    {
                        name: "name",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: employeeList
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is their new role?",
                        choices: roleList
                    }

                ]
                )
                .then(function (answer) {
                    let i = 1;
                    let trueI;
                    employeeList.forEach(el => {
                        if (answer.name === el) {
                            trueI = i;
                        } else {
                            i++;
                        }
                    })
                    let j = 1;
                    let trueJ;
                    roleList.forEach(el => {
                        if (answer.role === el) {
                            trueJ = j;
                        } else {
                            j++;
                        }
                    })
                    var query = 'UPDATE employee SET ? WHERE ?;';
                    connection.query(query,
                        [{
                            role_id: trueJ
                        },
                        {
                            id: trueI
                        }], function (err, res) {
                            if (err) throw err;
                            //console.table(answer)
                            runSearch();
                        });
                })
        })
    })
}