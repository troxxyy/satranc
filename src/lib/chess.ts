
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  x: number;
  y: number;
}

export const createInitialBoard = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }

  // Place other pieces
  const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieceOrder[i], color: 'black' };
    board[7][i] = { type: pieceOrder[i], color: 'white' };
  }

  return board;
};

export const isValidMove = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  currentPlayer: PieceColor
): boolean => {
  const piece = board[from.y][from.x];
  if (!piece || piece.color !== currentPlayer) return false;
  
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  
  // Basic move validation per piece type
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Regular move
      if (to.x === from.x && to.y === from.y + direction && !board[to.y][to.x]) {
        return true;
      }
      
      // Initial two-square move
      if (from.y === startRow && to.x === from.x && to.y === from.y + 2 * direction &&
          !board[to.y][to.x] && !board[from.y + direction][from.x]) {
        return true;
      }
      
      // Capture
      if (Math.abs(to.x - from.x) === 1 && to.y === from.y + direction && 
          board[to.y][to.x] && board[to.y][to.x]?.color !== piece.color) {
        return true;
      }
      
      return false;

    case 'knight':
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
      
    case 'bishop':
      return dx === dy;
      
    case 'rook':
      return dx === 0 || dy === 0;
      
    case 'queen':
      return dx === dy || dx === 0 || dy === 0;
      
    case 'king':
      return dx <= 1 && dy <= 1;
      
    default:
      return false;
  }
};

export const getPossibleMoves = (
  board: (Piece | null)[][],
  position: Position,
  currentPlayer: PieceColor
): Position[] => {
  const possibleMoves: Position[] = [];
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (isValidMove(board, position, { x, y }, currentPlayer)) {
        const targetPiece = board[y][x];
        if (!targetPiece || targetPiece.color !== currentPlayer) {
          possibleMoves.push({ x, y });
        }
      }
    }
  }
  
  return possibleMoves;
};
