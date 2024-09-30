"use strict";

var _classes = _interopRequireDefault(require("../classes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('classes', function () {
  it('returns the base class', function () {
    expect((0, _classes.default)('foo')).toBe('foo');
  });
  it('returns the base class plus additional class passed as string', function () {
    expect((0, _classes.default)('bar', 'hello')).toBe('bar hello');
  });
  it('returns the base class plus additional class passed as array', function () {
    expect((0, _classes.default)('bar', ['hello'])).toBe('bar hello');
    expect((0, _classes.default)('foo', ['hello', 'world'])).toBe('foo hello world');
  });
});