"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _TrackKey = _interopRequireDefault(require("../TrackKey"));

var _ = _interopRequireDefault(require(".."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<TrackKey />', function () {
  describe('side component', function () {
    var sideComponent = _react.default.createElement("span", {
      className: "side-component"
    }, "Component");

    var getSideComponent = function getSideComponent(node) {
      return node.find('.side-component');
    };

    it('renders the side component if "sideComponent" exists', function () {
      var track = {
        title: 'test',
        isOpen: true,
        sideComponent: sideComponent
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, {
        track: track,
        clickTrackButton: jest.fn()
      }));
      var component = getSideComponent(wrapper);
      expect(component.exists()).toBe(true);
      expect(component.text()).toEqual('Component');
    });
  });
  describe('link button', function () {
    var getButton = function getButton(node) {
      return node.find('.rt-track-key__side-button');
    };

    it('renders a button if "hasButton" is true and "clickTrackButton" exists', function () {
      var track = {
        title: 'test',
        isOpen: true,
        hasButton: true
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, {
        track: track,
        clickTrackButton: jest.fn()
      }));
      expect(getButton(wrapper).exists()).toBe(true);
    });
    it('does not render when "hasButton" is false', function () {
      var track = {
        title: 'test',
        isOpen: true
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, {
        track: track,
        clickTrackButton: jest.fn()
      }));
      expect(getButton(wrapper).exists()).toBe(false);
    });
    it('does not render when "sideComponent" is present', function () {
      var track = {
        title: 'test',
        isOpen: true,
        hasButton: true,
        sideComponent: _react.default.createElement("span", null, "Component")
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, {
        track: track,
        clickTrackButton: jest.fn()
      }));
      expect(getButton(wrapper).exists()).toBe(false);
    });
    it('does not render when "clickTrackButton" does not exist', function () {
      var track = {
        title: 'test',
        isOpen: true,
        hasButton: true
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, {
        track: track
      }));
      expect(getButton(wrapper).exists()).toBe(false);
    });
    it('calls "clickTrackButton" with the track when clicked', function () {
      var track = {
        title: 'test',
        isOpen: true,
        hasButton: true
      };
      var clickTrackButton = jest.fn();
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, {
        track: track,
        clickTrackButton: clickTrackButton
      }));
      var button = getButton(wrapper);
      expect(clickTrackButton).not.toBeCalled();
      button.simulate('click');
      expect(clickTrackButton).toBeCalledWith(track);
    });
  });
  describe('toggle button', function () {
    var getToggleButton = function getToggleButton(node) {
      return node.find('.rt-track-key__toggle');
    };

    it('renders when "track.isOpen" is defined', function () {
      var props = {
        track: {
          title: 'test',
          isOpen: true
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(getToggleButton(wrapper).exists()).toBe(true);
    });
    it('does not render when "track.isOpen" is undefined', function () {
      var props = {
        track: {
          title: 'test',
          isOpen: undefined
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(getToggleButton(wrapper).exists()).toBe(false);
    });
    it('renders with the text "Close" when "track.isOpen" is "true"', function () {
      var props = {
        track: {
          title: 'test',
          isOpen: true
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(getToggleButton(wrapper).text()).toBe('Close');
    });
    it('renders with the text "Open" when "track.isOpen" is "false"', function () {
      var props = {
        track: {
          title: 'test',
          isOpen: false
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(getToggleButton(wrapper).text()).toBe('Open');
    });
    it('calls "toggleOpen()" when clicked passing "track" as a single argument', function () {
      var track = {
        title: 'test',
        isOpen: false
      };
      var toggleOpen = jest.fn();
      var props = {
        track: track,
        toggleOpen: toggleOpen
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      getToggleButton(wrapper).simulate('click');
      expect(toggleOpen).toBeCalledWith(track);
    });
  });
  describe('<TrackKeys />', function () {
    it('renders when "isOpen" is truthy and "tracks" is not empty', function () {
      var props = {
        track: {
          title: 'test',
          tracks: [{}],
          isOpen: true
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(wrapper.find(_.default).exists()).toBe(true);
    });
    it('does not render when "isOpen" is falsy', function () {
      var props = {
        track: {
          title: 'test',
          tracks: [{}],
          isOpen: false
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(wrapper.find(_.default).exists()).toBe(false);
    });
    it('does not render when "tracks" is falsy', function () {
      var props = {
        track: {
          title: 'test',
          tracks: null,
          isOpen: true
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(wrapper.find(_.default).exists()).toBe(false);
    });
    it('does not render when "tracks" is an empty array', function () {
      var props = {
        track: {
          title: 'test',
          tracks: [],
          isOpen: true
        },
        toggleOpen: jest.fn()
      };
      var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_TrackKey.default, props));
      expect(wrapper.find(_.default).exists()).toBe(false);
    });
  });
});