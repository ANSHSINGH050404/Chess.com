import type { Square, Color, PieceSymbol } from "chess.js";
import { PIECE_UNICODE, toSquare } from "../types/chess";

type BoardPiece = { square: Square; type: PieceSymbol; color: Color } | null;
type BoardRow = BoardPiece[];

interface ChessBoardProps {
  board: BoardRow[];
  color: Color;
  selectedSquare: Square | null;
  validMoves: Square[];
  onSquareClick: (square: Square) => void;
}

const ChessBoard = ({
  board,
  color,
  selectedSquare,
  validMoves,
  onSquareClick,
}: ChessBoardProps) => {
  const squares = Array.from({ length: 64 }, (_, i) => {
    const displayRow = Math.floor(i / 8);
    const displayCol = i % 8;
    const boardRow = color === "w" ? displayRow : 7 - displayRow;
    const boardCol = color === "w" ? displayCol : 7 - displayCol;
    const square = toSquare(boardRow, boardCol);
    const piece = board[boardRow][boardCol];
    const isSelected = square === selectedSquare;
    const isValidTarget = validMoves.includes(square);
    const isLight = (boardRow + boardCol) % 2 === 0;

    return { displayRow, displayCol, square, piece, isSelected, isValidTarget, isLight };
  });

  return (
    <div className="grid grid-cols-8 border-2 border-[#779556] rounded-sm overflow-hidden shadow-lg">
      {squares.map(({ square, piece, isSelected, isValidTarget, isLight }) => {
        const bgColor = isSelected
          ? "bg-[#7fc97f]"
          : isLight
            ? "bg-[#ebecd0]"
            : "bg-[#779556]";

        return (
          <div
            key={square}
            className={`w-[70px] h-[70px] md:w-[80px] md:h-[80px] flex items-center justify-center text-4xl md:text-5xl cursor-pointer relative ${bgColor}`}
            onClick={() => onSquareClick(square)}
          >
            {piece && (
              <span className={piece.color === "w" ? "drop-shadow-sm" : ""}>
                {PIECE_UNICODE[piece.type][piece.color]}
              </span>
            )}
            {isValidTarget && !piece && (
              <div className="absolute w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full bg-[#00000033] transition-transform" />
            )}
            {isValidTarget && piece && (
              <div className="absolute inset-[3px] border-[3px] md:inset-[4px] md:border-[4px] border-[#00000033] rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
