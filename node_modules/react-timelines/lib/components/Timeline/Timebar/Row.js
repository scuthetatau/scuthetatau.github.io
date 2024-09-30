"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Cell = _interopRequireDefault(require("./Cell"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Row = function Row(_ref) {
  var time = _ref.time,
      cells = _ref.cells,
      style = _ref.style;
  return _react.default.createElement("div", {
    className: "rt-timebar__row",
    style: style
  }, cells.map(function (cell) {
    return _react.default.createElement(_Cell.default, _extends({
      key: cell.id,
      time: time
    }, cell));
  }));
};

Row.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  cells: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
  style: _propTypes.default.shape({})
};
var _default = Row;
exports.default = _default;