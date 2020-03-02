var express = require("express");
var router = express.Router();
var passport = require("passport");
var RentDB = require("../models/index.js");

router.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.render("login", { user: req.user, message: "" });
  }
});

/*
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/webphone",
    failureRedirect: "/login",
    failureFlash: true
  })
);
*/

router.post("/", function(req, res, next) {
  passport.authenticate("local", async function(err, user, message) {
    if (err) {
      return res.render("login", { user: req.user, message: err });
    }
    if (!user) {
      return res.render("login", { user: req.user, message: "사용자 ID가 승인되지 않았습니다." });
    }
    var rss = req.session;
    try {
      let user = await RentDB.users.findOne({ where: { user_id: req.body.username } });
      if (user) {
        console.log("사용자 정보 query >> ");
        //console.log("AgencyCode >> " + user.AgencyCode);
        //console.log("AgencyName >> " + user.AgencyName);
        console.log("agt_id >> " + user.agt_id);
        console.log("agtgroup >> " + user.agtgroup);
        console.log("class >> " + user.class);
        rss.name = user.name;
        rss.agencycode = user.AgencyCode;
        rss.agencyname = user.AgencyName;
        rss.agt_id = user.agt_id;
        rss.agtgroup = user.agtgroup;
        rss.class = user.class;

        req.session.authenticated = true;
        req.authenticated = true;
        //req.session.save(function() {
        //  successRedirect();
        //});
      }
    } catch (err) {
      console.log("사용자 정보 query 실패 >> " + err.message);
      console.log("...stack >> " + err.stack);
      return res.render("login", { user: req.user, message: "사용자 정보 query 실패 >> " + err.message });
    }
    rss.phonedn = req.body.phoneno;
    rss.username = req.body.username;
    rss.password = req.body.password;

    //if (req.isAuthenticated()) return next();

    return res.redirect("/webphone");
  })(req, res, next);
});

module.exports = router;
