"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Header = _interopRequireDefault(require("./Header"));

var _Body = _interopRequireDefault(require("./Body"));

var _Now = _interopRequireDefault(require("./Marker/Now"));

var _Pointer = _interopRequireDefault(require("./Marker/Pointer"));

var _getMouseX = _interopRequireDefault(require("../../utils/getMouseX"));

var _getGrid = _interopRequireDefault(require("../../utils/getGrid"));

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

var Timeline =
/*#__PURE__*/
function (_Component) {
  _inherits(Timeline, _Component);

  function Timeline(props) {
    var _this;

    _classCallCheck(this, Timeline);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Timeline).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleMouseMove", function (e) {
      var time = _this.props.time;

      _this.setState({
        pointerDate: time.fromX((0, _getMouseX.default)(e))
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseLeave", function () {
      _this.setState({
        pointerHighlighted: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseEnter", function () {
      _this.setState({
        pointerVisible: true,
        pointerHighlighted: true
      });
    });

    _this.state = {
      pointerDate: null,
      pointerVisible: false,
      pointerHighlighted: false
    };
    return _this;
  }

  _createClass(Timeline, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          now = _this$props.now,
          time = _this$props.time,
          timebar = _this$props.timebar,
          tracks = _this$props.tracks,
          sticky = _this$props.sticky,
          clickElement = _this$props.clickElement;
      var _this$state = this.state,
          pointerDate = _this$state.pointerDate,
          pointerVisible = _this$state.pointerVisible,
          pointerHighlighted = _this$state.pointerHighlighted;
      var grid = (0, _getGrid.default)(timebar);
      return _react.default.createElement("div", {
        className: "rt-timeline",
        style: {
          width: time.timelineWidthStyle
        }
      }, now && _react.default.createElement(_Now.default, {
        now: now,
        visible: true,
        time: time
      }), pointerDate && _react.default.createElement(_Pointer.default, {
        date: pointerDate,
        time: time,
        visible: pointerVisible,
        highlighted: pointerHighlighted
      }), _react.default.createElement(_Header.default, {
        time: time,
        timebar: timebar,
        onMove: this.handleMouseMove,
        onEnter: this.handleMouseEnter,
        onLeave: this.handleMouseLeave,
        width: time.timelineWidthStyle,
        sticky: sticky
      }), _react.default.createElement(_Body.default, {
        time: time,
        grid: grid,
        tracks: tracks,
        clickElement: clickElement
      }));
    }
  }]);

  return Timeline;
}(_react.Component);

Timeline.propTypes = {
  now: _propTypes.default.instanceOf(Date),
  time: _propTypes.default.shape({
    fromX: _propTypes.default.func.isRequired
  }).isRequired,
  timebar: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string
  }).isRequired).isRequired,
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})),
  sticky: _propTypes.default.shape({}),
  clickElement: _propTypes.default.func
};
var _default = Timeline;
exports.default = _default;