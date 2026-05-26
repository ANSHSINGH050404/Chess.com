import ChessBoard from "../componets/ChessBoard";
const GamePage = () => {
  return (
    <div className="flex justify-center pt-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl w-full">
        <div className="flex-shrink-0">
          <ChessBoard />
        </div>

        <div className="flex flex-col gap-4">
          <button className="px-6 py-3 bg-[#86b32d] hover:bg-[#7ba32a] text-white font-bold rounded-lg transition cursor-pointer">
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
