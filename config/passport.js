var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var RentDB = require("../models/index.js");
var bcrypt = require("bcrypt-nodejs");

passport.use(
  new LocalStrategy(function(username, password, done) {
    RentDB.users
      .findOne({ where: { user_id: username } })
      .then(function(user) {
        // successful query to database
        if (!user) {
          return done("사용자 ID가 없습니다. " + username, false);
        }
        //if (user.password === password) {
        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else {
          return done("패스워드가 일치하지 않습니다.", false);
        }
      })
      .catch(function(err) {
        // something went wrong with query to db
        return done(err);
      });
  })
);

// serialize session, only store user id in the session information
//로그인이 성공하면, serializeUser 메서드를 이용하여 사용자 정보를 Session에 저장할 수 있다.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// from the user id, figure out who the user is...
//Session에 사용자 정보를 저장하고자할 경우, 사용자 정보가 크다면, 메모리가 많이 소모되기 때문에, serializeUser시에, 사용자 id와 같은 키 정보만 저장하도록 하고,
//페이지가 접근될때 마다 deserilizeUser가 수행되면,세션에 저장된 사용자 id를 이용하여 데이타베이스에서 사용자 정보를 추가로 select해서 HTTP request에 붙여서 리턴하는 형태를 사용한다.
passport.deserializeUser(function(userId, done) {
  RentDB.users
    .findOne({ where: { id: userId } })
    .then(function(user) {
      done(null, user);
    })
    .catch(function(err) {
      done(err, null);
    });
});
