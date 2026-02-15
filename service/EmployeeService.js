const addEmployee = async(data) => {
    const response =  await fetch("http://localhost:8086/api/add/employee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return result;
}

const verifyAdmin = async(data) => {
    const response =  await fetch("http://localhost:8086/api/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
    const result = await response.json(); 
    return result;
}

const checkId = async(data) => {
    const response =  await fetch("http://localhost:8086/api/checkid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
    const result = await response.json(); 
    return result;
}

const updateEmployee = async(data) => {
    const response =  await fetch("http://localhost:8086/api/update/employee", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
}

const getAllEmployee = async() => {
    const response =  await fetch("http://localhost:8086/api/findall");
    const result = await response.json();
    return result;
}

const deleteEmployeeByUsername = async(data) => {
    const response =  await fetch("http://localhost:8086/api/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
} 

const getEmployeeByUsername = async(data) => {
    const response =  await fetch("http://localhost:8086/api/find/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}

module.exports = {addEmployee,verifyAdmin,checkId,updateEmployee,getAllEmployee,deleteEmployeeByUsername,getEmployeeByUsername}