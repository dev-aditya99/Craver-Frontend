import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import SingleReel from "../../components/SingleReel"; // Apna SingleReel ka path check kar lein
import PartnerBottomNavigation from "../../components/PartnerBottomNavigation";
import PartnerSingleReel from "../../components/PartnerSingleReel";

const PartnerMyReels = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Profile page se jo reel pe click hua tha, uski ID
  const clickedReelId = location.state?.clickedReelId;

  useEffect(() => {
    // Partner ki khud ki profile aur reels fetch karo
    axios
      .get(`${API_URL}/api/food-partner/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        const fetchedReels = res.data.foodPartner?.foodItems || [];

        // Smart Logic: Jis reel par click kiya tha, usko array ke top (1st) pe le aao,
        // taaki user wahan se neeche scroll karna start kar sake.
        if (clickedReelId && fetchedReels.length > 0) {
          const clickedIndex = fetchedReels.findIndex(
            (r) => r._id === clickedReelId,
          );

          if (clickedIndex > -1) {
            // Clicked reel se end tak, aur fir start se clicked reel tak ka data jod do
            const reorderedReels = [
              ...fetchedReels.slice(clickedIndex),
              ...fetchedReels.slice(0, clickedIndex),
            ];
            setReels(reorderedReels);
          } else {
            setReels(fetchedReels);
          }
        } else {
          setReels(fetchedReels);
        }
      })
      .catch((err) => {
        toast.error("Failed to load reels");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [clickedReelId]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen w-full flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 flex justify-center h-[100dvh] w-full overflow-hidden relative">
      {/* Back Button Overlay */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-4 z-[100] p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg border border-white/10"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>

      {/* Scrollable Reels Container */}
      <div className="w-full max-w-md h-full bg-black relative overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden flex flex-col">
        {reels.length > 0 ? (
          reels.map((reel) => <PartnerSingleReel key={reel._id} reel={reel} />)
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-zinc-500">
            <svg
              className="w-16 h-16 mb-4 text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            <p>No reels found.</p>
          </div>
        )}
      </div>

      {/* <PartnerBottomNavigation /> */}
    </div>
  );
};

export default PartnerMyReels;
