import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import SingleReel from "../../components/SingleReel";
import EmptyFeed from "../../components/EmptyFeed";

// --- Main Home Feed Component ---
const Home = () => {
  const [reels, setReels] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Make API call to fetch real reels from backend
    axios
      .get(`${API_URL}/api/food`, { withCredentials: true })
      .then((res) => {
        setReels(res.data?.foodItems || []);
      })
      .catch((err) => {
        console.error(
          "Error fetching reels:",
          err.response ? err.response.data : err.message,
        );
      });
  }, []);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 flex justify-center h-[100dvh] w-full overflow-hidden">
      {/* Scrollable Feed Container - Forces snapping exactly one item per view */}
      <div className="w-full max-w-md h-full bg-black relative overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden flex flex-col">
        {/* Top Header */}
        <div className="absolute top-0 left-0 w-full p-5 z-30 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md flex items-center">
            <img
              src="https://ik.imagekit.io/adityazvs6yuayk/logos/Craver-logo-1.png"
              alt="craver-logo"
              className="w-8"
            />{" "}
            Reels
          </h1>
        </div>

        <div className="bg-black min-h-screen">
          {reels.length > 0 ? (
            <div className="reel-container snap-y snap-mandatory overflow-y-scroll h-screen">
              {reels.map((reel) => (
                <SingleReel key={reel._id} reel={reel} />
              ))}
            </div>
          ) : (
            <EmptyFeed /> // <-- Yahan call karein
          )}
          <UserBottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default Home;
