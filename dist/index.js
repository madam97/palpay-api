"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = process.env.PORT || 5000;
app.get('/', function (req, res) {
  res.json({
    msg: 'Working'
  });
});
app.listen(PORT, function () {
  return console.log("Server started on port ".concat(PORT));
});