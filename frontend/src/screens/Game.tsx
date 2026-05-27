import { useEffect, useRef, useState, useCallback } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";

export const INIT_GAME = "init_game";
export const JOIN_GAME = "join_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

type GameStatus = "connecting" | "waiting" | "playing" | "gameover";

const GamePage = () => {
  const socket = useSocket();
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState(chessRef.current.board());
  const [color, setColor] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<GameStatus>("connecting");
  const [winner, setWinner] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);

  const updateBoard = useCallback(() => {
    setBoard(chessRef.current.board());
  }, []);

  useEffect(() => {
    if (!socket) {
      setStatus("connecting");
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME: {
          chessRef.current = new Chess();
          setColor(message.payload.color === "white" ? "w" : "b");
          updateBoard();
          setStatus("playing");
          setWinner(null);
          setSelectedSquare(null);
          setValidMoves([]);
          break;
        }
        case MOVE: {
          const { from, to } = message.payload;
          try {
            chessRef.current.move({ from, to });
            updateBoard();
          } catch (e) {
            console.error("Invalid move from server", e);
          }
          setSelectedSquare(null);
          setValidMoves([]);
          break;
        }
        case GAME_OVER: {
          setWinner(message.payload.winner === "white" ? "w" : "b");
          setStatus("gameover");
          break;
        }
      }
    };
  }, [socket, updateBoard]);

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (status !== "playing") return;

      const chess = chessRef.current;

      if (square === selectedSquare) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      if (selectedSquare && validMoves.includes(square)) {
        const move = { from: selectedSquare, to: square };
        try {
          chess.move(move);
          updateBoard();
          socket?.send(JSON.stringify({ type: MOVE, move }));
        } catch (e) {
          console.error("Invalid move", e);
        }
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      const piece = chess.get(square);
      if (piece && piece.color === color) {
        setSelectedSquare(square);
        const moves = chess.moves({ square, verbose: true });
        setValidMoves(moves.map((m) => m.to));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    },
    [status, selectedSquare, validMoves, color, socket, updateBoard],
  );

  if (!socket && status === "connecting") {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl text-[#769656] font-semibold">
        Connecting....
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-8 px-4 min-h-screen bg-[#1a1a1a]">
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl w-full items-start">
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <ChessBoard
            board={board}
            color={color}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
          />
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-auto">
          {(status === "waiting" || status === "connecting") && (
            <button
              onClick={() => {
                socket?.send(JSON.stringify({ type: INIT_GAME }));
                setStatus("waiting");
              }}
              disabled={!socket}
              className="px-8 py-4 bg-[#86b32d] hover:bg-[#7ba32a] disabled:bg-[#555] disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition cursor-pointer"
            >
              {status === "waiting" ? "Searching..." : "Play"}
            </button>
          )}

          {status === "waiting" && (
            <div className="text-lg font-semibold text-[#86b32d] animate-pulse">
              Waiting for opponent...
            </div>
          )}

          {status === "playing" && (
            <div className="text-white text-lg font-medium">
              You are{" "}
              <span className="font-bold text-[#86b32d]">
                {color === "w" ? "White" : "Black"}
              </span>
            </div>
          )}

          {status === "gameover" && (
            <div className="text-white">
              <div className="text-2xl font-bold mb-2">
                {winner === color
                  ? "You Won!"
                  : winner
                    ? "You Lost!"
                    : "Draw!"}
              </div>
              <button
                onClick={() => {
                  chessRef.current = new Chess();
                  updateBoard();
                  setStatus("waiting");
                  setWinner(null);
                  setSelectedSquare(null);
                  setValidMoves([]);
                  socket?.send(JSON.stringify({ type: INIT_GAME }));
                }}
                className="px-6 py-3 bg-[#86b32d] hover:bg-[#7ba32a] text-white font-bold rounded-lg transition cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
