"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Toggle = _interopRequireDefault(require("./Toggle"));

var _ZoomIn = _interopRequireDefault(require("./ZoomIn"));

var _ZoomOut = _interopRequireDefault(require("./ZoomOut"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Controls = function Controls(_ref) {
  var _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? true : _ref$isOpen,
      toggleOpen = _ref.toggleOpen,
      zoomIn = _ref.zoomIn,
      zoomOut = _ref.zoomOut,
      zoom = _ref.zoom,
      zoomMin = _ref.zoomMin,
      zoomMax = _ref.zoomMax;
  return _react.default.createElement("div", {
    className: "rt-controls"
  }, _react.default.createElement("div", {
    className: "rt-controls__content"
  }, toggleOpen && _react.default.createElement(_Toggle.default, {
    isOpen: isOpen,
    toggleOpen: toggleOpen
  }), zoomIn && _react.default.createElement(_ZoomIn.default, {
    zoomIn: zoomIn,
    zoomMax: zoomMax,
    zoom: zoom
  }), zoomOut && _react.default.createElement(_ZoomOut.default, {
    zoomOut: zoomOut,
    zoomMin: zoomMin,
    zoom: zoom
  })));
};

Controls.propTypes = {
  zoom: _propTypes.default.number.isRequired,
  isOpen: _propTypes.default.bool,
  toggleOpen: _propTypes.default.func,
  zoomIn: _propTypes.default.func,
  zoomOut: _propTypes.default.func,
  zoomMin: _propTypes.default.number,
  zoomMax: _propTypes.default.number
};
var _default = Controls;
exports.default = _default;