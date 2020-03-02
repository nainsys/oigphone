"use strict";
const EventEmitter = require("events");
const Promise = require("promise");
const crypto = require("crypto");
const soap = require("soap"); // Setup SOAP client

class oigDataAccessClient extends EventEmitter {
  constructor(options) {
    super();
    var _this = this;
  }
}

module.exports.dataAccessClient = function(options) {
  return new oigDataAccessClient(options);
};
