"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDayMonth = exports.getMonth = void 0;
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var getMonth = function getMonth(date) {
  return monthNames[date.getMonth()];
};

exports.getMonth = getMonth;

var getDayMonth = function getDayMonth(date) {
  return "".concat(date.getDate(), " ").concat(getMonth(date));
};

exports.getDayMonth = getDayMonth;