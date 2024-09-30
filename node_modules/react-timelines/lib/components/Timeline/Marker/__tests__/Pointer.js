"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Pointer = _interopRequireDefault(require("../Pointer"));

var _ = _interopRequireDefault(require(".."));

var _time = _interopRequireDefault(require("../../../../utils/time"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var time = (0, _time.default)({
  start: new Date('2017-01-01'),
  end: new Date('2018-01-01'),
  zoom: 1
});
describe('<PointerMarker />', function () {
  var props = {
    time: time,
    date: new Date('2017-01-02'),
    visible: false,
    highlighted: false
  };
  it('renders <Marker /> passing down horizontal position', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Pointer.default, props));
    expect(wrapper.find(_.default).prop('x')).toBe(1);
  });
  it('renders "text"', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Pointer.default, props));
    expect(wrapper.find('strong').text()).toBe('2 Jan');
  });
});