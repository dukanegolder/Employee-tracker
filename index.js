const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});
db.connect(function (err) {
  if (err) throw err;

  console.log(`Connected to db - Welcome to Employee tracker`);
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then(({ menu }) => {
      switch (menu) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartments();
          break;
        case "Add a role":
          viewRoles();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          viewEmployeeRoles();
          break;
        default:
          db.end();
          process.exit(0);
      }
    });
}
function viewDepartments() {
  db.query("select * from department;", function (err, data) {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

function viewRoles() {
  db.query(
    "select d.id, d.department_name, r.id, r.title,r.salary from department d left join role r on d.id = r.department_id;",
    function (err, data) {
      if (err) throw err;
      console.table(data);
      mainMenu();
    }
  );
}

function viewEmployees() {
  db.query(
    `SELECT e.id, e.first_name, e.last_name, e.role_id, r.title, r.salary, r.department_id, d.department_name, m.first_name "Manager Firstname",m.last_name "Manager LastName"from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id left join employee m on e.manager_id = m.id;`,
    function (err, data) {
      if (err) throw err;
      console.table(data);
      mainMenu();
    }
  );
}

// function addDepartments(){
//   inquire -- departmnename
//   .then => db.query("insert")
// }

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
