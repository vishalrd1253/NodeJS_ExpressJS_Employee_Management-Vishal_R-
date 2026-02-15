const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

const {
  addEmployee,
  verifyAdmin,
  checkId,
  updateEmployee,
  getAllEmployee,
  deleteEmployeeByUsername,
  getEmployeeByUsername
} = require("./service/EmployeeService.js");
const ejs = require("ejs");

let isAdminAuthenticated = false;

//##### admin username : atharv; password : admin@123

const server = http.createServer(async (req, res) => {
  if (req.url == "/") {
    indexPage(req,res);
  } else if (req.url == "/login") {
    loginPage(req,res);
  } else if (req.url === "/verify/login" && req.method === "POST") {
    verifyLogin(req,res);
  } else if (req.url === "/home") {
    isAdminAuthenticated ? homePage(req,res) : loginPage(req,res);
  } else if (req.url === "/add") {
    isAdminAuthenticated ? employeeAddPageForm(req,res): loginPage(req,res);
  } else if (req.url === "/employee/add" && req.method === "POST") {
    isAdminAuthenticated ? employeeAddRequestToServer(req,res): loginPage(req,res);
  } else if (req.url === "/update") {
    isAdminAuthenticated ? employeeUpdatePage(req,res): loginPage(req,res);
  } else if (req.url === "/check/id" && req.method === "POST") {
    isAdminAuthenticated ? checkIdOfEmployeeAndGiveUpdatePage(req,res): loginPage(req,res);
  } else if (req.url === "/update/employee" && req.method === "POST") {
    isAdminAuthenticated ? updateEmployeeInDb(req,res): loginPage(req,res);
  } else if (req.url === "/view") {
    isAdminAuthenticated ? viewAllEmployee(req,res) : loginPage(req,res);
  } else if (req.url === "/delete") {
    isAdminAuthenticated ? deleteEmployeePage(req,res): loginPage(req,res);
  } else if (req.url === "/checkid/delete" && req.method === "POST") {
    isAdminAuthenticated ? checkIdIfExistsAndDeleteEmployee(req,res): loginPage(req,res);
  } else if(req.url === "/view/username"){
    viewEmployeeByUsernamePage(req,res); //as individual employee can view its data so no authentication
  } else if(req.url === "/view/employee/username" && req.method === "POST"){
    viewEmployeeByUsernameRequest(req,res);
  }else if (req.url === "/logout") {
    logout(req,res);
  }
});

server.listen(PORT, HOST , () => {
  console.log("Server is listening on port " + PORT);
});


const indexPage = (req,res) => {
    res.writeHead(200, { "content-type": "text/html" });
    fs.readFile("./views/index.html", (err, data) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
}

const loginPage = (req,res) => {
    res.writeHead(200, { "content-type": "text/html" });
    fs.readFile("./views/login.html", (err, data) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
}

const verifyLogin = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = querystring.parse(body);

      const data = {
        username: userData.username,
        password: userData.password,
      };

      const result = await verifyAdmin(data);

      if (result.success) {
        isAdminAuthenticated = true;
        res.writeHead(200, { "content-type": "text/html" });
        fs.readFile("./views/home.html", (err, data) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            res.write(data);
            res.end();
          }
        });
      } else {
        res.writeHead(200, { "content-type": "text/html" });
        fs.readFile("./views/login.html", (err, data) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            res.write(data);
            res.end();
          }
        });
      }
    });
}

const homePage = (req,res) => {
    res.writeHead(200, { "content-type": "text/html" });
    fs.readFile("./views/home.html", (err, data) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
}

const employeeAddPageForm = (req,res) => {
    res.writeHead(200, { "content-type": "text/html" });
    fs.readFile("./views/add.html", (err, data) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
}

const employeeAddRequestToServer = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = querystring.parse(body);

      const data = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        salary: parseInt(userData.salary, 10),
        role: userData.role,
      };

      const result = await addEmployee(data);

      fs.readFile("./views/welcome.ejs", "utf-8", (err, template) => {
        if (err) {
          res.write(err);
          res.end();
        } else {
          const html = ejs.render(template, { msg: result.message });
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(html);
          res.end();
        }
      });
    });
}

const employeeUpdatePage = (req,res) => {
    fs.readFile("./views/update.ejs", "utf-8", (err, template) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        const html = ejs.render(template, { msg: "Update Employee" });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
    });
}

const checkIdOfEmployeeAndGiveUpdatePage = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = querystring.parse(body);

      const data = {
        username: userData.username,
      };

      const result = await checkId(data);

      if (result.success) {
        fs.readFile(
          "./views/updateEmployeeForm.ejs",
          "utf-8",
          (err, template) => {
            if (err) {
              res.write(err);
              res.end();
            } else {
              const html = ejs.render(template, { user: result.user });
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(html);
              res.end();
            }
          },
        );
      } else {
        fs.readFile("./views/update.ejs", "utf-8", (err, template) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            const html = ejs.render(template, { msg: result.msg });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      }
    });
}

const updateEmployeeInDb = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = querystring.parse(body);

      const data = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        salary: parseInt(userData.salary, 10),
        role: userData.role,
      };

      const result = await updateEmployee(data);

      fs.readFile("./views/welcome.ejs", "utf-8", (err, template) => {
        if (err) {
          res.write(err);
          res.end();
        } else {
          const html = ejs.render(template, { msg: result.message });
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(html);
          res.end();
        }
      });
    });
}

const viewAllEmployee = async(req,res) => {
    const result = await getAllEmployee();
    const users = result.users;

    fs.readFile("./views/viewAll.ejs", "utf-8", (err, template) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        const html = ejs.render(template, { users });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
    });
}

const deleteEmployeePage = (req,res) => {
    fs.readFile("./views/delete.ejs", "utf-8", (err, template) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        const html = ejs.render(template, { msg: "Delete Employee" });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
    });
}

const checkIdIfExistsAndDeleteEmployee = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = querystring.parse(body);

      const data = {
        username: userData.username,
      };

      const result = await checkId(data);

      if (result.success) {
        const deleteResult = await deleteEmployeeByUsername(data);

        fs.readFile("./views/welcome.ejs", "utf-8", (err, template) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            const html = ejs.render(template, { msg: deleteResult.message });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      } else {
        fs.readFile("./views/delete.ejs", "utf-8", (err, template) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            const html = ejs.render(template, { msg: result.msg });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      }
    });
}

const viewEmployeeByUsernamePage = (req,res) => {
    fs.readFile("./views/viewByUsername.ejs", "utf-8", (err, template) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        const html = ejs.render(template, { msg: "View Employee By Username" });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
    });
}

const viewEmployeeByUsernameRequest = (req,res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = querystring.parse(body);

      const data = {
        username: userData.username,
      };

      const result = await checkId(data);

      if (result.success) {
        const response = await getEmployeeByUsername(data);

        fs.readFile("./views/viewAll.ejs", "utf-8", (err, template) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            const html = ejs.render(template, { users : response.users });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      } else {
        fs.readFile("./views/viewByUsername.ejs", "utf-8", (err, template) => {
          if (err) {
            res.write(err);
            res.end();
          } else {
            const html = ejs.render(template, { msg: result.msg });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      }
    });
}

const logout = (req,res) => {
    isAdminAuthenticated = false;
    res.writeHead(200, { "content-type": "text/html" });
    fs.readFile("./views/index.html", (err, data) => {
      if (err) {
        res.write(err);
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
}
