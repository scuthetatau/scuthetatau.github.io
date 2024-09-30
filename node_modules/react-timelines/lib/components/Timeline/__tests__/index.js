"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require(".."));

var _Header = _interopRequireDefault(require("../Header"));

var _Body = _interopRequireDefault(require("../Body"));

var _Now = _interopRequireDefault(require("../Marker/Now"));

var _Pointer = _interopRequireDefault(require("../Marker/Pointer"));

var _time = _interopRequireDefault(require("../../../utils/time"));

var _getMouseX = _interopRequireDefault(require("../../../utils/getMouseX"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('../../../utils/getMouseX');
var time = (0, _time.default)({
  start: new Date('2018-01-01'),
  end: new Date('2019-01-01'),
  zoom: 1
});
var defaultTimebar = [{
  useAsGrid: true,
  id: '1',
  cells: [{
    id: 'cell-1'
  }]
}];

var createProps = function createProps() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$now = _ref.now,
      now = _ref$now === void 0 ? new Date() : _ref$now,
      _ref$timebar = _ref.timebar,
      timebar = _ref$timebar === void 0 ? defaultTimebar : _ref$timebar,
      _ref$tracks = _ref.tracks,
      tracks = _ref$tracks === void 0 ? [] : _ref$tracks,
      isOpen = _ref.isOpen;

  return {
    now: now,
    time: time,
    timebar: timebar,
    tracks: tracks,
    isOpen: isOpen
  };
};

describe('<Timeline />', function () {
  it('renders <NowMarker />, <Header /> and <Body />', function () {
    var props = createProps();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
    expect(wrapper.find(_Now.default).exists()).toBe(true);
    expect(wrapper.find(_Header.default).exists()).toBe(true);
    expect(wrapper.find(_Body.default).exists()).toBe(true);
  });
  it('renders <Body /> passing in appropriate grid cells', function () {
    var props = createProps();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
    var expected = [{
      id: 'cell-1'
    }];
    expect(wrapper.find(_Body.default).prop('grid')).toEqual(expected);
  });
  describe('markers', function () {
    it('does not render <PointerMarker /> when component mounts', function () {
      var props = createProps();
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
      expect(wrapper.find(_Pointer.default).exists()).not.toBe(true);
    });
    it('renders <PointerMarker /> when component mounts', function () {
      var props = createProps();
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
      wrapper.setState({
        pointerDate: new Date()
      });
      expect(wrapper.find(_Pointer.default).exists()).toBe(true);
    });
    it('does not render <NowMarker /> if "now" is "null"', function () {
      var props = createProps({
        now: null
      });
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
      expect(wrapper.find(_Now.default).exists()).toBe(false);
    });
    it('updates pointerDate when the mouse moves', function () {
      var event = 10;
      var props = createProps();
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
      expect(wrapper.state('pointerDate')).toBe(null);

      _getMouseX.default.mockImplementation(function (e) {
        return e;
      });

      wrapper.find(_Header.default).prop('onMove')(event);
      expect(wrapper.state('pointerDate')).toEqual(new Date('2018-01-11'));
    });
    it('makes the pointer visible and highlighted when the mouse enters', function () {
      var props = createProps();
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
      expect(wrapper.state('pointerVisible')).toBe(false);
      expect(wrapper.state('pointerHighlighted')).toBe(false);
      wrapper.find(_Header.default).prop('onEnter')();
      expect(wrapper.state('pointerVisible')).toBe(true);
      expect(wrapper.state('pointerHighlighted')).toBe(true);
    });
    it('removes the pointer highlight when the mouse leaves', function () {
      var props = createProps();
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
      expect(wrapper.state('pointerHighlighted')).toBe(false);
      wrapper.find(_Header.default).prop('onEnter')();
      expect(wrapper.state('pointerHighlighted')).toBe(true);
      wrapper.find(_Header.default).prop('onLeave')();
      expect(wrapper.state('pointerHighlighted')).toBe(false);
    });
  });
});