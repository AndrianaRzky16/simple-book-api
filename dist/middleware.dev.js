"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkToken = exports.requestModifier = exports.requestLogger = exports.timeLogger = void 0;

var timeLogger = function timeLogger(req, res, next) {
  console.log("Time:", Date.now());
  next();
};

exports.timeLogger = timeLogger;

var requestLogger = function requestLogger(req, res, next) {
  console.log("Request to: ".concat(req.method, " ").concat(req.url));
  next();
};

exports.requestLogger = requestLogger;

var requestModifier = function requestModifier(req, res, next) {
  req.modified = true;
  req.user = {
    name: "John Doe",
    email: "johndoe@example.com"
  };
  next();
};

exports.requestModifier = requestModifier;

var checkToken = function checkToken(req, res, next) {
  var token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  if (token !== "SECRET_TOKEN") {
    return res.status(403).json({
      message: "Forbidden"
    });
  }

  next();
};

exports.checkToken = checkToken;
//# sourceMappingURL=middleware.dev.js.map
