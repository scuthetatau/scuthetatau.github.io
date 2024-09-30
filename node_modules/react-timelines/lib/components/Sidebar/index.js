"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Header = _interopRequireDefault(require("./Header"));

var _Body = _interopRequireDefault(require("./Body"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sidebar = function Sidebar(_ref) {
  var timebar = _ref.timebar,
      tracks = _ref.tracks,
      toggleTrackOpen = _ref.toggleTrackOpen,
      sticky = _ref.sticky,
      clickTrackButton = _ref.clickTrackButton;
  return _react.default.createElement("div", {
    className: "rt-sidebar"
  }, _react.default.createElement(_Header.default, {
    timebar: timebar,
    sticky: sticky
  }), _react.default.createElement(_Body.default, {
    tracks: tracks,
    toggleTrackOpen: toggleTrackOpen,
    clickTrackButton: clickTrackButton
  }));
};

Sidebar.propTypes = {
  timebar: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string
  }).isRequired).isRequired,
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  toggleTrackOpen: _propTypes.default.func,
  sticky: _propTypes.default.shape({}),
  clickTrackButton: _propTypes.default.func
};
var _default = Sidebar;
exports.default = _default;