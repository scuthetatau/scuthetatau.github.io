"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require(".."));

var _Row = _interopRequireDefault(require("../Row"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Timebar />', function () {
  it('renders <Row /> components', function () {
    var props = {
      time: {},
      rows: [{
        id: '1',
        cells: []
      }, {
        id: '1',
        cells: []
      }]
    };
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
    expect(wrapper.find(_Row.default)).toHaveLength(2);
  });
});