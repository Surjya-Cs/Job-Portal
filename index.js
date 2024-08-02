const http = require('http');
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const adminRoutes = require('./routes/admin-routes');
const apiRoutes = require('./routes/api-routes');
const err = require("./middleware/errors");
var session = require("express-session");
const flash = require('connect-flash');
_ = require("underscore");

dotenv.config();
var app = express();

require("./config/database")();

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(err);

app.use(flash());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: true,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    res.locals.user_info = req.session.user;
    res.locals.token = req.session.token;
    res.locals.messages = req.flash();
    next();
});

app.use(adminRoutes.routes);
app.use('/api', apiRoutes.routes);

var server = http.createServer(app);

server.listen(process.env.PORT, function (err) {
    if (err) throw err;
    console.log("Server is running on port:" + process.env.PORT)
});