/*******************************************************************************/
/******************    OIG.API configuration     *******************************/
/*******************************************************************************/

var OigConfig = {
  appName       : 'BRIGHTTECH',
  appPassword   : 'admin@4282',
  localPassword : 'admin@4282',
  companyName   : 'MKCOMMS',
  
  pemCert : "-----BEGIN CERTIFICATE-----\n" +
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

  xmlPrivateKey : "<RSAKeyValue>" +
    "<Modulus>" +    "iwpVEo4qj9j7F3b7OtUu35Crn9CKu75F+a2FjKXN2tKj2VJYZJnUBJnT0vqtHMFaHVu/sP5KQAavzxm3bYWsGWztDS5XjR3dmHTo7a1/11wI/KqnYPcxP/vUEU5do4at2/OY/5gWLp/3mei8xLAUUUbKRupzwNEXuhqK5EiBMDwgvcwuaygtdqYY3SHMzcqM1lLCH4A6SQ4YEbKnQci4jW1gxM9dMKPYZcwoeAnaC93K1me2uS/COpBBIJcWio3+P7XNblqYJxCdVoBgF2dG0c40c+f3MGbmdyQqwpsbIC2AO/PxUG85m46N9vX7OF2CeEVDV+QU6E1ra+gbfnfptQ==" +
    "</Modulus>" +
    "<Exponent>" +
    "AQAB" +
    "</Exponent>" +
    "<P>" +
    "0dtELTQ0zqaAizglLfeHxyw6dyadmaRHkQu42q1O2Eg10NeFiEgeXEgO1cxdP5VL0gsvyanSsdk6/kcTDXJ5yCKSpj05uF0orUj0UhxDPth8gP5XaaaVob9GKBimEbLro/1e+AV7wZljSU0m1po134qT+SjAxlzeibJpsHPHTcM=" +
    "</P>" +
    "<Q>" +
    "qZza6FNtM6yZicr21Sr3CTP+Hgq1FG8Gjq2AQmcQQ0nxgTNwjzZjPvbrbYGWxh8K1pmqxiM+IurlixI5gB4ViL3+1MQrjLOMckouaRFx/Hc2VAUKe7mxUNLViRvHfUd/+L7E40xC10bFULlRtxoyJdZo6YgTrHkmCWYyZWaCmyc=" +
    "</Q>" +
    "<DP>" +
    "n+Jpd/M9hHAwoWEeWn4rkWCuDpd6HVOfPu/qX5kI6Blj/wAk+WbQ0sgHnXY9WTMa+CWTvBZJszxpCNAHwQgFpqhIiKU+86ruUc+ybVihFyGDAhhFavYDLJ95CRV2eSeTBncEwvwShLajgXZpb7k/8Fc5U+xrqvWYitpGUax0HVc=" +
    "</DP>" +
    "<DQ>" +
    "NuHQW5iTH0NcMx//mp5abRnrwiDI0yHRx10QwWvD8WH9yUaxx0Vb+8W+DCMAfH8S7Lmwboh81KOZPtTY0kHpyeNgj8wiI1b9vQWP2uOQNJcGd01iRQKjA3oVKlZYyIrYN87SupG0lyAJPMOaU1sgmumz7MzhQM+6pRPyfqka3cU=" +
    "</DQ>" +
    "<InverseQ>" +
    "v1FJ9wqYGdvGldQtC676CBc0h9ZXXha72Bp7LIrPMr+zSnojgOVKe/QWJNcUiWpIzj57FsnzwraLg+F0/bR8WJX19qMWWWhwBLTXgVAYMgkDnviOAFY6F40HZV4bW+MGV/rO77ySqj5zrduLYmGKtVkIKF4qDfG1dmWxN6g5b3U=" +
    "</InverseQ>" +
    "<D>" +    "XnU/hGKW4bDMLI3FcZugw3s6TVFU3uUODuhmoT2HE1EkxSBfMsEau6FxuZRZhP6KZQWOvgSTltm0GKNk7P/yAjfw95JzIkiW4dsS312OS1WYOWcKXSKyD8DauoMdtFlrxdDBMWs2Lqi4gpQNoiXpN6o7A2CGEQk78E/V6e6j7Yr5+tL05KWiqvyVJUnnTvsd5rIzsf+5kE6BvkGbsOxeHIrkuDe2VKVUHApegG/iGTCR903okmMUefC9zqOBWS0+xTMc2C72KmsvjkkRHz64+MP127EJavY6MG/IfOHOo1wMXSmVt7hxCb7isY/UleByAh5Go1hIh9l7NWOhNX+XRQ==" +
    "</D>" +
    "</RSAKeyValue> ",
 
  rsaPrivateKey : "-----BEGIN PRIVATE KEY-----\n"+
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCLClUSjiqP2PsX\n"+
    "dvs61S7fkKuf0Iq7vkX5rYWMpc3a0qPZUlhkmdQEmdPS+q0cwVodW7+w/kpABq/P\n"+
    "GbdthawZbO0NLleNHd2YdOjtrX/XXAj8qqdg9zE/+9QRTl2jhq3b85j/mBYun/eZ\n"+
    "6LzEsBRRRspG6nPA0Re6GorkSIEwPCC9zC5rKC12phjdIczNyozWUsIfgDpJDhgR\n"+
    "sqdByLiNbWDEz10wo9hlzCh4CdoL3crWZ7a5L8I6kEEglxaKjf4/tc1uWpgnEJ1W\n"+
    "gGAXZ0bRzjRz5/cwZuZ3JCrCmxsgLYA78/FQbzmbjo329fs4XYJ4RUNX5BToTWtr\n"+
    "6Bt+d+m1AgMBAAECggEAXnU/hGKW4bDMLI3FcZugw3s6TVFU3uUODuhmoT2HE1Ek\n"+
    "xSBfMsEau6FxuZRZhP6KZQWOvgSTltm0GKNk7P/yAjfw95JzIkiW4dsS312OS1WY\n"+
    "OWcKXSKyD8DauoMdtFlrxdDBMWs2Lqi4gpQNoiXpN6o7A2CGEQk78E/V6e6j7Yr5\n"+
    "+tL05KWiqvyVJUnnTvsd5rIzsf+5kE6BvkGbsOxeHIrkuDe2VKVUHApegG/iGTCR\n"+
    "903okmMUefC9zqOBWS0+xTMc2C72KmsvjkkRHz64+MP127EJavY6MG/IfOHOo1wM\n"+
    "XSmVt7hxCb7isY/UleByAh5Go1hIh9l7NWOhNX+XRQKBgQDR20QtNDTOpoCLOCUt\n"+
    "94fHLDp3Jp2ZpEeRC7jarU7YSDXQ14WISB5cSA7VzF0/lUvSCy/JqdKx2Tr+RxMN\n"+
    "cnnIIpKmPTm4XSitSPRSHEM+2HyA/ldpppWhv0YoGKYRsuuj/V74BXvBmWNJTSbW\n"+
    "mjXfipP5KMDGXN6Jsmmwc8dNwwKBgQCpnNroU20zrJmJyvbVKvcJM/4eCrUUbwaO\n"+
    "rYBCZxBDSfGBM3CPNmM+9uttgZbGHwrWmarGIz4i6uWLEjmAHhWIvf7UxCuMs4xy\n"+
    "Si5pEXH8dzZUBQp7ubFQ0tWJG8d9R3/4vsTjTELXRsVQuVG3GjIl1mjpiBOseSYJ\n"+
    "ZjJlZoKbJwKBgQCf4ml38z2EcDChYR5afiuRYK4Ol3odU58+7+pfmQjoGWP/ACT5\n"+
    "ZtDSyAeddj1ZMxr4JZO8FkmzPGkI0AfBCAWmqEiIpT7zqu5Rz7JtWKEXIYMCGEVq\n"+
    "9gMsn3kJFXZ5J5MGdwTC/BKEtqOBdmlvuT/wVzlT7Guq9ZiK2kZRrHQdVwKBgDbh\n"+
    "0FuYkx9DXDMf/5qeWm0Z68IgyNMh0cddEMFrw/Fh/clGscdFW/vFvgwjAHx/Euy5\n"+
    "sG6IfNSjmT7U2NJB6cnjYI/MIiNW/b0Fj9rjkDSXBndNYkUCowN6FSpWWMiK2DfO\n"+
    "0rqRtJcgCTzDmlNbIJrps+zM4UDPuqUT8n6pGt3FAoGBAL9RSfcKmBnbxpXULQuu\n"+
    "+ggXNIfWV14Wu9gaeyyKzzK/s0p6I4DlSnv0FiTXFIlqSM4+exbJ88K2i4PhdP20\n"+
    "fFiV9fajFllocAS014FQGDIJA574jgBWOheNB2VeG1vjBlf6zu+8kqo+c63bi2Jh\n"+
    "irVZCCheKg3xtXZlsTeoOW91\n"+
    "-----END PRIVATE KEY-----"

};
 
/*
var str = "[";
for (var i = 0; i < 344; ++i){
    var sByte = (ss.charAt(i) & 255);
    console.log(sByte);
    str += sByte+",";
}
str += "]";
*/

function RsaEncrypt(text)
{ 
  let rsaKey = RSA.getPublicKey(rsaPrivateKey); 
  return RSA.encrypt(text, rsaKey);
}
