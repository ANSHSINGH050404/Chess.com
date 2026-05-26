import { useEffect } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";

export const INIT_GAME = "init_game";
export const JOIN_GAME = "join_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
const GamePage = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (_event) => {

    };
  }, [socket]);

  if (!socket) return <div>Connecting....</div>;
  return (
    <div className="flex justify-center pt-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl w-full">
        <div className="flex-shrink-0">
          <ChessBoard />
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              socket.send(
                JSON.stringify({
                  type: INIT_GAME,
                }),
              );
            }}
            className="px-6 py-3 bg-[#86b32d] hover:bg-[#7ba32a] text-white font-bold rounded-lg transition cursor-pointer"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
