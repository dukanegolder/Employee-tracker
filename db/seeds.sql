USE employee_db;

INSERT INTO department (department_name)
VALUES ("CEO"),
       ("IT"),
       ("Sales"),
       ("Accounting"),
       ("Marketing");

INSERT INTO ROLE (title,salary,department_id)
VALUES ('CEO/Owner', 1000000, 1),
       ('IT Manager',300000, 2),
       ('Software Developer', 200000, 2),
       ('Sales Manager', 180000, 3),
       ('Sales Rep', 135000,3),
       ('Lead Accountant', 150000, 4),
       ('Jr Accountant', 100000, 4),
       ('Marketing Lead', 150000, 5);


INSERT into employee (first_name,last_name, role_id, manager_id)
VALUES ('Billy', 'Joel', 3, 2),
       ('Nick', 'Barber', 2, 3),
       ('Duke', 'Golder', 1, NULL), 
       ('Haiden', 'Bybee', 6, 3),
       ('David', 'Blaine', 5, 6),
       ('Jalen', 'Hurts', 4, 3),
       ('Anthony', 'Edwards', 7, 4),
       ('Tiger', 'Woods', 8, 3);
