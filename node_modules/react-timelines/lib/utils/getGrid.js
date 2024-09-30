"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var getGrid = function getGrid(timebar) {
  return (timebar.find(function (row) {
    return row.useAsGrid;
  }) || {}).cells;
};

var _default = getGrid;
exports.default = _default;