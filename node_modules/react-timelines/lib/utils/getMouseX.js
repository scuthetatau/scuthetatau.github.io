"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var getMouseX = function getMouseX(e) {
  var target = e.currentTarget;
  var bounds = target.getBoundingClientRect();
  return e.clientX - bounds.left;
};

var _default = getMouseX;
exports.default = _default;