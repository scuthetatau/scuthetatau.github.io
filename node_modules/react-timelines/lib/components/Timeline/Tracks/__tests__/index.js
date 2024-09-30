"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require(".."));

var _Track = _interopRequireDefault(require("../Track"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Tracks />', function () {
  it('renders <Track /> components', function () {
    var props = {
      time: {},
      tracks: [{
        id: '1',
        elements: []
      }, {
        id: '2',
        elements: []
      }]
    };
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
    expect(wrapper.find(_Track.default)).toHaveLength(2);
  });
});