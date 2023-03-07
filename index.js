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
          addRole();
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
    `SELECT e.id, e.first_name, e.last_name, e.role_id, r.title, r.salary, d.department_name, m.first_name "Manager Firstname",m.last_name "Manager LastName"from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id left join employee m on e.manager_id = m.id;`,
    function (err, data) {
      if (err) throw err;
      console.table(data);
      mainMenu();
    }
  );
}

function addDepartments() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        message: "What department would you like to add?",
      },
    ])
    .then(({ departmentName }) => {
      db.query(
        `INSERT INTO department (department_name)
  VALUES ("${departmentName}");`,
        function (err, data) {
          if (err) throw err;
          console.log(data);
          mainMenu();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "newRole",
        type: "input",
        message: "What would you like to name the new role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for the new role?",
      },
      {
        name: "dep",
        type: "list",
        message: "Choose the ID of the department to add to",
        choices: DeptIds(),
      },
    ])
    .then((data) => {
      console.log(data);
      let query =
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
      db.query(
        query,
        [data.newRole, data.salary, data.dep],
        function (err, data) {
          if (err) throw err;
          console.log(data);
          mainMenu();
        }
      );
    });
}

function DeptIds() {
  const deptIds = [];
  db.query("SELECT * FROM department", (error, results) => {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < results.length; i++) {
        deptIds.push(results[i].id);
      }
    }
  });
  return deptIds;
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
