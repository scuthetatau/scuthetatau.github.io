"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Body = _interopRequireDefault(require("../Body"));

var _TrackKeys = _interopRequireDefault(require("../TrackKeys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Body />', function () {
  it('renders <TrackKeys />', function () {
    var props = {
      tracks: [{}],
      toggleTrackOpen: jest.fn()
    };
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Body.default, props));
    expect(wrapper.find(_TrackKeys.default).exists()).toBe(true);
  });
});