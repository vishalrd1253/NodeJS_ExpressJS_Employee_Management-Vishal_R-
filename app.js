var createError = require('http-errors');
var express = require('express');
var path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.SERVER_PORT;
const cors = require('cors');

var employeeRouter = require('./routes/employeeRoutes.js');

var app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', employeeRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
    console.log("App is listening on port "+ 8086);
})
