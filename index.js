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
          "Update an employee",
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
        case "Update an employee":
          updateEmployee();
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

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "newEmployeeFirstName",
        type: "input",
        message: "What is the new employees first name?",
      },
      {
        name: "newEmployeeLastName",
        type: "input",
        message: "What is the new employees last name?",
      },
      {
        name: "employeeRole",
        type: "list",
        message: "What is the new employees role?",
        choices: empRoles(),
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the new employees manager?",
        choices: empManager(),
      },
    ])
    .then((data) => {
      console.log(data);
      let query =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      db.query(
        query,
        [
          data.newEmployeeFirstName,
          data.newEmployeeLastName,
          data.employeeRole,
          data.manager,
        ],
        function (err, data) {
          if (err) throw err;
          console.log(data);
          mainMenu();
        }
      );
    });
}

function empRoles() {
  const empRoles = [];
  db.query("SELECT * FROM role", (error, results) => {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < results.length; i++) {
        empRoles.push(results[i].id);
      }
    }
  });
  return empRoles;
}

function empManager() {
  const empManager = [];
  db.query("SELECT * FROM employee", (error, results) => {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < results.length; i++) {
        empManager.push(results[i].id);
      }
    }
  });
  return empManager;
}

function updateEmployee() {
  viewEmployeeNames().then(([results]) => {
    const employeeNames = results.map((res) => {
      return { value: res.id, name: res.first_name };
    });
    console.log(employeeNames);
    inquirer
      .prompt([
        {
          name: "empUpdate",
          type: "list",
          message: "which employees role would you like to update?",
          choices: employeeNames,
        },
        {
          name: "updatedRole",
          type: "list",
          message: "What is the employees updated role?",
          choices: empRoles(),
        },
      ])
      .then((data) => {
        console.log(data);
        let query = "UPDATE employee SET role_id = ? WHERE id = ?";
        db.query(
          query,
          [data.updatedRole, data.empUpdate],
          function (err, data) {
            if (err) throw err;
            console.log(data);
            mainMenu();
          }
        );
      });
  });
}

function viewEmployeeNames() {
  // const viewEmployeeNames = [];
  return db.promise().query("SELECT id, first_name FROM employee"); //(error, results) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     for (let i = 0; i < results.length; i++) {
  //       viewEmployeeNames.push(results[i].first_name);
  //     }
  //   }
  // });
  // return viewEmployeeNames;
}
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
