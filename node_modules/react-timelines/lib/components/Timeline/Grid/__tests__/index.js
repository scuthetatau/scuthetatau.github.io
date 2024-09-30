"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require(".."));

var _time = _interopRequireDefault(require("../../../../utils/time"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var time = (0, _time.default)({
  start: new Date('2017-01-01T00:00:00.000Z'),
  end: new Date('2017-01-30T00:00:00.000Z'),
  zoom: 10 // 10px === 1 day

});
var grid = [{
  id: '1',
  start: new Date('2017-01-01T00:00:00.000Z'),
  end: new Date('2017-01-06T00:00:00.000Z')
}, {
  id: '2',
  start: new Date('2017-01-06T00:00:00.000Z'),
  end: new Date('2017-01-11T00:00:00.000Z')
}, {
  id: '3',
  start: new Date('2017-01-11T00:00:00.000Z'),
  end: new Date('2017-01-16T00:00:00.000Z')
}];
describe('<Grid />', function () {
  it('renders grid cells, the styling of each repesenting the start and end dates in the grid prop', function () {
    var getItemStyle = function getItemStyle(wrapper, i) {
      return wrapper.find('.rt-grid__cell').get(i).props.style;
    };

    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, {
      time: time,
      grid: grid
    }));
    expect(getItemStyle(wrapper, 0)).toEqual({
      left: '0px',
      width: '50px'
    });
    expect(getItemStyle(wrapper, 1)).toEqual({
      left: '50px',
      width: '50px'
    });
    expect(getItemStyle(wrapper, 2)).toEqual({
      left: '100px',
      width: '50px'
    });
  });
});