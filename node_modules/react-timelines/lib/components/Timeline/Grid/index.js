"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Grid = function Grid(_ref) {
  var time = _ref.time,
      grid = _ref.grid;
  return _react.default.createElement("div", {
    className: "rt-grid"
  }, grid.map(function (_ref2) {
    var id = _ref2.id,
        start = _ref2.start,
        end = _ref2.end;
    return _react.default.createElement("div", {
      key: id,
      className: "rt-grid__cell",
      style: time.toStyleLeftAndWidth(start, end)
    });
  }));
};

Grid.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  grid: _propTypes.default.arrayOf(_propTypes.default.shape({
    start: _propTypes.default.instanceOf(Date).isRequired,
    end: _propTypes.default.instanceOf(Date).isRequired
  })).isRequired
};
var _default = Grid;
exports.default = _default;