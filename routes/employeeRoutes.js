var express = require('express');
var employeeRouter = express.Router();
const {verifyAdmin,addEmployee,checkId,updateEmployee,getAllEmployee,deleteEmployeeByUsername,findEmployeeByUsername} = require("../dao/employeeDao.js");

employeeRouter.post('/verify', async(req, res) => {
    let {username,password} = req.body;
    const data = await verifyAdmin(username,password);
    res.json(data);
});

employeeRouter.post('/add/employee', async(req, res) => {
    let {username,password,name,salary,role} = req.body;
    const data = await addEmployee(username,password,name,salary,role);
    res.json(data);
});

employeeRouter.post("/checkid",async(req,res) => {
    let {username} = req.body;
    let data = await checkId(username);
    res.json(data);
})

employeeRouter.post("/update/employee",async(req,res) => {
    let {username,password,name,salary,role} = req.body;
    const data = await updateEmployee(username,password,name,salary,role);
    res.json(data);
})

employeeRouter.get("/findall",async(req,res) => {
    const data = await getAllEmployee();
    res.json(data);
})

employeeRouter.post("/delete",async(req,res) => {
    const data = await deleteEmployeeByUsername(req.body.username);
    res.json(data);
})

employeeRouter.post("/find/username",async(req,res) => {
    const data = await findEmployeeByUsername(req.body.username);
    res.json(data);
})

module.exports = employeeRouter;
