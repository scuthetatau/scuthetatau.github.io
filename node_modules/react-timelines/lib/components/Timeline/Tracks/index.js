"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Track = _interopRequireDefault(require("./Track"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tracks = function Tracks(_ref) {
  var time = _ref.time,
      tracks = _ref.tracks,
      clickElement = _ref.clickElement;
  return _react.default.createElement("div", {
    className: "rt-tracks"
  }, tracks.map(function (_ref2) {
    var id = _ref2.id,
        elements = _ref2.elements,
        isOpen = _ref2.isOpen,
        children = _ref2.tracks;
    return _react.default.createElement(_Track.default, {
      key: id,
      time: time,
      elements: elements,
      isOpen: isOpen,
      tracks: children,
      clickElement: clickElement
    });
  }));
};

Tracks.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  clickElement: _propTypes.default.func
};
var _default = Tracks;
exports.default = _default;