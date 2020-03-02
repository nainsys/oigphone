var express = require("express");
var router = express.Router();

//var http = require("http").Server(express);
//var io = require("socket.io")(http);

const oigServer = require("./oigServer.js");
var options = require("../config/config.json"); //PKEy file을 include 한다.
var oigSessionClient = oigServer.sessionClient(options.session);
var oigCallControlClient = oigServer.callControlClient(options.callControl);

var sSessionId = null;
var sIcpId = null;
var sPhoneObjId = null;
var sCallId = null;
var sAgentId = null;
/*
io.on("connection", function(socket) {
  console.log("=======>>>>>>>> user is connected <<<<<<<<==========");

  socket.on("oigmsg", function(data) {
    // 접속한 클라이언트의 정보가 수신되면
    socket.on("login", function(data) {
      console.log("=======>>>>>>>> Client logged-in:\n name:" + data.name + "\n userid: " + data.userid);

      // socket에 클라이언트 정보를 저장한다
      socket.name = data.name;
      socket.userid = data.userid;

      // 접속된 모든 클라이언트에게 메시지를 전송한다
      //io.emit("login", data.name);
    });
    // 클라이언트로부터의 메시지가 수신되면
    socket.on("oigmsg", function(data) {
      console.log("=======>>>>>>>> OIG Message from %s: %s", socket.name, data.msg);
      var msg = {
        from: {
          name: socket.name,
          userid: socket.userid
        },
        msg: data.msg
      };
      socket.emit("oigmsg", msg);
    });

    // force client disconnect from server
    socket.on("forceDisconnect", function() {
      socket.disconnect();
    });

    socket.on("disconnect", function() {
      console.log("=======>>>>>>>> user disconnected: " + socket.name);
    });
  });
});

//http.listen(8001, function() {
//  console.log("=======>>>>>>>> Socket IO server listening on port 8001 <<<<<<<<==========");
//});
*/
async function _startup() {
  console.log(">>>>>>>    Beginning startup");
  let sResult = null;
  try {
    sResult = await oigSessionClient.connect();
    if (!sResult) {
      console.log("Session connect 실패 = " + sResult);
      return false;
    }
    sResult = await oigSessionClient.loginEx();
    if (!sResult) {
      console.log("Session loginEx 실패 = " + sResult);
      return false;
    }
    console.log("sessionId: " + oigSessionClient.sessionId);
    sSessionId = oigSessionClient.sessionId;

    sResult = await oigCallControlClient.connect({ sessionId: oigSessionClient.sessionId });
    if (!sResult) {
      console.log("CallControlClient connect 실패 = " + sResult);
      return false;
    }

    //oigCallControlClient.IcpIpAddress = "192.168.10.3"; //KEVIN (중요!!)
    sResult = await oigCallControlClient.getIcpId({ IcpIpAddress: "192.168.10.3" });
    if (!sResult) {
      console.log("CallControlClient getIcpId 실패 = " + sResult);
      return false;
    }
    //console.log(sResult.result.connectionState);
    sIcpId = sResult.result.icpId;
    console.log("ICP Id: " + sResult.result.icpId);
  } catch (e) {
    console.log("Startup 실패 >> " + e.message);
    console.log("...stack >> " + e.stack);
    //res.redirect("/login");
  }
}

async function _shutdown() {
  console.log("====> Beginning shutdown");

  // Get one last event and then stop
  oigCallControlClient.getEventContinuously = false;

  //Stop Monitor 기능이 필요

  // Logout of session
  try {
    let sResult = await oigSessionClient.logout();
    if (sResult) {
      console.log("shutdown: " + sResult);
      return sResult;
    }
  } catch (e) {
    console.log("Shutdown 실패 >> " + e.message);
    console.log("...stack >> " + e.stack);
    res.redirect("/oig");
  }
}

/* GET home page. */
router.get("/", function(req, res, next) {
  var rss = req.session;
  res.render("webphone", { user: rss, miVoice: oigCallControlClient });
});

/* POST home page. */
router.post("/", async function(req, res, next) {
  console.log("================> post");
  //req.body.btnStateMsg.innerText = "test";
  console.log("== query>>" + req.query.cmd);
  if (req.query.cmd === "login") {
    console.log("-------------------------------------------");
    console.log("================> login start");
    console.log("Phoneno=" + req.session.phonedn);
    console.log("AgentID=" + req.session.agt_id);
    console.log("-------------------------------------------");
    let sResult = await _startup();
    //oigCallControlClient.primeDn = req.session.phonedn;
    sResult = await oigCallControlClient.getPhoneNumberId({ primeDn: req.session.phonedn });
    console.log("Phone Id: " + sResult.result.objectId);
    sPhoneObjId = sResult.result.objectId;
    oigCallControlClient.objectId = sResult.result.objectId;

    sResult = await oigCallControlClient.monitorObject({ objectId: sPhoneObjId });
    console.log("Monitor Start ===============" + sResult);
    //============= Evenr Monitor Callback  ========================================
    oigCallControlClient.on("advGetEvent", function(eventData) {
      //if (eventData.success && eventData.result.eventType === "CALL_EVENT") {
      var callEvent = eventData.result.eventData.callEvent;
      sCallId = callEvent.localCallId;
      console.log(">>>>>> Event <<<<<< Type : " + callEvent.type + "  Cause: " + callEvent.cause + "  State: " + callEvent.callState + "  CallID: " + callEvent.localCallId);
      io.emit("oigmsg", callEvent.type);
      //}
    });
    oigCallControlClient.advGetEvent();
    /*
    sResult = await oigCallControlClient.advGetACDAgentId({ sessionId: sSessionId, icpId: sIcpId, agentDn: req.session.agt_id });
    if (sResult) {
      sAgentId = sRtn.result.objectId;
      console.log("Acd Agent ID===" + sAgentId);
    }
*/
    console.log("================> login success");
  } else if (req.query.cmd === "logout") {
    let sRtn = await _shutdown();
    req.logout();
    res.redirect("/");
  }
  //var rss = req.session;
  //res.render("webphone", { user: rss, miVoice: oigCallControlClient });
});

module.exports = router;
