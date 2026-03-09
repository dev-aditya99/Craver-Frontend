import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyFeed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80dvh] w-full px-6 text-center animate-fade-in">
      {/* Animated Food Icon Container */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative text-8xl md:text-9xl filter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-bounce-slow">
          🍱
        </div>
        {/* Little Sad Emoji Overlap */}
        <div className="absolute -bottom-2 -right-2 text-4xl">🔍</div>
      </div>

      {/* Text Section */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
        The Kitchen is Quiet! 🤫
      </h2>
      <p className="text-zinc-400 text-sm md:text-base max-w-[280px] md:max-w-md leading-relaxed mb-8">
        Humne saare cupboards check kar liye, par abhi koi bhi naya food reel
        nahi mila. Check back later ya kuch naya search karke dekhein!
      </p>

      {/* Interactive Buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md">
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh Feed</span>
        </button>

        <button
          onClick={() => navigate("/user/search")}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-bold py-3.5 px-6 rounded-2xl border border-zinc-700 transition-all"
        >
          Explore Partners
        </button>
      </div>

      {/* Background Decorative Element */}
      <div className="mt-12 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-50">
        Craver by Gigglade
      </div>

      {/* Adding custom animations via style tag */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EmptyFeed;
