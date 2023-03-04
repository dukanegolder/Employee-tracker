const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const generateResponses = require("./generateRespones");

const app = express();

inquirer.prompt([
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
    ],
  },
]);
