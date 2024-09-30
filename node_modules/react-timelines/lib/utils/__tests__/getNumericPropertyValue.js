"use strict";

var _getNumericPropertyValue = _interopRequireDefault(require("../getNumericPropertyValue"));

var _computedStyle = _interopRequireDefault(require("../computedStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('../computedStyle');
describe('getNumericPropertyValue', function () {
  it('returns the numeric portion within a property value of a DOM node', function () {
    _computedStyle.default.mockImplementation(function (node) {
      return {
        getPropertyValue: function getPropertyValue(prop) {
          return node.style[prop];
        }
      };
    });

    var node = {
      style: {
        height: '100px'
      }
    };
    var actual = (0, _getNumericPropertyValue.default)(node, 'height');
    expect(actual).toBe(100);
  });
});