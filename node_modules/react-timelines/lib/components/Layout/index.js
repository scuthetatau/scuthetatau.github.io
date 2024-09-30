"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Sidebar = _interopRequireDefault(require("../Sidebar"));

var _Timeline = _interopRequireDefault(require("../Timeline"));

var _events = require("../../utils/events");

var _raf = _interopRequireDefault(require("../../utils/raf"));

var _getNumericPropertyValue = _interopRequireDefault(require("../../utils/getNumericPropertyValue"));

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

var Layout =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Layout, _PureComponent);

  function Layout(props) {
    var _this;

    _classCallCheck(this, Layout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layout).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "setHeaderHeight", function (headerHeight) {
      _this.setState({
        headerHeight: headerHeight
      });
    });

    _defineProperty(_assertThisInitialized(_this), "scrollToNow", function () {
      var _this$props = _this.props,
          time = _this$props.time,
          scrollToNow = _this$props.scrollToNow,
          now = _this$props.now,
          timelineViewportWidth = _this$props.timelineViewportWidth;

      if (scrollToNow) {
        _this.timeline.current.scrollLeft = time.toX(now) - 0.5 * timelineViewportWidth;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "updateTimelineBodyScroll", function () {
      var scrollLeft = _this.state.scrollLeft;
      _this.timeline.current.scrollLeft = scrollLeft;
    });

    _defineProperty(_assertThisInitialized(_this), "updateTimelineHeaderScroll", function () {
      var scrollLeft = _this.timeline.current.scrollLeft;

      _this.setState({
        scrollLeft: scrollLeft
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleHeaderScrollY", function (scrollLeft) {
      (0, _raf.default)(function () {
        _this.setState({
          scrollLeft: scrollLeft
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleScrollY", function () {
      (0, _raf.default)(function () {
        var headerHeight = _this.state.headerHeight;
        var markerHeight = 0;

        var _this$timeline$curren = _this.timeline.current.getBoundingClientRect(),
            top = _this$timeline$curren.top,
            bottom = _this$timeline$curren.bottom;

        var isSticky = top <= -markerHeight && bottom >= headerHeight;

        _this.setState(function () {
          return {
            isSticky: isSticky
          };
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleScrollX", function () {
      (0, _raf.default)(_this.updateTimelineHeaderScroll);
    });

    _defineProperty(_assertThisInitialized(_this), "calculateSidebarWidth", function () {
      return _this.sidebar.current.offsetWidth + (0, _getNumericPropertyValue.default)(_this.layout.current, 'margin-left');
    });

    _defineProperty(_assertThisInitialized(_this), "calculateTimelineViewportWidth", function () {
      return _this.timeline.current.offsetWidth;
    });

    _defineProperty(_assertThisInitialized(_this), "handleLayoutChange", function (cb) {
      var _this$props2 = _this.props,
          sidebarWidth = _this$props2.sidebarWidth,
          timelineViewportWidth = _this$props2.timelineViewportWidth,
          onLayoutChange = _this$props2.onLayoutChange;

      var nextSidebarWidth = _this.calculateSidebarWidth();

      var nextTimelineViewportWidth = _this.calculateTimelineViewportWidth();

      if (nextSidebarWidth !== sidebarWidth || nextTimelineViewportWidth !== timelineViewportWidth) {
        onLayoutChange({
          sidebarWidth: _this.calculateSidebarWidth(),
          timelineViewportWidth: _this.calculateTimelineViewportWidth()
        }, cb);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleResize", function () {
      return _this.handleLayoutChange();
    });

    _this.timeline = _react.default.createRef();
    _this.layout = _react.default.createRef();
    _this.sidebar = _react.default.createRef();
    _this.state = {
      isSticky: false,
      headerHeight: 0,
      scrollLeft: 0
    };
    return _this;
  }

  _createClass(Layout, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var enableSticky = this.props.enableSticky;

      if (enableSticky) {
        (0, _events.addListener)('scroll', this.handleScrollY);
        this.updateTimelineHeaderScroll();
        this.updateTimelineBodyScroll();
      }

      (0, _events.addListener)('resize', this.handleResize);
      this.handleLayoutChange(function () {
        return _this2.scrollToNow();
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props3 = this.props,
          enableSticky = _this$props3.enableSticky,
          isOpen = _this$props3.isOpen;
      var _this$state = this.state,
          isSticky = _this$state.isSticky,
          scrollLeft = _this$state.scrollLeft;

      if (enableSticky && isSticky) {
        if (!prevState.isSticky) {
          this.updateTimelineHeaderScroll();
        }

        if (scrollLeft !== prevState.scrollLeft) {
          this.updateTimelineBodyScroll();
        }
      }

      if (isOpen !== prevProps.isOpen) {
        this.handleLayoutChange();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var enableSticky = this.props.enableSticky;

      if (enableSticky) {
        (0, _events.removeListener)('scroll', this.handleScrollY);
        (0, _events.removeListener)('resize', this.handleResize);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          isOpen = _this$props4.isOpen,
          tracks = _this$props4.tracks,
          now = _this$props4.now,
          time = _this$props4.time,
          timebar = _this$props4.timebar,
          toggleTrackOpen = _this$props4.toggleTrackOpen,
          sidebarWidth = _this$props4.sidebarWidth,
          timelineViewportWidth = _this$props4.timelineViewportWidth,
          clickElement = _this$props4.clickElement,
          clickTrackButton = _this$props4.clickTrackButton;
      var _this$state2 = this.state,
          isSticky = _this$state2.isSticky,
          headerHeight = _this$state2.headerHeight,
          scrollLeft = _this$state2.scrollLeft;
      return _react.default.createElement("div", {
        className: "rt-layout ".concat(isOpen ? 'rt-is-open' : ''),
        ref: this.layout
      }, _react.default.createElement("div", {
        className: "rt-layout__side",
        ref: this.sidebar
      }, _react.default.createElement(_Sidebar.default, {
        timebar: timebar,
        tracks: tracks,
        toggleTrackOpen: toggleTrackOpen,
        sticky: {
          isSticky: isSticky,
          headerHeight: headerHeight,
          sidebarWidth: sidebarWidth
        },
        clickTrackButton: clickTrackButton
      })), _react.default.createElement("div", {
        className: "rt-layout__main"
      }, _react.default.createElement("div", {
        className: "rt-layout__timeline",
        ref: this.timeline,
        onScroll: isSticky ? this.handleScrollX : noop
      }, _react.default.createElement(_Timeline.default, {
        now: now,
        time: time,
        timebar: timebar,
        tracks: tracks,
        sticky: {
          isSticky: isSticky,
          setHeaderHeight: this.setHeaderHeight,
          viewportWidth: timelineViewportWidth,
          handleHeaderScrollY: this.handleHeaderScrollY,
          headerHeight: headerHeight,
          scrollLeft: scrollLeft
        },
        clickElement: clickElement
      }))));
    }
  }]);

  return Layout;
}(_react.PureComponent);

Layout.propTypes = {
  enableSticky: _propTypes.default.bool.isRequired,
  timebar: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
  time: _propTypes.default.shape({}).isRequired,
  tracks: _propTypes.default.arrayOf(_propTypes.default.shape({})).isRequired,
  now: _propTypes.default.instanceOf(Date),
  isOpen: _propTypes.default.bool,
  toggleTrackOpen: _propTypes.default.func,
  scrollToNow: _propTypes.default.bool,
  onLayoutChange: _propTypes.default.func.isRequired,
  sidebarWidth: _propTypes.default.number,
  timelineViewportWidth: _propTypes.default.number,
  clickElement: _propTypes.default.func,
  clickTrackButton: _propTypes.default.func
};
var _default = Layout;
exports.default = _default;