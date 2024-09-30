"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Marker = function Marker(_ref) {
  var x = _ref.x,
      modifier = _ref.modifier,
      children = _ref.children,
      visible = _ref.visible,
      highlighted = _ref.highlighted;
  return _react.default.createElement("div", {
    className: "rt-marker rt-marker--".concat(modifier, " ").concat(visible ? 'rt-is-visible' : '', " ").concat(highlighted ? 'rt-is-highlighted' : ''),
    style: {
      left: "".concat(x, "px")
    }
  }, _react.default.createElement("div", {
    className: "rt-marker__label"
  }, _react.default.createElement("div", {
    className: "rt-marker__content"
  }, children)));
};

Marker.propTypes = {
  x: _propTypes.default.number.isRequired,
  modifier: _propTypes.default.string.isRequired,
  visible: _propTypes.default.bool,
  highlighted: _propTypes.default.bool,
  children: _propTypes.default.node
};
var _default = Marker;
exports.default = _default;