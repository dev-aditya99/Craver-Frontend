import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import SingleReel from "../../components/SingleReel";
import UserBottomNavigation from "../../components/UserBottomNavigation";

const SavedReels = () => {
  const [savedReels, setSavedReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const clickedReelId = location.state?.clickedReelId;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/food/save`, {
        withCredentials: true,
      })
      .then((res) => {
        let fetchedReels = res.data?.savedFoods || [];

        if (clickedReelId && fetchedReels.length > 0) {
          const clickedReelIndex = fetchedReels.findIndex(
            (reel) => reel.food._id === clickedReelId,
          );

          if (clickedReelIndex > -1) {
            const [theReel] = fetchedReels.splice(clickedReelIndex, 1);
            fetchedReels.unshift(theReel);
          }
        }

        setSavedReels(fetchedReels);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to load saved reels.",
        );
        console.error("Error fetching saved reels:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [clickedReelId]);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 flex justify-center h-[100dvh] w-full overflow-hidden relative">
      {/* FIX 1: Top Header is now absolutely positioned OUTSIDE the scroll container.
        This ensures it stays fixed at the top of the mobile column regardless of scrolling.
      */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-5 z-40 flex items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-zinc-300 transition mr-4 drop-shadow-lg pointer-events-auto"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
          Saved Reels
        </h1>
      </div>

      {/* FIX 2: Feed Container. 
        Bottom padding/spacing removed since there is no BottomNavigation here. 
      */}
      <div className="w-full max-w-md h-full bg-black relative overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden flex flex-col z-0">
        {/* Loading State */}
        {isLoading && (
          <div className="h-full w-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && savedReels.length === 0 && (
          <div className="h-full w-full flex flex-col items-center justify-center bg-black text-center px-6">
            <svg
              className="w-16 h-16 text-zinc-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              ></path>
            </svg>
            <h2 className="text-white font-bold text-xl mb-2">
              No Saved Reels
            </h2>
            <p className="text-zinc-400 text-sm">
              When you save a reel, it will appear here.
            </p>
          </div>
        )}

        {/* Map through the saved videos */}
        {!isLoading &&
          savedReels.map((reel) => (
            <SingleReel key={reel?.food._id} reel={reel?.food} />
          ))}
        <UserBottomNavigation />
      </div>
    </div>
  );
};

export default SavedReels;
