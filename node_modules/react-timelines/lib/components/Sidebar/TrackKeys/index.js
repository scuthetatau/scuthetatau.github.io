"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TrackKey = _interopRequireDefault(require("./TrackKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrackKeys = function TrackKeys(_ref) {
  var tracks = _ref.tracks,
      toggleOpen = _ref.toggleOpen,
      clickTrackButton = _ref.clickTrackButton;
  return _react.default.createElement("ul", {
    className: "rt-track-keys"
  }, tracks.map(function (track) {
    return _react.default.createElement(_TrackKey.default, {
      key: track.id,
      track: track,
      toggleOpen: toggleOpen,
      clickTrackButton: clickTrackButton
    });
  }));
};

TrackKeys.propTypes = {
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  toggleOpen: _propTypes.default.func,
  clickTrackButton: _propTypes.default.func
};
var _default = TrackKeys;
exports.default = _default;