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

window.makeQueenSolution = function(testBoard, rowIndex, colStart, n) {
  colStart = colStart || 0;
  // base case:
  // if end of board is reached
  if (rowIndex === n) {
    // return the rows
    return testBoard.rows();
  // for all columns in the matrix
  } else {
    for (var colIndex = colStart; colIndex < n; colIndex++) {
      // toggle piece
      testBoard.togglePiece(rowIndex, colIndex);
      // if there are no conflicts
      if (!testBoard.hasAnyQueensConflicts()) {
        var result = makeQueenSolution(testBoard, rowIndex + 1, 0, n);
        // only return if the last row is an array
        if (Array.isArray(result)) {
          return result;
        }
        // reloop to last possible position for row
      }
      testBoard.togglePiece(rowIndex, colIndex);
    }
  }
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({'n': n});
  // edge cases
  if (n === 0 || n === 2 || n === 3) {
    return board.rows();
  }
  if (n === 1) {
    return [[1]];
  }

  var solution = makeQueenSolution(board, 0, 0, n);

  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var solutions = [];
  var whereIsCurrentColTest = 0;
  var board = new Board({'n': n});
  if (n === 2 || n === 3) {
    return 0;
  }

  var findAllQueenSolutions = function(testBoard, rowIndex) {
    // base case:
    // if end of board is reached
    if (rowIndex === n) {
      if (!testBoard.hasAnyQueensConflicts()) {
        solutionCount ++;
      }
      return;
    } else {
      for (var colIndex = 0; colIndex < n; colIndex++) {
        // toggle piece
        testBoard.togglePiece(rowIndex, colIndex);
        // if there are no conflicts
        if (!testBoard.hasAnyQueenConflictsOn(rowIndex, colIndex)) {
          findAllQueenSolutions(testBoard, rowIndex + 1);
        }
        testBoard.togglePiece(rowIndex, colIndex);
      }
    }
  };

  findAllQueenSolutions(board, 0);

  return solutionCount;
};