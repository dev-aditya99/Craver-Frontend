import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GuestSingleReel = ({ reel }) => {
  const videoRef = useRef(null);
  const clickTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [isPlaying, setIsPlaying] = useState(false);

  // Auth Prompt Modal State
  const [authPrompt, setAuthPrompt] = useState({ isOpen: false, action: "" });

  useEffect(() => {
    const options = { root: null, rootMargin: "0px", threshold: 0.7 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current
            ?.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      // Double tap triggers like prompt
      triggerAuthPrompt("like this reel");
    } else {
      clickTimeout.current = setTimeout(() => {
        togglePlay();
        clickTimeout.current = null;
      }, 250);
    }
  };

  const triggerAuthPrompt = (actionName) => {
    setAuthPrompt({ isOpen: true, action: actionName });
  };

  const handleGoToLogin = () => {
    // Current URL (Shared Reel URL) pass kar rahe hain taaki login ke baad wapas aa sake
    navigate("/user/login", { state: { returnTo: location.pathname } });
  };

  return (
    <div className="h-[100dvh] w-full relative bg-black flex-shrink-0">
      <video
        ref={videoRef}
        src={reel?.video}
        loop
        playsInline
        onClick={handleVideoClick}
        className="h-full w-full object-cover cursor-pointer select-none"
      />

      {!isPlaying && !authPrompt.isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="h-20 w-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-10 h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none z-10"></div>

      {/* Right Side Action Buttons (Trigger Auth Prompts) */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center space-y-6">
        <button
          onClick={() => triggerAuthPrompt("like this reel")}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition hover:scale-110 active:scale-95">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
            {reel?.likeCount || 0}
          </span>
        </button>

        <button
          onClick={() => triggerAuthPrompt("comment")}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition hover:scale-110 active:scale-95">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
            {reel?.commentCount || 0}
          </span>
        </button>

        <button
          onClick={() => triggerAuthPrompt("save this reel")}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition hover:scale-110 active:scale-95">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              ></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
            {reel?.saveCount || 0}
          </span>
        </button>

        <button
          onClick={() => triggerAuthPrompt("share this reel")}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition hover:scale-110 active:scale-95">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              ></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
            Share
          </span>
        </button>
      </div>

      {/* Bottom Info Section */}
      <div className="absolute bottom-20 left-0 w-full p-4 z-20 pb-4 pr-16 pointer-events-none">
        <div className="flex items-center space-x-3 mb-3 pointer-events-auto">
          <img
            src={
              reel?.foodPartner?.profile_pic ||
              "https://ui-avatars.com/api/?name=Store"
            }
            alt="profile"
            className="w-10 h-10 rounded-full border border-white/50 object-cover"
          />
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold text-base drop-shadow-md">
              {reel?.foodPartner?.name}
            </h3>
            <button
              onClick={() => triggerAuthPrompt("follow this store")}
              className="text-sm font-bold text-white border border-white/40 px-3 py-1 rounded-full backdrop-blur-md hover:bg-white/20 transition"
            >
              Follow
            </button>
          </div>
        </div>

        <p className="text-white text-sm mb-4 line-clamp-2 drop-shadow-md pointer-events-auto">
          <span className="font-bold">{reel?.name} </span>
          <span className="">{reel?.description}</span>
        </p>

        <button
          onClick={() => triggerAuthPrompt("visit the store")}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white py-3 px-5 rounded-xl shadow-lg shadow-red-500/30 font-bold text-base pointer-events-auto"
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
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Visit Store</span>
        </button>
      </div>

      {/* Auth Prompt Dialog */}
      {authPrompt.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
              You need to log in to {authPrompt.action}. Join Craver to
              interact!
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
              >
                Log In / Sign Up
              </button>
              <button
                onClick={() => setAuthPrompt({ isOpen: false, action: "" })}
                className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSingleReel;
