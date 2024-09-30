"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeListener = exports.addListener = void 0;

var addListener = function addListener(e, t) {
  return window.addEventListener(e, t);
};

exports.addListener = addListener;

var removeListener = function removeListener(e, t) {
  return window.removeEventListener(e, t);
};

exports.removeListener = removeListener;