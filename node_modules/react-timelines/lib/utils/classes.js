"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var classes = function classes(base, additional) {
  if (!additional) {
    return base;
  }

  if (typeof additional === 'string') {
    return "".concat(base, " ").concat(additional);
  }

  return "".concat(base, " ").concat(additional.join(' '));
};

var _default = classes;
exports.default = _default;