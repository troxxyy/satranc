
import { useState, useCallback } from 'react';
import { createInitialBoard, type Position, type Piece, type PieceColor, getPossibleMoves } from '@/lib/chess';

const ChessBoard = () => {
  const [board, setBoard] = useState(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);

  const handleSquareClick = useCallback((x: number, y: number) => {
    if (selectedSquare) {
      const isMovePossible = possibleMoves.some(move => move.x === x && move.y === y);
      
      if (isMovePossible) {
        setBoard(prevBoard => {
          const newBoard = prevBoard.map(row => [...row]);
          const targetPiece = newBoard[y][x];
          
          if (targetPiece) {
            setCapturedPieces(prev => [...prev, targetPiece]);
          }
          
          newBoard[y][x] = newBoard[selectedSquare.y][selectedSquare.x];
          newBoard[selectedSquare.y][selectedSquare.x] = null;
          return newBoard;
        });
        
        setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        const piece = board[y][x];
        if (piece && piece.color === currentPlayer) {
          setSelectedSquare({ x, y });
          setPossibleMoves(getPossibleMoves(board, { x, y }, currentPlayer));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      const piece = board[y][x];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ x, y });
        setPossibleMoves(getPossibleMoves(board, { x, y }, currentPlayer));
      }
    }
  }, [board, selectedSquare, currentPlayer, possibleMoves]);

  const getPieceSymbol = (piece: Piece) => {
    const symbols: Record<PieceType, string> = {
      king: piece.color === 'white' ? '♔' : '♚',
      queen: piece.color === 'white' ? '♕' : '♛',
      rook: piece.color === 'white' ? '♖' : '♜',
      bishop: piece.color === 'white' ? '♗' : '♝',
      knight: piece.color === 'white' ? '♘' : '♞',
      pawn: piece.color === 'white' ? '♙' : '♟',
    };
    return symbols[piece.type];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-4 text-2xl font-light tracking-wide text-gray-700">
        {currentPlayer === 'white' ? "White's Turn" : "Black's Turn"}
      </div>
      
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-lg font-medium text-gray-600">Captured Pieces</div>
          <div className="flex flex-wrap gap-2 p-4 bg-chess-captured rounded-lg shadow-sm min-h-[100px] w-full max-w-md">
            {capturedPieces.map((piece, index) => (
              <div
                key={index}
                className="text-4xl animate-piece-appear"
                style={{ color: piece.color === 'white' ? '#1a1a1a' : '#4a4a4a' }}
              >
                {getPieceSymbol(piece)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div 
            className="grid grid-cols-8 bg-white rounded-lg shadow-lg overflow-hidden animate-board-appear"
            style={{ aspectRatio: '1/1' }}
          >
            {board.map((row, y) => (
              row.map((piece, x) => {
                const isSelected = selectedSquare?.x === x && selectedSquare?.y === y;
                const isPossibleMove = possibleMoves.some(move => move.x === x && move.y === y);
                const isLight = (x + y) % 2 === 0;
                
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`
                      relative flex items-center justify-center text-5xl cursor-pointer
                      transition-all duration-200 hover:opacity-90
                      ${isLight ? 'bg-chess-light' : 'bg-chess-dark'}
                      ${isSelected ? 'bg-chess-selected' : ''}
                      ${isPossibleMove ? 'bg-chess-possible' : ''}
                    `}
                    onClick={() => handleSquareClick(x, y)}
                  >
                    {piece && (
                      <div
                        className={`transition-transform duration-200 ${
                          isSelected ? 'scale-110' : ''
                        }`}
                        style={{ color: piece.color === 'white' ? '#1a1a1a' : '#4a4a4a' }}
                      >
                        {getPieceSymbol(piece)}
                      </div>
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
