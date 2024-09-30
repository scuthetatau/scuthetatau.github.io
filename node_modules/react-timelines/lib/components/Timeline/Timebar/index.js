"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Row = _interopRequireDefault(require("./Row"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Timebar = function Timebar(_ref) {
  var time = _ref.time,
      rows = _ref.rows;
  return _react.default.createElement("div", {
    className: "rt-timebar"
  }, rows.map(function (_ref2) {
    var id = _ref2.id,
        title = _ref2.title,
        cells = _ref2.cells,
        style = _ref2.style;
    return _react.default.createElement(_Row.default, {
      key: id,
      time: time,
      title: title,
      cells: cells,
      style: style
    });
  }));
};

Timebar.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  rows: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired
};
var _default = Timebar;
exports.default = _default;