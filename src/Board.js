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
      var count = 0;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === 1) {
          count ++;
        }
        if (count > 1) {
          return true;
        }
      }

      return false;
    },
    // Time complexity - O(n)

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // have variable that stores the board (matrix)
      // if some of the rows have conflict
      // return true
      var result = this.rows().some((x, i) => this.hasRowConflictAt(i));
      return result;

    },
    // Time complexity - O(n)

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var obj = this.attributes;
      var count = 0;

      for (key in obj) {
        if (obj[key][colIndex] === 1) {
          count ++;
        }
        if (count > 1) {
          return true;
        }
      }

      return false;
    },
    // Time complexity - O(n)


    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var result = this.rows().some((x, i) => this.hasColConflictAt(i));
      return result;
    },

    // Time complexity - O(n)

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var obj = this.attributes;
      var arr = this.rows();
      var count = 0;
      var startPoint = majorDiagonalColumnIndexAtFirstRow < 0 ? Math.abs(majorDiagonalColumnIndexAtFirstRow) : 0;
      var colCount = majorDiagonalColumnIndexAtFirstRow > 0 ? majorDiagonalColumnIndexAtFirstRow : 0;

      for (var i = startPoint; i < arr.length; i++) {
        if (obj[i][colCount] === 1) {
          count++;
        }
        colCount++;
        if (count > 1) {
          return true;
        }
      }

      return false;
    },
    // Time complexity - O(n)


    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var matrix = [0];

      for (var i = 1; i < this.rows().length; i++) {
        matrix.push(i, -i);
      }

      for (var i = 0; i < matrix.length; i++) {
        if (this.hasMajorDiagonalConflictAt(matrix[i])) {
          return true;
        }
      }
      return false;
    },
    // Time complexity - O(n)


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var obj = this.attributes;
      var arr = this.rows();
      var count = 0;
      var startPoint = minorDiagonalColumnIndexAtFirstRow < arr.length ? 0 : (minorDiagonalColumnIndexAtFirstRow - (arr.length - 1));
      var colCount = minorDiagonalColumnIndexAtFirstRow < arr.length ? minorDiagonalColumnIndexAtFirstRow : arr.length - 1;

      for (var i = startPoint; i < arr.length; i++) {
        if (obj[i][colCount] === 1) {
          count++;
        }
        colCount--;
        if (count > 1) {
          return true;
        }
      }

      return false;
    },

    // Time complexity - O(n)

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var numDiagonals = this.rows().length * 2 - 1;

      var matrix = [numDiagonals];

      for (var i = 1; i < numDiagonals; i++) {
        matrix.push(i);
      }

      for (var i = 0; i < matrix.length; i++) {
        if (this.hasMinorDiagonalConflictAt(matrix[i])) {
          return true;
        }
      }
      return false;
    }

    // Time complexity - O(n)

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
