"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _Track = _interopRequireDefault(require("../Track"));

var _ = _interopRequireDefault(require(".."));

var _Element = _interopRequireDefault(require("../Element"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createProps = function createProps(_ref) {
  var _ref$time = _ref.time,
      time = _ref$time === void 0 ? {} : _ref$time,
      _ref$elements = _ref.elements,
      elements = _ref$elements === void 0 ? [] : _ref$elements,
      _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? false : _ref$isOpen,
      _ref$tracks = _ref.tracks,
      tracks = _ref$tracks === void 0 ? [] : _ref$tracks;
  return {
    time: time,
    elements: elements,
    isOpen: isOpen,
    tracks: tracks
  };
};

describe('<Track />', function () {
  it('filters out <Element /> components where "start" is after "end"', function () {
    var props = createProps({
      elements: [{
        id: '1',
        start: new Date('2017-01-01'),
        end: new Date('2018-01-01')
      }, {
        id: '2',
        start: new Date('2018-01-01'),
        end: new Date('2017-01-01')
      }]
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Track.default, props));
    expect(wrapper.find(_Element.default)).toHaveLength(1);
  });
  it('renders <Tracks /> if is open and tracks exist', function () {
    var props = createProps({
      isOpen: true,
      tracks: [{}]
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Track.default, props));
    expect(wrapper.find(_.default)).toHaveLength(1);
  });
  it('renders <Tracks /> if is open and tracks exist', function () {
    var props = createProps({
      isOpen: true,
      tracks: [{}],
      clickElement: jest.fn()
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Track.default, props));
    var tracks = wrapper.find(_.default);
    expect(tracks.props().clickElement).toBe(props.clickElement);
  });
  it('does not render <Tracks /> is is not open', function () {
    var props = createProps({
      isOpen: false,
      tracks: [{}]
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Track.default, props));
    expect(wrapper.find(_.default)).toHaveLength(0);
  });
  it('does not render <Tracks /> if there are no tracks', function () {
    var props = createProps({
      isOpen: true,
      tracks: []
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Track.default, props));
    expect(wrapper.find(_.default)).toHaveLength(0);
  });
});