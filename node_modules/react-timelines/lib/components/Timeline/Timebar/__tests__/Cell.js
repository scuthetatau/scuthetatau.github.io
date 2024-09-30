"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Cell = _interopRequireDefault(require("../Cell"));

var _time = _interopRequireDefault(require("../../../../utils/time"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Cell />', function () {
  var props = {
    time: (0, _time.default)({
      start: new Date('2016-01-01'),
      end: new Date('2019-01-01'),
      zoom: 1
    }),
    title: 'test',
    start: new Date('2017-01-01'),
    end: new Date('2018-01-01')
  };
  it('renders the "title"', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Cell.default, props));
    expect(wrapper.text()).toBe('test');
  });
  it('renders with a calculated width and left position based on "start" and "end"', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Cell.default, props));
    expect(wrapper.prop('style')).toEqual({
      left: '366px',
      width: '365px'
    });
  });
});