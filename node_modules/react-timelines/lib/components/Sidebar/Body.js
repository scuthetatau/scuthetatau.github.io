"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TrackKeys = _interopRequireDefault(require("./TrackKeys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Body = function Body(_ref) {
  var tracks = _ref.tracks,
      toggleTrackOpen = _ref.toggleTrackOpen,
      clickTrackButton = _ref.clickTrackButton;
  return _react.default.createElement("div", {
    className: "rt-sidebar__body"
  }, _react.default.createElement(_TrackKeys.default, {
    tracks: tracks,
    toggleOpen: toggleTrackOpen,
    clickTrackButton: clickTrackButton
  }));
};

Body.propTypes = {
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  toggleTrackOpen: _propTypes.default.func,
  clickTrackButton: _propTypes.default.func
};
var _default = Body;
exports.default = _default;