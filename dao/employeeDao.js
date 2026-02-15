const pool = require('../utils/dbconfig.js');

const isAuthenticated = false;

const verifyAdmin = async (username,password)=>{
    const query = "select * from users where username=? and role='admin'";
    const params = [username];
    try {
        const [rows] = await pool.query(query,params);
        if(rows.length > 0 && rows[0].password === password){
            return {success:true,user:rows[0]};
        }else{
            return {success:false,msg:"user not found"};
        }
    } catch (error) {
        console.log(error);
        return {success:false,msg:"db error"};
    }
}

const addEmployee = async (username,password,name,salary,role) => {
    const query = "insert into users values (?,?,?,?,?)";
    const params = [username,password,name,salary,role];
    try {
        const [result] = await pool.query(query, params);
        if (result.affectedRows > 0) {
            return { success: true, message: "Employee Added Successfully" };
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: "Username already exists" };
        }
        console.error("Database Error:", error);
        return { success: false, message: "Database error occurred" };
    }
}

const checkId = async (username) => {
    const query = "select * from users where username=?";
    const params = [username];
    try {
        const [rows] = await pool.query(query,params);
        if(rows.length > 0 ){
            return {success:true,user:rows[0]};
        }else{
            return {success:false,msg:"username not found"};
        }
    } catch (error) {
        console.log(error);
        return {success:false,msg:"db error"};
    }
}

const updateEmployee = async(username,password,name,salary,role) => {
    const query = "update users set password=?,name=?,salary=?,role=? where username=?";
    const params = [password,name,salary,role,username];
    try {
        const [result] = await pool.query(query, params);
        if (result.affectedRows > 0) {
            return { success: true, message: "Employee Updated Successfully" };
        }else {
            return { success: false, message: "Employee not found" };
        }
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Database error occurred" };
    }
}

const getAllEmployee =  async() => {
    const query = "select * from users";
    try {
        const [rows] = await pool.query(query);
        if(rows.length > 0){
            return {success:true,users:rows};
        }else{
            return {success:false,message:"No user in db"};
        }
    } catch (error) {
        console.log(error);
        return {success:false,message:"db error"};
    }
}

const deleteEmployeeByUsername = async(username) => {
    const query = "delete from users where username=?";
    const params = [username];
    try {
        const [result] = await pool.query(query,params);
        if(result.affectedRows > 0){
            return {success:true,message:"Employee Deleted Successfully"};
        }else{
            return {success:false,message:"Employee not found"};
        }
    } catch (error) {
        console.log(error);
        return {success:false,message:"db error"};
    }
}

const findEmployeeByUsername = async(username) => {
    const query = "select * from users where username = ?";
    const params = [username];
    try {
        const [rows] = await pool.query(query,params);
        if(rows.length > 0){
            return {success:true,users:rows};
        }else{
            return {success:false,message:"No user in db"};
        }
    } catch (error) {
        console.log(error);
        return {success:false,message:"db error"};
    }
}

module.exports = {verifyAdmin,addEmployee,checkId,updateEmployee,getAllEmployee,deleteEmployeeByUsername,findEmployeeByUsername}