"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _computedStyle = _interopRequireDefault(require("./computedStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(node, prop) {
  return parseInt((0, _computedStyle.default)(node).getPropertyValue(prop), 10);
};

exports.default = _default;