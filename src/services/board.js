class Board {
  constructor (player1, player1Col, player2, player2Col) {
    this.players = [player1, player2];
    this.turn = -1;
    this.board = [];
    this.winner = -1;
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        let color;
        if (i % 2 === 0) {
          color = i % 2 === 0 ? 'white' : 'black';
        } else {
          color = i % 2 === 0 ? 'black' : 'white';
        }
        var pos = new Position(color, i, j);
        let piece;
        if (color === 'black' && (7 * i + j) < 22) {
          piece = new Piece(player1, player1Col);
          piece.setPos(pos);
        }
        if (color === 'black' && (7 * i + j) > 35) {
          piece = new Piece(player2, player2Col);
          piece.setPos(pos);
        }
        pos.piece = piece;
        row.push(pos);
      }
      this.board.push(row);
    }
  }

  move (move) {
    const fromCoord = move.from;
    const toCoord = move.to;
    console.log(fromCoord, toCoord);
    const pos = this.getPosition(fromCoord);
    if (!pos || !pos.piece || this.winner > -1) {
      console.log('invalid move');
      return null;
    }
    const piece = pos.piece;
    console.log(piece);
    // validate move
    // check that the move.to position is not occupied
    // check that it is 'black'
    // check that it's diagonal straight line from the from.pos
    // check the number of places wants to move
    // if it's an even number, check that there are enemy pieces in every middle position
    //  if so, chop those pieces
    // if it's an odd number, check that it's 1.

    // if all good,
    // if valid, move piece to new position
    // add move to piece's list of moves

    this.turn = (this.turn + 1) % 2;

    // check if game has winner
    return move;
  }

  getPosition (coord) {
    return this.board[coord.i][coord.j];
  }
}

class Position {
  constructor (color, i = null, j = null) {
    this.color = color;
    this.empty = true;
    this.piece = null;
    this.coord = { i, j };
  }
}

class Piece {
  constructor (owner, color) {
    this.owner = owner;
    this.color = color;
    this.pos = null;
    this.isQueen = false;
    this.moves = [];
  }

  setPos (pos) {
    this.pos = pos;
  }

  move (pos) {
    this.setPos(pos);
    this.moves.push(pos);
  }
}

module.exports = Board;
