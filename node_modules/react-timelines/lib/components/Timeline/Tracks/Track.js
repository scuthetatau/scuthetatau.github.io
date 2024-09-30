"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ = _interopRequireDefault(require("."));

var _Element = _interopRequireDefault(require("./Element"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Track = function Track(_ref) {
  var time = _ref.time,
      elements = _ref.elements,
      isOpen = _ref.isOpen,
      tracks = _ref.tracks,
      clickElement = _ref.clickElement;
  return _react.default.createElement("div", {
    className: "tr-track"
  }, _react.default.createElement("div", {
    className: "rt-track__elements"
  }, elements.filter(function (_ref2) {
    var start = _ref2.start,
        end = _ref2.end;
    return end > start;
  }).map(function (element) {
    return _react.default.createElement(_Element.default, _extends({
      key: element.id,
      time: time,
      clickElement: clickElement
    }, element));
  })), isOpen && tracks && tracks.length > 0 && _react.default.createElement(_.default, {
    time: time,
    tracks: tracks,
    clickElement: clickElement
  }));
};

Track.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  isOpen: _propTypes.default.bool,
  elements: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  clickElement: _propTypes.default.func
};
Track.defaultProps = {
  clickElement: undefined
};
var _default = Track;
exports.default = _default;