import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserFollowings = () => {
  const navigate = useNavigate();
  const [followings, setFollowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch Followings List
  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/followings`, {
        withCredentials: true,
      })
      .then((res) => {
        setFollowings(res.data.followings || []);
      })
      .catch((err) => {
        toast.error("Failed to load followings");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle Unfollow directly from the list
  const handleUnfollow = async (partnerId) => {
    try {
      // Optimistic UI Update: Remove the user from the list immediately for a snappy feel
      setFollowings((prev) => prev.filter((p) => p._id !== partnerId));

      const response = await axios.post(
        `${API_URL}/api/user/follow`,
        { partnerId },
        { withCredentials: true },
      );

      // Update local storage so that other pages (like Profile or SingleReel) know about the change
      localStorage.setItem(`isFollowing_${partnerId}`, "false");
      toast.success(response.data.message || "Unfollowed");
    } catch (error) {
      toast.error("Error unfollowing partner");
      console.error(error);
      // Optional: Re-fetch the list if API fails to restore the removed item
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center transition-colors duration-300">
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-black relative flex flex-col shadow-sm border-x border-transparent sm:border-zinc-200 sm:dark:border-zinc-900">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-900 dark:text-white hover:opacity-70 transition mr-4"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Following
          </h1>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900 dark:border-white"></div>
            </div>
          )}

          {!isLoading && followings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800">
                <svg
                  className="w-10 h-10 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">
                Not Following Anyone
              </h2>
              <p className="text-zinc-500 text-sm max-w-[250px]">
                Accounts you follow will appear here.
              </p>
            </div>
          )}

          {/* Followings List */}
          {!isLoading && followings.length > 0 && (
            <div className="space-y-4">
              {followings.map((partner) => (
                <div
                  key={partner._id}
                  className="flex items-center justify-between"
                >
                  {/* Left: Avatar & Info */}
                  <div
                    className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => navigate(`/food-partner/${partner._id}`)}
                  >
                    <img
                      src={
                        partner.profilePic ||
                        `https://ui-avatars.com/api/?name=${partner.name}&background=ef4444&color=fff`
                      }
                      alt={partner.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                    <div className="flex flex-col truncate pr-4">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                        {partner.name}
                      </span>
                      {/* Placeholder Date: Aap backend se actual date la sakte hain baad me */}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        Followed recently
                      </span>
                    </div>
                  </div>

                  {/* Right: Following Button */}
                  <button
                    onClick={() => handleUnfollow(partner._id)}
                    className="px-4 py-1.5 bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 font-semibold text-sm rounded-lg transition-colors flex-shrink-0"
                  >
                    Following
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFollowings;
