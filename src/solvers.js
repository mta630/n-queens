/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {

  // instantiate board based on input
  var board = new Board({'n': n});

  // helper function to recurse on each row
  var makeRows = function (rowIndex) {
    // base case:
    // if end of board is reached
    if (rowIndex === n) {
      // return the rows
      return board.rows();
    // for all columns in the matrix
    } else {
      for (var colIndex = 0; colIndex < n; colIndex++) {
        // toggle piece
        board.togglePiece(rowIndex, colIndex);
        // if there are no conflicts
        if (!board.hasAnyRooksConflicts()) {
          // return recursion on the next row
          return makeRows(rowIndex + 1);
        } else {
          // turn piece back off if there is a conflict
          board.togglePiece(rowIndex, colIndex);
        }
      }
    }
  };

  // set solution to the rows of the board
  var solution = makeRows(0);

  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n === 0) {
    return 1;
  }

  var solutionCount = 1;

  for (var i = 1; i <= n; i ++) {
    solutionCount *= i;
  }

  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var numOfQueens = 0;
  var board = new Board({'n': n});

  console.log('n = ', n);

  if (n === 0 || n === 2 || n === 3) {
    return board.rows();
  }

  var makeRows = function (rowIndex, colStart) {
    // base case:
    // if end of board is reached
    if (rowIndex === n) {
      // return the rows
      return board.rows();
    // for all columns in the matrix
    } else {
      for (var colIndex = colStart; colIndex < n; colIndex++) {
        // toggle piece
        board.togglePiece(rowIndex, colIndex);
        numOfQueens++;
        // if there are no conflicts
        if (!board.hasAnyQueensConflicts()) {
          // return recursion on the next row
          return makeRows(rowIndex + 1, 0);
        } else {
          // turn piece back off if there is a conflict
          board.togglePiece(rowIndex, colIndex);
          numOfQueens--;
        }
      }
    }
  };

  if (n === 1) {
    return [[1]];
  }

  for (var i = 0; i < board.rows()[0].length; i ++) {
    var solution = makeRows(0, i);
    console.log("queen value : ", numOfQueens);
    console.log(board.rows());
    if (numOfQueens === n) {
      console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
      return solution;
    } else {
      numOfQueens = 0;
      board = new Board({'n': n})
    }
  };
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
