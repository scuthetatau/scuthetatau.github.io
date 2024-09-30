"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrackKey = function TrackKey(_ref) {
  var track = _ref.track,
      toggleOpen = _ref.toggleOpen,
      clickTrackButton = _ref.clickTrackButton;
  var title = track.title,
      tracks = track.tracks,
      isOpen = track.isOpen,
      hasButton = track.hasButton,
      sideComponent = track.sideComponent;
  var isExpandable = isOpen !== undefined;

  var buildSideComponent = function buildSideComponent() {
    if (sideComponent) {
      return _react.default.cloneElement(sideComponent);
    }

    if (hasButton && clickTrackButton) {
      var handleClick = function handleClick() {
        return clickTrackButton(track);
      };

      return _react.default.createElement("button", {
        className: "rt-track-key__side-button",
        onClick: handleClick,
        type: "button"
      });
    }

    return null;
  };

  return _react.default.createElement("li", {
    className: "rt-track-key"
  }, _react.default.createElement("div", {
    className: "rt-track-key__entry"
  }, isExpandable && _react.default.createElement("button", {
    title: "Expand track",
    className: "rt-track-key__toggle ".concat(isOpen ? 'rt-track-key__toggle--close' : 'rt-track-key__toggle--open'),
    onClick: function onClick() {
      return toggleOpen(track);
    },
    type: "button"
  }, isOpen ? 'Close' : 'Open'), _react.default.createElement("span", {
    className: "rt-track-key__title"
  }, title), buildSideComponent()), isOpen && tracks && tracks.length > 0 && _react.default.createElement(_.default, {
    tracks: tracks,
    toggleOpen: toggleOpen
  }));
};

TrackKey.propTypes = {
  track: _propTypes.default.shape({
    title: _propTypes.default.string.isRequired,
    tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
    isOpen: _propTypes.default.bool,
    hasButton: _propTypes.default.bool
  }),
  toggleOpen: _propTypes.default.func,
  clickTrackButton: _propTypes.default.func
};
TrackKey.defaultProps = {
  clickTrackButton: undefined
};
var _default = TrackKey;
exports.default = _default;