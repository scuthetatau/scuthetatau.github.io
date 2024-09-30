"use strict";

var _getMouseX = _interopRequireDefault(require("../getMouseX"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getMouseX', function () {
  it('gets mouse x position for a given event', function () {
    var event = {
      clientX: 200,
      currentTarget: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {
            left: 10
          };
        }
      }
    };
    expect((0, _getMouseX.default)(event)).toBe(190);
  });
});