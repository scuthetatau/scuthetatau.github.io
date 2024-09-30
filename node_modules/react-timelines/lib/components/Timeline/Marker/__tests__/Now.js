"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Now = _interopRequireDefault(require("../Now"));

var _ = _interopRequireDefault(require(".."));

var _time = _interopRequireDefault(require("../../../../utils/time"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createProps = function createProps(_ref) {
  var _ref$now = _ref.now,
      now = _ref$now === void 0 ? new Date() : _ref$now,
      _ref$time = _ref.time,
      time = _ref$time === void 0 ? (0, _time.default)({
    start: new Date(),
    end: new Date(),
    zoom: 1
  }) : _ref$time,
      _ref$visible = _ref.visible,
      visible = _ref$visible === void 0 ? true : _ref$visible;
  return {
    now: now,
    time: time,
    visible: visible
  };
};

describe('<NowMarker />', function () {
  it('renders <Marker /> whose position is calculated from the time', function () {
    var props = createProps({
      now: new Date('2017-01-01'),
      time: (0, _time.default)({
        start: new Date('2016-01-01'),
        end: new Date('2018-01-10'),
        zoom: 1
      })
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Now.default, props));
    expect(wrapper.find(_.default).prop('x')).toBe(366);
  });
  it('renders the formatted date for "now"', function () {
    var props = createProps({
      now: new Date('2017-04-10')
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Now.default, props));
    expect(wrapper.find('strong').text()).toBe('10 Apr');
  });
});