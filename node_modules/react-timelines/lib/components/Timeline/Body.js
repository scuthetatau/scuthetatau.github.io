"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Tracks = _interopRequireDefault(require("./Tracks"));

var _Grid = _interopRequireDefault(require("./Grid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Body = function Body(_ref) {
  var time = _ref.time,
      grid = _ref.grid,
      tracks = _ref.tracks,
      clickElement = _ref.clickElement;
  return _react.default.createElement("div", {
    className: "rt-timeline__body"
  }, grid && _react.default.createElement(_Grid.default, {
    time: time,
    grid: grid
  }), _react.default.createElement(_Tracks.default, {
    time: time,
    tracks: tracks,
    clickElement: clickElement
  }));
};

Body.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  grid: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  clickElement: _propTypes.default.func
};
var _default = Body;
exports.default = _default;