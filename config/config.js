module.exports = {
  "session": {
      "endpoint": null,
      "server": "192.168.10.101",
      "autoAuthenticate": true,
      "privateKey": null,
      "signedAuthenticationData": null,
      "authenticationData": ""+
           "-----BEGIN CERTIFICATE-----\n" +
          "MIIDUTCCAjmgAwIBAgIGAVr6+6nVMA0GCSqGSIb3DQEBBAUAMFcxCzAJBgNVBAYT\n" +
          "AkNBMQswCQYDVQQIEwJPTjEPMA0GA1UEBxMGT3R0YXdhMQ4wDAYDVQQKEwVNaXRl\n" +
          "bDEMMAoGA1UECwwDUiZEMQwwCgYDVQQDEwNNQ1MwIBcNMTIwMjAxMTI0NDQxWhgP\n" +
          "MjExMjAyMDExMjQ0NDFaMHoxFTATBgNVBAYTDEtvcmVhLCBTb3V0aDEOMAwGA1UE\n" +
          "CBMFU2VvdWwxDjAMBgNVBAcTBVNlb3VsMRAwDgYDVQQKEwdNS0NPTU1TMQwwCgYD\n" +
          "VQQLDANSJkQxITAfBgNVBAMTGEJSSUdIVFRFQ0g6LS06Tm9uVHJ1c3RlZDCCASIw\n" +
          "DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIsKVRKOKo/Y+xd2+zrVLt+Qq5/Q\n" +
          "iru+RfmthYylzdrSo9lSWGSZ1ASZ09L6rRzBWh1bv7D+SkAGr88Zt22FrBls7Q0u\n" +
          "V40d3Zh06O2tf9dcCPyqp2D3MT/71BFOXaOGrdvzmP+YFi6f95novMSwFFFGykbq\n" +
          "c8DRF7oaiuRIgTA8IL3MLmsoLXamGN0hzM3KjNZSwh+AOkkOGBGyp0HIuI1tYMTP\n" +
          "XTCj2GXMKHgJ2gvdytZntrkvwjqQQSCXFoqN/j+1zW5amCcQnVaAYBdnRtHONHPn\n" +
          "9zBm5nckKsKbGyAtgDvz8VBvOZuOjfb1+zhdgnhFQ1fkFOhNa2voG3536bUCAwEA\n" +
          "ATANBgkqhkiG9w0BAQQFAAOCAQEAjW07Pv0yzpNJa8Ra36wMOHkANGWh5II3EaNc\n" +
          "01B9lv665ZwWOeXlRUUuNhrWwRW5NgLJkjE78leWgJjBj7G3BN9+xy7sig3YE46R\n" +
          "BUjoHdSam0wk82MMrr34MNZDiymw7PiclXCd1v+XFRBdFrjnIGjo3+KVPS8Shv32\n" +
          "3kKhvp/56GBUUCICevA9tzGz8p/oAUR5cAWA+x5TfCrkQYpL9knJIxrXZpkCgA43\n" +
          "pliTd687fqrX52O/iDbZUI4KkfIwSSXRR88/a38OsaDh2VHOmjDpfTm3fzxIpK0N\n" +
          "+e3XBTtO4fAVxF912VIxzked2H7g2ou+lyzss9zPtSZqQLAPkw==\n" +
          "-----END CERTIFICATE-----",
      "autoKeepAlive": true,
      "sessionTimer": 5,
      "_keepAliveSet": null,
      "serviceVersionsResults": null,
      "lastError": null,
      "__descriptions": {
        "endpoint": "Current OIG implementation returns an invalid endpoint in the returned WSDL, this is calculated later from protocol, server and servicePath",
        "server": "Required",
        "sessionTimer": "In seconds",
        "_keepAliveSet": "set to Timeout after setInterval for autoKeepAlive"
      }
      

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
     * @param {string} [Options[].localPassword] - Each application requires a local password defined in the Mitel OIG. The application must allow entry of the local password at run-time. The Mitel OIG administrator of a specific Mitel OIG creates a local password for each application. The application local password is unique to each Mitel OIG installation. Optional if previously set on the client.
     * @param {string} [Options[].companyName] - The company name is known to the developer at application creation. companyName is NOT provided to the application at run-time; it is hard coded. companyName is provided to Mitel as part of Application Registration. Optional if previously set on the client.
     * @param {string} [Options[].applicationName] - The application name is known to the developer at application creation. applicationName is NOT provided to the application at run-time; it is hard coded. applicationName is provided to Mitel as part of Application Registration. Optional if previously set on the client.
     * @param {string} [Options[].applicationPassword] - The application password is known to the developer at application creation. applicationPassword is NOT provided to the application at run-time; it is hard coded. applicationPassword is provided to Mitel as part of Application Registration. Optional if previously set on the client.
     * @param {string} [Options[].version=4.0] - The Version attribute must be set to match the version of the Mitel OIG server being used (eg, 2.1). If the application does not set this value, the Mitel OIG assumes the application is using a WSDL version matching its software version. For example, Mitel OIG 2.1 uses WSDL 2.1. The version attribute is used to identify the version of WSDL that the application is using.
     * @param {string} [Options[].certificate] - Each application that requires advanced services from an Mitel OIG requires a Mitel certificate. Application developers request a Mitel certificate using the Mitel OnLine MSA web portal. The same certificate is used in all instances of an application.
     * @param {boolean} [Options[].autoAuthenticate=true] - Advanced applications need to authenticate after they login.  If true AND the privateKey is set, loginEx will automatically attempt authenticate prior to callback
     * @param {string} [Options[].privateKey] - The private key to sign authenticate method.  Only used in advanced applications if signing loginEx result within module
     * @param {boolean} [Options[].autoKeepAlive=true] - After loginEx or authenticate (Advanced applications), should a timer be set to call resetSessionTimer every sessionTimer seconds
     * @param {number} [Options[].sessionTimer=5] - In Seconds.  The application must call resetSessionTimer with a frequency less than every 10 seconds.  Used with autoKeepAlive.
     */


      
  },
  "callControl": {
      "_soap_client": null,
      "sessionClient": null,
      "sessionId": null,
      "endpoint": null,
      "server": null,
      "protocol": "https",
      "servicePath": "/axis2/services/StandardCCService/",
      "wsdl": "./wsdl_oig/standard/StandardCCService.wsdl",
      "version": "4.0",
      "lastError": null,
      "timeout": 45000,
      "getEventContinuously": true,
      "__descriptions": {
        "endpoint": "Current OIG implementation returns an invalid endpoint in the returned WSDL, this is calculated later from protocol, server and servicePath",
        "server": "Required",
        "timeout": "In seconds"
      }
  }
}

