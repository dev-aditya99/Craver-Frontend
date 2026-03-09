import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GuestBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Jab user Home ya Search pe click kare
  const handleProtectedAction = () => {
    setShowAuthPrompt(true);
  };

  // Jab user sidha Login button ya Modal ke login pe click kare
  const handleLoginClick = () => {
    navigate("/user/login", { state: { returnTo: location.pathname } });
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md bg-black/90 backdrop-blur-lg border-t border-zinc-800 z-50 flex justify-around items-center py-3 pb-safe px-4">
        {/* Home / Feed (Protected) */}
        <button
          onClick={handleProtectedAction}
          className="flex flex-col items-center space-y-1 transition flex-1 text-zinc-500 hover:text-white"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Search / Explore (Protected) */}
        <button
          onClick={handleProtectedAction}
          className="flex flex-col items-center space-y-1 transition flex-1 text-zinc-500 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        {/* Prominent Login Button */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={handleLoginClick}
            className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white px-5 py-2 rounded-full shadow-lg shadow-red-500/20 font-bold text-sm w-full max-w-[120px]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              ></path>
            </svg>
            <span>Log In</span>
          </button>
        </div>
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Login Required
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
              You need to log in to explore more reels and discover new food
              partners. Join Craver today!
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleLoginClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
              >
                Log In / Sign Up
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestBottomNavigation;
