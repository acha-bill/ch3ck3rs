class Board {
  constructor (player1, player1Col, player2, player2Col) {
    this.turn = null;
    this.board = [];
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
      }
      this.board.push(row);
    }
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
