"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Header = _interopRequireDefault(require("../Header"));

var _Timebar = _interopRequireDefault(require("../Timebar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStickyProp = function createStickyProp() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isSticky = _ref.isSticky,
      isSticky = _ref$isSticky === void 0 ? false : _ref$isSticky,
      _ref$setHeaderHeight = _ref.setHeaderHeight,
      setHeaderHeight = _ref$setHeaderHeight === void 0 ? jest.fn() : _ref$setHeaderHeight,
      _ref$handleHeaderScro = _ref.handleHeaderScrollY,
      handleHeaderScrollY = _ref$handleHeaderScro === void 0 ? jest.fn() : _ref$handleHeaderScro,
      _ref$headerHeight = _ref.headerHeight,
      headerHeight = _ref$headerHeight === void 0 ? 0 : _ref$headerHeight,
      _ref$viewportWidth = _ref.viewportWidth,
      viewportWidth = _ref$viewportWidth === void 0 ? 0 : _ref$viewportWidth,
      _ref$scrollLeft = _ref.scrollLeft,
      scrollLeft = _ref$scrollLeft === void 0 ? 0 : _ref$scrollLeft;

  return {
    isSticky: isSticky,
    setHeaderHeight: setHeaderHeight,
    handleHeaderScrollY: handleHeaderScrollY,
    headerHeight: headerHeight,
    viewportWidth: viewportWidth,
    scrollLeft: scrollLeft
  };
};

var createProps = function createProps() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$time = _ref2.time,
      time = _ref2$time === void 0 ? {} : _ref2$time,
      _ref2$timebar = _ref2.timebar,
      timebar = _ref2$timebar === void 0 ? [] : _ref2$timebar,
      _ref2$onMove = _ref2.onMove,
      onMove = _ref2$onMove === void 0 ? jest.fn() : _ref2$onMove,
      _ref2$onEnter = _ref2.onEnter,
      onEnter = _ref2$onEnter === void 0 ? jest.fn() : _ref2$onEnter,
      _ref2$onLeave = _ref2.onLeave,
      onLeave = _ref2$onLeave === void 0 ? jest.fn() : _ref2$onLeave,
      _ref2$sticky = _ref2.sticky,
      sticky = _ref2$sticky === void 0 ? undefined : _ref2$sticky;

  return {
    time: time,
    timebar: timebar,
    onMove: onMove,
    onEnter: onEnter,
    onLeave: onLeave,
    sticky: sticky,
    width: '1000px'
  };
};

describe('<Header />', function () {
  it('renders <Timebar />', function () {
    var props = createProps();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Header.default, props));
    expect(wrapper.find(_Timebar.default).exists()).toBe(true);
  });
  it('calls "onMove" on mouse move event', function () {
    var onMove = jest.fn();
    var props = createProps({
      onMove: onMove
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Header.default, props));
    wrapper.simulate('mouseMove');
    expect(onMove).toBeCalled();
  });
  it('calls "onEnter" on mouse enter event', function () {
    var onEnter = jest.fn();
    var props = createProps({
      onEnter: onEnter
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Header.default, props));
    wrapper.simulate('mouseEnter');
    expect(onEnter).toBeCalled();
  });
  it('calls "onLeave" on mouse leave event', function () {
    var onLeave = jest.fn();
    var props = createProps({
      onLeave: onLeave
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Header.default, props));
    wrapper.simulate('mouseLeave');
    expect(onLeave).toBeCalled();
  });
  describe('sticky', function () {
    it('ensures the scroll left postion gets updated when a new scrollLeft prop is received', function () {
      var sticky = createStickyProp();
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(wrapper.find('.rt-timeline__header-scroll').instance().scrollLeft).toBe(0);
      sticky = createStickyProp({
        scrollLeft: 100
      });
      var nextProps = createProps({
        sticky: sticky
      });
      wrapper.setProps(nextProps);
      expect(wrapper.find('.rt-timeline__header-scroll').instance().scrollLeft).toBe(100);
    });
    it('ensures the scroll left position is correct when the header becomes sticky', function () {
      var sticky = createStickyProp({
        isSticky: false
      });
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(wrapper.find('.rt-timeline__header-scroll').instance().scrollLeft).toBe(0);
      sticky = createStickyProp({
        isSticky: true
      });
      var nextProps = createProps({
        sticky: sticky
      });
      wrapper.setProps(nextProps);
      expect(wrapper.find('.rt-timeline__header-scroll').instance().scrollLeft).toBe(0);
    });
    it('does not update the scrollLeft position if the component updates and the scrollLeft and isSticky props have not changed', function () {
      var sticky = createStickyProp();
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(wrapper.find('.rt-timeline__header-scroll').instance().scrollLeft).toBe(0);
      var nextProps = createProps({
        height: 100,
        sticky: sticky
      });
      wrapper.setProps(nextProps);
      expect(wrapper.find('.rt-timeline__header-scroll').instance().scrollLeft).toBe(0);
    });
    it('calls the setHeaderHeight() prop when mounted', function () {
      var setHeaderHeight = jest.fn();
      var sticky = createStickyProp({
        setHeaderHeight: setHeaderHeight
      });
      var props = createProps({
        sticky: sticky
      });
      (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(setHeaderHeight).toBeCalled();
    });
    it('makes the header sticky if isSticky is true', function () {
      var sticky = createStickyProp({
        isSticky: true
      });
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(wrapper.find('.rt-timeline__header').prop('className')).toMatch('is-sticky');
    });
    it('makes the header static if isSticky is false', function () {
      var sticky = createStickyProp({
        isSticky: false
      });
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(wrapper.find('.rt-timeline__header').prop('className')).not.toMatch('is-sticky');
    });
    it('sets the viewportWidth and height of the header if sticky', function () {
      var sticky = createStickyProp({
        isSticky: true,
        viewportWidth: 100,
        headerHeight: 20
      });
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      expect(wrapper.find('.rt-timeline__header').prop('style')).toEqual({
        width: 100,
        height: 20
      });
    });
    it('handles scroll events when sticky', function () {
      var handleHeaderScrollY = jest.fn();
      var sticky = createStickyProp({
        isSticky: true,
        handleHeaderScrollY: handleHeaderScrollY
      });
      var props = createProps({
        sticky: sticky
      });
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Header.default, props));
      wrapper.find('.rt-timeline__header-scroll').simulate('scroll');
      expect(handleHeaderScrollY).toBeCalled();
    });
  });
});