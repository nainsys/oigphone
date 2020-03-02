var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressSession = require("express-session");
var bodyParser = require("body-parser");
var favicon = require("serve-favicon");
var passport = require("passport");
//var flash = require("connect-flash");
var moment = require("moment");
var methodOverride = require("method-override");

var passportConfig = require("./config/passport");

var indexRouter = require("./routes/index");
var login_routes = require("./routes/login");
var logout_routes = require("./routes/logout");
var webphone_routes = require("./routes/webphone");

var app = express();
app.set("views", path.join(__dirname, "views")); // view engine setup
app.set("view engine", "ejs");
moment.locale("ko"); //시간 관련 함수 moment 의 locale을 한국으로 설정

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, "public", "phone.png")));
//app.use(flash());
app.use(
  expressSession({
    secret: "my_key_4282",
    resave: true,
    saveUninitialized: true
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize()); // Passport 사용자 설정
app.use(passport.session());

const BoardDB = require("./models/index.js");
BoardDB.sequelize
  .sync()
  .then(() => {
    console.log("===============================DB 연결 성공=====================================");
  })
  .catch(err => {
    console.log("===============================DB 연결 실패=====================================");
    console.log(err);
  });

app.use("/", indexRouter);
app.use("/login", login_routes);
app.use("/logout", logout_routes);
app.use("/webphone", webphone_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
