"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require(".."));

var _TrackKey = _interopRequireDefault(require("../TrackKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<TrackKeys />', function () {
  it('renders a <TrackKey /> for each track', function () {
    var props = {
      tracks: [{
        id: '1',
        title: 'Track 1'
      }, {
        id: '2',
        title: 'Track 2'
      }],
      toggleOpen: jest.fn()
    };
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
    expect(wrapper.find(_TrackKey.default)).toHaveLength(2);
  });
});