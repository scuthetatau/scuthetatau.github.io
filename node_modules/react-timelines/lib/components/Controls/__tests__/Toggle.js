"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Toggle = _interopRequireDefault(require("../Toggle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<Toggle />', function () {
  it('displays "Close" when open', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Toggle.default, {
      toggleOpen: jest.fn(),
      isOpen: true
    }));
    expect(wrapper.text()).toMatch('Close');
  });
  it('displays "Open" when closed', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Toggle.default, {
      toggleOpen: jest.fn(),
      isOpen: false
    }));
    expect(wrapper.text()).toMatch('Open');
  });
  it('calls "toggleOpen()" when clicked', function () {
    var toggleOpen = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Toggle.default, {
      toggleOpen: toggleOpen,
      isOpen: true
    }));
    wrapper.simulate('click');
    expect(toggleOpen).toBeCalled();
  });
});