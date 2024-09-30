"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header(_ref) {
  var timebar = _ref.timebar,
      _ref$sticky = _ref.sticky;
  _ref$sticky = _ref$sticky === void 0 ? {} : _ref$sticky;
  var isSticky = _ref$sticky.isSticky,
      sidebarWidth = _ref$sticky.sidebarWidth,
      headerHeight = _ref$sticky.headerHeight;
  return _react.default.createElement("div", {
    style: isSticky ? {
      paddingTop: headerHeight
    } : {}
  }, _react.default.createElement("div", {
    className: "rt-sidebar__header ".concat(isSticky ? 'rt-is-sticky' : ''),
    style: isSticky ? {
      width: sidebarWidth
    } : {}
  }, timebar.map(function (_ref2) {
    var id = _ref2.id,
        title = _ref2.title;
    return _react.default.createElement("div", {
      key: id,
      className: "rt-timebar-key"
    }, title);
  })));
};

Header.propTypes = {
  sticky: _propTypes.default.shape({
    isSticky: _propTypes.default.bool.isRequired,
    headerHeight: _propTypes.default.number.isRequired,
    sidebarWidth: _propTypes.default.number.isRequired
  }),
  timebar: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string
  }).isRequired).isRequired
};
var _default = Header;
exports.default = _default;