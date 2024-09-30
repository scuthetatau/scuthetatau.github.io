"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(cb) {
  return window.requestAnimationFrame(cb);
};

exports.default = _default;