// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var arr = this.get(rowIndex);

      var result = arr.reduce((x, y) => x + y);

      return result > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // have variable that stores the board (matrix)
      // if some of the rows have conflict
      // return true
      var result = this.rows().some((x, i) => this.hasRowConflictAt(i));
      return result;

    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var arr = [];

      this.rows().forEach((currentRow) => currentRow.forEach((currentElement, i) => i === colIndex ? arr.push(currentElement) : null));

      var result = arr.reduce((x, y) => x + y);

      return result > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var result = this.rows().some((x, i) => this.hasColConflictAt(i));
      return result;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var arr = [];

      this.rows().forEach((x, xIndex) => x.forEach((y, yIndex) => yIndex - xIndex === majorDiagonalColumnIndexAtFirstRow ? arr.push(y) : null));



      // [[0, 0, 0, 0],  [(0,0), (0,1), (0,2), (0,3)]
      //  [0, 0, 0, 0]   [(1,0), (1,1), (1,2), (1,3)]
      //  [0, 0, 0, 0]   [(2,0), (2,1), (2,2), (2,3)]
      //  [0, 0, 0, 0]]  [(3,0), (3,1), (3,2), (3,3)]
      //
      // [[0, 0, 0, 0],  [(0,0), (0,1), (0,2), (0,3), (0,4)]
      //  [0, 0, 0, 0]   [(1,0), (1,1), (1,2), (1,3), (1,4)]
      //  [0, 0, 0, 0]   [(2,0), (2,1), (2,2), (2,3), (2,4)]
      //  [0, 0, 0, 0]   [(3,0), (3,1), (3,2), (3,3), (3,4)]
      //  [0, 0, 0, 0]]  [(4,0), (4,1), (4,2), (4,3), (4,4)]
      //
      // [[0, 0, 0, 0],  [(0,0), (0,1), (0,2), (0,3), (0,4), (0,5)]
      //  [0, 0, 0, 0]   [(1,0), (1,1), (1,2), (1,3), (1,4), (1,5)]
      //  [0, 0, 0, 0]   [(2,0), (2,1), (2,2), (2,3), (2,4), (2,5)]
      //  [0, 0, 0, 0]   [(3,0), (3,1), (3,2), (3,3), (3,4), (3,5)]
      //  [0, 0, 0, 0]   [(4,0), (4,1), (4,2), (4,3), (4,4), (4,5)]
      // [[0, 0, 0, 0]]  [(5,0), (5,1), (5,2), (5,3), (5,4), (5,5)]

      var result = arr.reduce((x, y) => x + y);
      return result > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var matrix = [];
      this.rows()[0].forEach((x, i) => matrix.push((i - 0), (0 - i)));
      var result = matrix.some((x) => this.hasMajorDiagonalConflictAt(x));
      return result;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var arr = [];

      this.rows().forEach((x, xIndex) => x.forEach((y, yIndex) => yIndex + xIndex === minorDiagonalColumnIndexAtFirstRow ? arr.push(y) : null));

      var result = arr.reduce((x, y) => x + y);
      return result > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // if n is the size of the board (4x4 board = nxn)
      // the maximum number for checking diagonals is 2n - 1

      var matrix = [1, 2, 3, 4, 5];

      this.rows()[0].forEach((x, i) => matrix.push());
      var result = matrix.some((x) => this.hasMinorDiagonalConflictAt(x));
      return result;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
