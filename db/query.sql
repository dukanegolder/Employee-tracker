USE employee_db;


select * from department;

select * from role;

Select * from employee;

select d.id, d.department_name, r.id, r.title,r.salary from department d left join role r on d.id = r.department_id;

select e.first_name, e.last_name, e.role_id, r.title, r.salary, r.department_id, d.department_name from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id; 

SELECT e.id, e.first_name, e.last_name, e.role_id, r.title, r.salary, r.department_id, d.department_name, m.first_name "Manager Firstname",m.last_name "Manager LastName"from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id left join employee m on e.manager_id = m.id;