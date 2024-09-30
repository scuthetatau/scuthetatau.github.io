"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Row = _interopRequireDefault(require("../Row"));

var _Cell = _interopRequireDefault(require("../Cell"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Row />', function () {
  it('renders the <Cell /> components', function () {
    var props = {
      time: {},
      cells: [{
        title: 'test',
        start: new Date(),
        end: new Date(),
        id: '1'
      }, {
        title: 'test',
        start: new Date(),
        end: new Date(),
        id: '2'
      }]
    };
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Row.default, props));
    expect(wrapper.find(_Cell.default)).toHaveLength(2);
  });
});