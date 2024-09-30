"use strict";

var _getGrid = _interopRequireDefault(require("../getGrid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getGrid', function () {
  it('returns the cells from the first timebar row that has "useAsGrid" set to true', function () {
    var timebar = [{
      cells: [{
        id: 'row-1-cell-1'
      }]
    }, {
      useAsGrid: true,
      cells: [{
        id: 'row-2-cell-1'
      }]
    }, {
      useAsGrid: true,
      cells: [{
        id: 'row-3-cell-1'
      }]
    }];
    var actual = (0, _getGrid.default)(timebar);
    var expected = [{
      id: 'row-2-cell-1'
    }];
    expect(actual).toEqual(expected);
  });
  it('returns "undefined" if none of the rows have "useAsGrid" set to true', function () {
    var timebar = [{
      cells: []
    }];
    var actual = (0, _getGrid.default)(timebar);
    expect(actual).toEqual(undefined);
  });
});