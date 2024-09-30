"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require(".."));

var _Header = _interopRequireDefault(require("../Header"));

var _Body = _interopRequireDefault(require("../Body"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Sidebar />', function () {
  it('renders <Header /> and <Body />', function () {
    var props = {
      timebar: [],
      tracks: [{}],
      toggleTrackOpen: jest.fn()
    };
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_.default, props));
    expect(wrapper.find(_Header.default).exists()).toBe(true);
    expect(wrapper.find(_Body.default).exists()).toBe(true);
  });
});