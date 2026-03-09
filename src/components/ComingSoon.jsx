import React from "react";
import { useNavigate } from "react-router-dom";

const ComingSoon = ({
  title = "Coming Soon",
  message = "We're working hard to bring this feature to you. Stay tuned for exciting updates!",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl p-8 text-center flex flex-col items-center animate-fade-in">
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-red-100 dark:bg-red-500/20 rounded-full animate-ping opacity-50"></div>
          <div className="relative w-full h-full bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center border border-red-200 dark:border-red-500/30">
            <img
              src="https://ik.imagekit.io/adityazvs6yuayk/logos/Craver-logo-1.png"
              alt="craver-logo"
              className="w-[80%] object-cover"
            />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
          {message}
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
