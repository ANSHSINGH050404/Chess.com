import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#302e2b] text-white">
      <nav className="flex items-center justify-between px-6 py-3 bg-[#272522] border-b border-[#464340]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#86b32d] rounded flex items-center justify-center font-bold text-sm">
              ♚
            </div>
            <span className="text-xl font-bold tracking-tight">Chess</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#bababa]">
            <a href="#" className="hover:text-white transition">Play</a>
            <a href="#" className="hover:text-white transition">Learn</a>
            <a href="#" className="hover:text-white transition">Watch</a>
            <a href="#" className="hover:text-white transition">News</a>
            <a href="#" className="hover:text-white transition">Social</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-sm text-[#bababa] hover:text-white transition">
            Log In
          </button>
          <button className="px-4 py-1.5 text-sm bg-[#86b32d] hover:bg-[#7ba32a] text-white font-semibold rounded transition">
            Sign Up
          </button>
        </div>
      </nav>

      <section className="flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16 max-w-6xl mx-auto">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Play Chess
            <br />
            <span className="text-[#86b32d]">Online</span>
          </h1>
          <p className="mt-4 text-[#bababa] text-lg max-w-md mx-auto lg:mx-0">
            Play chess with millions of players around the world. Free, unlimited
            games, and no registration required.
          </p>
          <button
            onClick={() => navigate("/game")}
            className="mt-8 px-10 py-4 bg-[#86b32d] hover:bg-[#7ba32a] text-white text-lg font-bold rounded-lg shadow-lg shadow-[#86b32d]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Play Now
          </button>
          <p className="mt-3 text-xs text-[#6a6966]">Free. No download needed.</p>
        </div>

        <div className="flex-1 max-w-md">
          <div className="grid grid-cols-8 gap-0.5 bg-[#272522] p-4 rounded-xl shadow-2xl">
            {Array.from({ length: 64 }, (_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              const piece = getPiece(row, col);
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-lg sm:text-xl ${
                    isLight ? "bg-[#ebecd0]" : "bg-[#779556]"
                  }`}
                >
                  {piece && (
                    <span
                      className={
                        piece.color === "white"
                          ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
                          : "text-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                      }
                    >
                      {piece.symbol}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            How to <span className="text-[#86b32d]">Play</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: "♟",
                title: "Make a Move",
                desc: "Drag and drop or click to move your pieces across the board.",
              },
              {
                icon: "⚔",
                title: "Challenge Others",
                desc: "Play against friends or get matched with players at your level.",
              },
              {
                icon: "🏆",
                title: "Win & Improve",
                desc: "Climb the rankings, analyze your games, and get better every day.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#272522] p-8 rounded-xl border border-[#464340] hover:border-[#86b32d] transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-[#bababa] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 bg-[#1a1a1a] border-t border-[#272522] text-center text-xs text-[#6a6966]">
        <p>&copy; 2026 Chess Clone. Not affiliated with Chess.com.</p>
      </footer>
    </div>
  );
};

function getPiece(row: number, col: number) {
  const pieces: { [key: string]: { symbol: string; color: string } } = {
    "0-0": { symbol: "♜", color: "black" },
    "0-1": { symbol: "♞", color: "black" },
    "0-2": { symbol: "♝", color: "black" },
    "0-3": { symbol: "♛", color: "black" },
    "0-4": { symbol: "♚", color: "black" },
    "0-5": { symbol: "♝", color: "black" },
    "0-6": { symbol: "♞", color: "black" },
    "0-7": { symbol: "♜", color: "black" },
    "1-0": { symbol: "♟", color: "black" },
    "1-1": { symbol: "♟", color: "black" },
    "1-2": { symbol: "♟", color: "black" },
    "1-3": { symbol: "♟", color: "black" },
    "1-4": { symbol: "♟", color: "black" },
    "1-5": { symbol: "♟", color: "black" },
    "1-6": { symbol: "♟", color: "black" },
    "1-7": { symbol: "♟", color: "black" },
    "6-0": { symbol: "♙", color: "white" },
    "6-1": { symbol: "♙", color: "white" },
    "6-2": { symbol: "♙", color: "white" },
    "6-3": { symbol: "♙", color: "white" },
    "6-4": { symbol: "♙", color: "white" },
    "6-5": { symbol: "♙", color: "white" },
    "6-6": { symbol: "♙", color: "white" },
    "6-7": { symbol: "♙", color: "white" },
    "7-0": { symbol: "♖", color: "white" },
    "7-1": { symbol: "♘", color: "white" },
    "7-2": { symbol: "♗", color: "white" },
    "7-3": { symbol: "♕", color: "white" },
    "7-4": { symbol: "♔", color: "white" },
    "7-5": { symbol: "♗", color: "white" },
    "7-6": { symbol: "♘", color: "white" },
    "7-7": { symbol: "♖", color: "white" },
  };
  return pieces[`${row}-${col}`] || null;
}

export default LandingPage;
