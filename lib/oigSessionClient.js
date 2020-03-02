"use strict";
const EventEmitter = require("events");
const Promise = require("promise");
const crypto = require("crypto");
const soap = require("soap"); // Setup SOAP client

/* ============== 전체 함수 정리  ===================
constructor(options) : 생성자
get keepAlive() : 타이머가 설정되어 있는지 확인
connect(options, callback) : soap client 생성
loginEx(options, callback) : OIG에 로그인
authenticate(options, callback) : 인증 방법에 서명하는 개인 키
logout(options, callback) : 로그아웃
resetSessionTimer(client, callback) : 세션 타이머 재설정
serviceVersions(options, callback) : OIG버전 확인
_signAuthenticationData(data, privateKey) : 사용자 키 생성
----------------------------------------------------*/

class oigSessionClient extends EventEmitter {
  /**
   * @typedef Options
   * @type {object}
   * @param {number} [Options[].sessionId] - To re-use an existing sessionId
   * @param {string} [Options[].protocol=https] - HTTP or HTTPS
   * @param {string} [Options[].server] - Name or IP of OIG server
   * @param {string} [Options[].endpoint] - Full URL of endpoint.  If not provided, use protocol, server and servicePath to calculate endpoint.
   * @param {string} [Options[].servicePath=/axis2/services/SessionService/] - Path to the service, used with protocol and server to set endpoint if endpoint is not directly set
   * @param {string} [Options[].wsdl=./wsdl_oig/sessionManagement/SessionService.wsdl] - URL/path to the WSDL
   * @param {string} [Options[].version=4.0] - Version this client is using, MUST match WSDL and be equal or less then OIG server.
   * @param {string} [Options[].localPassword] - 각 응용 프로그램에는 Mitel OIG에 정의된 로컬 암호가 필요. 응용 프로그램은 런타임시 로컬 암호 입력을 허용해야한다.
   * @param {string} [Options[].companyName] - The company name
   * @param {string} [Options[].applicationName] - The application name
   * @param {string} [Options[].applicationPassword] - The application password
   * @param {string} [Options[].version=4.1] - The Version attribute must be set to match the version of the Mitel OIG server being used (eg, 2.1).
   * @param {string} [Options[].certificate] - Mitel OIG의 서비스가 필요한 각 응용 프로그램에는 Mitel 인증서가 필요. Mitel OnLine MSA 웹 포털을 사용하여 Mitel 인증서를 요청.
   * @param {boolean} [Options[].autoAuthenticate=true] - 프로그램은 로그인 한 후 인증해야합니다. true이고 privateKey가 설정되어 있으면 loginEx는 콜백 전에 자동으로 인증을 시도합니다
   * @param {string} [Options[].privateKey] - 인증 방법에 서명하는 개인 키. 모듈 내에서 loginEx 결과에 서명하는 경우 Advanced 애플리케이션에서만 사용
   * @param {boolean} [Options[].autoKeepAlive=true] - loginEx 또는 인증 후 (고급 응용 프로그램), sessionTimer 초마다 resetSessionTimer를 호출하도록 타이머를 설정해야합니다.
   * @param {number} [Options[].sessionTimer=5] - In Seconds.  The application must call resetSessionTimer with a frequency less than every 10 seconds.  Used with autoKeepAlive.
   */

  /**====================================================================
   * Mitel OIG session SOAP client 생성자
   * @param {Options} [options] - Options에서 config.json파일을 읽어 필요한 기본 사항들이 전달 된다.
   *=====================================================================*/
  constructor(options) {
    super();
    var _this = this;

    // Defaults
    _this._defaults = {
      _soap_client: null,
      sessionId: null,
      endpoint: null, // Current OIG implementation returns an invalid endpoint in the returned WSDL, this is calculated later from protocol, server and servicePath
      server: null, // Required
      protocol: "https",
      servicePath: "/axis2/services/SessionService/",
      wsdl: "./wsdl_oig/sessionManagement/SessionService.wsdl",
      version: "4.1",
      autoAuthenticate: true,
      privateKey: null,
      signedAuthenticationData: null,
      authenticationData: null,
      autoKeepAlive: true,
      sessionTimer: 5, // In seconds
      _keepAliveSet: null, // set to Timeout after setInterval for autoKeepAlive
      serviceVersionsResults: null,
      lastError: null
    };

    // Setup defaults and overide with passed options
    Object.assign(_this, _this._defaults, options);
  }

  /**=============================================
   * keepAlive 타이머가 설정되어 있는지 확인
   * @return {boolean}
   ===============================================*/
  get keepAlive() {
    var _this = this;
    if (_this._keepAliveSet != null) {
      return true;
    } else {
      return false;
    }
  }

  /**=============================================
   * @callback errorSuccessCallback
   * @param {Error} err - Error object, null if sucess is true
   * @param {boolean} success - boolean indicating success or failure
   =============================================
   * Configures a new soap client.
   * If not called prior to other functions it witll be called using default + constructor options.
   * It is provided here to allow for additional options and error handling.
   * @param {Options} [options] - Takes the same options as the constructor
   * @param {errorSuccessCallback} [callback] - If no callback, function returns a promise with success as value
   =============================================*/
  connect(options, callback) {
    var _this = this;
    if (options === undefined) {
      // 아무런 파라메터가 없다면
      options = {};
      callback = function(err, success) {};
    } else if (typeof options === "function") {
      // Callback 이 첫번째 파라메터라면
      callback = options;
      options = {};
    } else {
      callback = typeof callback === "function" ? callback : function() {};
    }

    // Copy over any options to use
    Object.assign(_this, options);

    // Establish the endpoint to use
    if (_this.endpoint == null) {
      // Calculate using protocol, server, ServicePath
      if (_this.server == null) {
        throw new Error("Either endpoint or server MUST be specified");
      }
      _this.endpoint = _this.protocol + "://" + _this.server + _this.servicePath;
    }

    // Ignore self signed certificate error
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    return soap.createClientAsync(_this.wsdl, _this).then(
      function(client) {
        console.log(`>>> Soap[wsdl] createClient OK <<<<<`);
        _this._soap_client = client;
        callback(null, true);
        return true;
      },
      function(err) {
        console.log(`>>> Soap[wsdl] Error <<<<<: ${err.message}`); //KEVIN
        _this.lastError = err;
        callback(err, false);
        return false;
      }
    );
  }

  /**=============================================
   * @callback loginExCallback
   * @param {Error} err - Error object, null if sucess is true
   * @param {boolean} success - boolean indicating success or failure
   * @param {number} [sessionId] - If success, the resulting sessionId.  Also set on client.
   * @param {string} [applicationData] - If success and ADVANCED login, returns the applicationData to sign.  Also set on client.  aka authenticationData
   =============================================
    * Performs a login, establishing a sessionId
   * @param {Options} [options] - Takes the same options as the constructor
   * @param {loginExCallback} [callback] - If no callback, function returns a promise with success as value
   =============================================*/

  loginEx(options, callback) {
    var _this = this;
    if (options === undefined) {
      options = {};
      callback = function(err, success) {};
    } else if (typeof options === "function") {
      callback = options;
      options = {};
    } else {
      callback = typeof callback === "function" ? callback : function() {};
    }

    Object.assign(_this, options);

    if (_this._soap_client == null) {
      return _this.connect().then(
        function() {
          return _this.loginEx(options, callback);
        },
        function(err) {
          _this.lastError = err;
          callback(err);
          return;
        }
      );
    } else {
      // Already have a soap client, attempt to login
      var params = {
        req: {
          "ns1:applicationName": _this.applicationName,
          "ns1:companyName": _this.companyName,
          "ns1:applicationPassword": _this.applicationPassword,
          "ns1:localPassword": _this.localPassword,
          "ns1:version": _this.version
        }
      };

      if (_this.certificate != null) {
        // Advanced login
        params.req["ns1:certificate"] = _this.certificate;
      }

      return _this._soap_client
        .loginExAsync(params)
        .then(function(result) {
          if (result.length > 0) result = result[0];
          _this.sessionId = result.return.attributes.sessionId;
          return result;
        })
        .then(function(result) {
          if (_this.autoKeepAlive && _this._keepAliveSet === null) {
            setInterval(_this.resetSessionTimer, _this.sessionTimer * 1000, _this);
            _this._keepAliveSet = true;
          }
          return result;
        })
        .then(
          function(result) {
            if (_this.certificate != null) {
              _this.authenticationData = result.return.authenticationData;
              _this.signedAuthenticationData = _this._signAuthenticationData(_this.authenticationData, _this.privateKey);
              if (_this.autoAuthenticate) {
                // Now attempt to authenticate the login
                return _this.authenticate(callback);
              } else {
                callback(null, true, _this.sessionId, _this.authenticationData);
                return true;
              }
            } else {
              callback(null, true, _this.sessionId);
              return true;
            }
          },
          function(err) {
            _this.lastError = err;
            callback(err, false);
            return false;
          }
        );
    }
  }

  /**=============================================
   * For ADVANCED applications, authenticate using private key
   * @param {Options} [options] - Takes the same options as the constructor
   * @param {loginExCallback} [callback] - If no callback, function returns a promise with success as value
   =============================================*/
  authenticate(options, callback) {
    var _this = this;
    if (options === undefined) {
      options = {};
      callback = function(err, success) {};
    } else if (typeof options === "function") {
      callback = options;
      options = {};
    } else {
      callback = typeof callback === "function" ? callback : function() {};
    }

    Object.assign(_this, options);

    if (_this._soap_client == null || _this.sessionID === null) {
      return _this.loginEx(callback).then(function(success) {
        if (success == true) {
          return _this.authenticate(callback);
        }
      });
    } else {
      // Already have a soap client, attempt to authenticate
      var params = {
        req: {
          attributes: {
            sessionId: _this.sessionId
          },
          "ns1:signedAuthenticationData": _this.signedAuthenticationData
        }
      };

      return _this._soap_client.authenticateAsync(params).then(
        function(result) {
          if (result.length > 0) result = result[0];
          if (result.return.attributes.result == "false") {
            callback(new Error(result.return.errorDescription), false);
            return false;
          } else {
            _this.sessionId = result.return.attributes.sessionId;
            if (_this.autoKeepAlive && _this._keepAliveSet === null) {
              _this._keepAliveSet = setInterval(_this.resetSessionTimer, _this.sessionTimer * 1000, _this);
            }
            callback(null, true, _this.sessionId, null);
            return true;
          }
        },
        function(err) {
          _this.lastError = err;
          callback(err, false);
          return false;
        }
      );
    }
  }

  /**=============================================
   * Logs out of a session.  Note: If an application does not close all monitors before logging out, the Mitel OIG ensures that monitors are closed properly.
   * @param {number} [sessionId] - Defaults to this sessionId
   * @param {errorSuccessCallback} [callback] - If no callback, function returns a promise with success as value
   =============================================*/
  logout(options, callback) {
    var _this = this;
    if (options === undefined) {
      options = {};
      callback = function(err, success) {};
    } else if (typeof options === "function") {
      callback = options;
      options = {};
    } else {
      callback = typeof callback === "function" ? callback : function() {};
    }

    Object.assign(_this, options);

    if (_this._soap_client == null || _this.sessionID === null) {
      return new Promise(function(resolve, reject) {
        resolve(true);
      });
    } else {
      var params = {
        sessionId: _this.sessionId
      };

      return _this._soap_client.logoutAsync(params).then(
        function(result) {
          _this.sessionId = null;
          if (_this._keepAliveSet != null) {
            clearInterval(_this._keepAliveSet);
          }
          callback(null, true);
          return true;
        },
        function(err) {
          _this.lastError = err;
          callback(err, false);
          return false;
        }
      );
    }
  }

  /**=============================================
   * 세션 타이머를 재설정. 애플리케이션은 10 초 미만의 빈도로 resetSessionTimer를 호출해야한다. autoKeepAlive가 true이면 sessionTimer 초마다 타이머를 통해 자동으로 호출한다.
   * @param {oigSessionClient} [client] - ONLY provide if calling with a timer so that I can get the client object, otherwise assumes calling instance.
   * @param {errorSuccessCallback} [callback] - If no callback, function returns a promise with success as value
  ============================================= */
  resetSessionTimer(client, callback) {
    var _this = this;

    if (client === undefined) {
      callback = function(err, success) {};
    } else if (typeof client === "function") {
      callback = client;
    } else {
      _this = client;
      callback = typeof callback === "function" ? callback : function() {};
    }

    if (_this._soap_client == null || _this.sessionID === null) {
      return new Promise(function(resolve, reject) {
        callback(null, true);
        resolve(true);
      });
    } else {
      var params = {
        sessionId: _this.sessionId
      };

      return _this._soap_client.resetSessionTimerAsync(params).then(
        function(result) {
          callback(null, true);
          return true;
        },
        function(err) {
          _this.lastError = err;
          callback(err, false);
          return false;
        }
      );
    }
  }

  /**=============================================
   * @callback serviceVersionsCallback
   * @param {Error} err
   * @param {boolean} success
   * @param {string} [serviceVersionsResults] - if success true, the software versions for Mitel OIG and the connected MiVoice Business.
    =============================================
   * This operation obtains the software version of the Mitel OIG and the version of any connected MiVoice Business.
   * @param {number} [sessionId] - Defaults to this sessionId
   * @param {serviceVersionsCallback} [callback] - If no callback, function returns a promise with success as value
   =============================================*/
  serviceVersions(options, callback) {
    var _this = this;
    if (options === undefined) {
      options = {};
      callback = function(err, success) {};
    } else if (typeof options === "function") {
      callback = options;
      options = {};
    } else {
      callback = typeof callback === "function" ? callback : function() {};
    }

    Object.assign(_this, options);

    if (_this._soap_client == null || _this.sessionID === null) {
      return _this.loginEx(callback).then(function(success) {
        if (success == true) {
          return _this.serviceVersions(callback);
        }
      });
    } else {
      var params = {
        sessionId: _this.sessionId
      };

      return _this._soap_client.serviceVersionsAsync(params).then(
        function(result) {
          if (result.length > 0) result = result[0]; //KEVIN
          if (result.return.attributes.result) {
            _this.serviceVersionsResults = result.return.serviceVersions;
            callback(null, true, _this.serviceVersionsResults);
            return true;
          } else {
            _this.lastError = false;
            callback(null, false);
            return false;
          }
        },
        function(err) {
          _this.lastError = err;
          callback(err, false);
          return false;
        }
      );
    }
  }

  /**=============================================
   * Sign the authentication data, private function
   * @param {string} data
   * @param {string} privateKey - PEM key as a string
   * @return {string} - the MD5 signed data put into an array of INTs as a string
   =============================================*/
  _signAuthenticationData(data, privateKey) {
    const sign = crypto.createSign("MD5");

    sign.write(data);
    sign.end();

    var bufResult = sign.sign(privateKey);
    var strResult = "[";
    var len = bufResult.length;
    var cntr = 0;
    var anInt = 0;
    var aString = "";
    while (cntr < len) {
      anInt = bufResult.readInt8(cntr);
      aString = anInt.toString();
      strResult += aString;
      cntr = cntr + 1;
      if (cntr < len) {
        strResult += ",";
      }
    }
    strResult += "]";

    return strResult;
  }
}

module.exports.sessionClient = function(options) {
  return new oigSessionClient(options);
};
