import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Import your 3 components
import SingleReel from "../../components/SingleReel";
import PartnerSingleReel from "../../components/PartnerSingleReel";
import GuestSingleReel from "../../components/GuestSingleReel";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import GuestBottomNavigation from "../../components/GuestBottomNavigation";

const SharedReel = () => {
  const { reelId } = useParams();
  const navigate = useNavigate();

  const [reel, setReel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Authentication Logic
  const userDetailsStr = localStorage.getItem("userDetails");
  const partnerDetailsStr = localStorage.getItem("partnerDetails"); // Assuming you save partner ID like this

  let viewerType = "GUEST";
  let viewerId = null;

  if (userDetailsStr) {
    viewerType = "USER";
  } else if (partnerDetailsStr) {
    viewerType = "PARTNER";
    // Parse it to get ID (Adjust according to how you save partner data)
    viewerId =
      JSON.parse(partnerDetailsStr)?._id || JSON.parse(partnerDetailsStr)?.id;
  }

  useEffect(() => {
    axios
      .get(`${API_URL}/api/food/shared/${reelId}`)
      .then((res) => {
        setReel(res.data.reel);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [reelId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !reel) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Reel Unavailable</h1>
        <p className="text-zinc-400 mb-8">
          This reel might have been deleted or the link is incorrect.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-6 py-3 rounded-full font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Dynamic Rendering Based on Viewer Type
  return (
    <div className="bg-black min-h-screen w-full flex justify-center overflow-hidden">
      {/* Container for centering on desktop, full screen on mobile */}
      <div className="w-full max-w-md h-[100dvh] relative flex flex-col bg-zinc-900">
        {/* Render respective component */}
        {viewerType === "USER" && (
          <>
            <SingleReel reel={reel} />
            <UserBottomNavigation />
          </>
        )}

        {viewerType === "PARTNER" && (
          <PartnerSingleReel
            reel={reel}
            isOwnReel={viewerId === reel.foodPartner?._id}
          />
        )}

        {viewerType === "GUEST" && (
          <>
            <GuestSingleReel reel={reel} />
            <GuestBottomNavigation />
          </>
        )}
      </div>
    </div>
  );
};

export default SharedReel;
