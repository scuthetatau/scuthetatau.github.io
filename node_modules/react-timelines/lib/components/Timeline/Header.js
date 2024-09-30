"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Timebar = _interopRequireDefault(require("./Timebar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

var Header =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Header, _PureComponent);

  function Header(props) {
    var _this;

    _classCallCheck(this, Header);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Header).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleScroll", function () {
      var sticky = _this.props.sticky;
      sticky.handleHeaderScrollY(_this.scroll.current.scrollLeft);
    });

    _this.scroll = _react.default.createRef();
    _this.timebar = _react.default.createRef();
    return _this;
  }

  _createClass(Header, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var sticky = this.props.sticky;

      if (sticky) {
        sticky.setHeaderHeight(this.timebar.current.offsetHeight);
        var scrollLeft = sticky.scrollLeft,
            isSticky = sticky.isSticky;

        if (isSticky) {
          this.scroll.current.scrollLeft = scrollLeft;
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var sticky = this.props.sticky;

      if (sticky) {
        var scrollLeft = sticky.scrollLeft,
            isSticky = sticky.isSticky;
        var prevScrollLeft = prevProps.sticky.scrollLeft;
        var prevIsSticky = prevProps.sticky.isSticky;

        if (scrollLeft !== prevScrollLeft || isSticky !== prevIsSticky) {
          this.scroll.current.scrollLeft = scrollLeft;
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          time = _this$props.time,
          onMove = _this$props.onMove,
          onEnter = _this$props.onEnter,
          onLeave = _this$props.onLeave,
          width = _this$props.width,
          rows = _this$props.timebar,
          _this$props$sticky = _this$props.sticky;
      _this$props$sticky = _this$props$sticky === void 0 ? {} : _this$props$sticky;
      var isSticky = _this$props$sticky.isSticky,
          headerHeight = _this$props$sticky.headerHeight,
          viewportWidth = _this$props$sticky.viewportWidth;
      return _react.default.createElement("div", {
        style: isSticky ? {
          paddingTop: headerHeight
        } : {},
        onMouseMove: onMove,
        onMouseEnter: onEnter,
        onMouseLeave: onLeave
      }, _react.default.createElement("div", {
        className: "rt-timeline__header ".concat(isSticky ? 'rt-is-sticky' : ''),
        style: isSticky ? {
          width: viewportWidth,
          height: headerHeight
        } : {}
      }, _react.default.createElement("div", {
        className: "rt-timeline__header-scroll",
        ref: this.scroll,
        onScroll: isSticky ? this.handleScroll : noop
      }, _react.default.createElement("div", {
        ref: this.timebar,
        style: isSticky ? {
          width: width
        } : {}
      }, _react.default.createElement(_Timebar.default, {
        time: time,
        rows: rows
      })))));
    }
  }]);

  return Header;
}(_react.PureComponent);

Header.propTypes = {
  time: _propTypes.default.shape({}).isRequired,
  timebar: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string
  }).isRequired).isRequired,
  onMove: _propTypes.default.func.isRequired,
  onEnter: _propTypes.default.func.isRequired,
  onLeave: _propTypes.default.func.isRequired,
  width: _propTypes.default.string.isRequired,
  sticky: _propTypes.default.shape({
    isSticky: _propTypes.default.bool.isRequired,
    setHeaderHeight: _propTypes.default.func.isRequired,
    viewportWidth: _propTypes.default.number.isRequired,
    handleHeaderScrollY: _propTypes.default.func.isRequired,
    scrollLeft: _propTypes.default.number.isRequired
  })
};
var _default = Header;
exports.default = _default;