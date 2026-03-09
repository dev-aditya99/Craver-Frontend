import React, { useState, useEffect } from "react";
import UserBottomNavigation from "../../components/UserBottomNavigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  // Hooks
  const [activeTab, setActiveTab] = useState("reels");
  const [savedFoods, setSavedFoods] = useState([]);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  // NEW: Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Dummy Saved Menus (Restaurants)
  const savedMenus = [
    {
      name: "The Spice Lounge",
      rating: "4.8",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Burger Cartel",
      rating: "4.5",
      img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=500&auto=format&fit=crop",
    },
  ];

  // useEffects
  useEffect(() => {
    const fetchProfile = axios.get(`${API_URL}/api/user/profile`, {
      withCredentials: true,
    });
    const fetchSaved = axios.get(` ${API_URL}/api/food/save`, {
      withCredentials: true,
    });

    Promise.all([fetchProfile, fetchSaved])
      .then(([profileRes, savedRes]) => {
        setUserData(profileRes.data.user || {});
        setSavedFoods(savedRes.data.savedFoods || []);
      })
      .catch((err) => {
        toast.error("Error loading profile data");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // NEW: Logout Logic
  const handleLogout = async (redirectPath = "/login") => {
    try {
      // Backend pe logout request bhejo taaki cookies/token clear ho jaye
      await axios.get(`${API_URL}/api/auth/user/logout`, {
        withCredentials: true,
      });

      // Local storage se details clear karo
      localStorage.removeItem("userDetails");
      // Agar aapne koi aur items save kiye hain jaise 'userId', toh unhe bhi clear kar sakte hain

      toast.success("Logged out successfully");
      setIsSidebarOpen(false); // Close sidebar
      navigate(redirectPath); // Redirect to specified path
    } catch (error) {
      toast.error("Error logging out. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center transition-colors duration-300 pb-16 overflow-x-hidden">
      {/* Responsive Main Container */}
      <div className="w-full max-w-3xl min-h-screen bg-white dark:bg-black relative flex flex-col shadow-sm border-x border-transparent sm:border-zinc-200 sm:dark:border-zinc-900">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center justify-between">
          <div className="max-w-[70%] flex items-center space-x-1">
            <img
              src="https://ik.imagekit.io/adityazvs6yuayk/logos/Craver-logo-1.png"
              alt="craver-logo"
              className="w-8"
            />{" "}
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">
              {userData.username}
            </h1>
          </div>

          {/* Settings Icon (Hamburger/3 Bars) triggers the Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-zinc-900 dark:text-white hover:opacity-70 transition"
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
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-8 pt-6 pb-4">
          <div className="flex flex-row items-center space-x-6 sm:space-x-10 mb-5">
            {/* Profile Pic */}
            <div
              className="flex-shrink-0 relative cursor-pointer"
              onClick={() => setIsPicModalOpen(true)}
            >
              <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 hover:scale-105 transition-transform duration-300">
                <div className="p-0.5 bg-white dark:bg-black rounded-full">
                  <img
                    src={
                      userData.profile_pic ||
                      `https://ui-avatars.com/api/?name=${userData.fullName}&background=zinc&color=fff`
                    }
                    alt={userData.username}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 flex justify-around sm:justify-start sm:space-x-12">
              <div
                onClick={() => navigate("/user/orders")}
                className="flex flex-col items-center"
              >
                <span className="font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white">
                  12
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Orders
                </span>
              </div>
              <div
                onClick={() => navigate("/user/followings")}
                className="flex flex-col items-center cursor-pointer"
              >
                <span className="font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white">
                  {userData?.followingCount || 0}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Following
                </span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-5">
            <h2 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
              {userData?.fullName}
            </h2>
            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-snug mt-1">
              {userData?.bio || "No bio added yet"}
            </p>
          </div>

          {/* Edit Profile Button */}
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/user/edit-profile")}
              className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-xl transition"
            >
              Edit profile
            </button>
            <button className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-xl transition">
              Share profile
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-zinc-200 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex-1 py-3.5 flex justify-center border-b-[3px] transition-colors ${activeTab === "reels" ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8z"></path>
            </svg>
          </button>
          <button
            onClick={() => setActiveTab("menus")}
            className={`flex-1 py-3.5 flex justify-center border-b-[3px] transition-colors ${activeTab === "menus" ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
            </svg>
          </button>
        </div>

        {/* --- Tab Content: Saved Reels --- */}
        {activeTab === "reels" &&
          (savedFoods && savedFoods.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-[2px] pb-16">
              {savedFoods.map((foodItem, index) => (
                <div
                  key={foodItem?._id || index}
                  onClick={() =>
                    navigate("/user/saved-reels", {
                      state: { clickedReelId: foodItem?.food?._id },
                    })
                  }
                  className="relative aspect-[9/16] bg-zinc-200 dark:bg-zinc-800 cursor-pointer group"
                >
                  <video
                    src={
                      foodItem?.food?.video
                        ? `${foodItem.food.video}#t=0.1`
                        : ""
                    }
                    preload="metadata"
                    muted
                    className="w-full h-full object-cover"
                  ></video>
                  <div className="absolute top-2 right-2 text-white drop-shadow-md">
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-200 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full px-4 py-20 flex flex-col items-center justify-center text-center">
              <svg
                className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4"
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
              <h2 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">
                No saved reels
              </h2>
              <p className="text-zinc-500 text-sm">
                When you save a reel, it will appear here.
              </p>
            </div>
          ))}

        {/* --- Tab Content: Saved Menus --- */}
        {activeTab === "menus" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pb-16">
            {savedMenus.map((menu, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group bg-zinc-200 dark:bg-zinc-800"
              >
                <img
                  src={menu.img}
                  alt={menu.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight truncate drop-shadow-md">
                    {menu.name}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <svg
                      className="w-3 h-3 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-white text-xs font-semibold">
                      {menu.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <UserBottomNavigation />

        {/* Profile Pic Fullscreen Modal */}
        {isPicModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity p-4"
            onClick={() => setIsPicModalOpen(false)}
          >
            <div className="relative flex flex-col items-center justify-center w-full max-w-sm animate-fade-in">
              <img
                src={userData.profile_pic}
                alt={userData.username}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl border-2 border-zinc-800"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* NEW: Right Sidebar Drawer */}
        {/* Black backdrop overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* The sliding panel */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-zinc-950 z-[120] transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-zinc-900 dark:text-white text-lg">
                Settings
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-full text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Sidebar Menu Options */}
            <div className="flex-1 overflow-y-auto py-2">
              <button className="w-full px-5 py-4 flex items-center space-x-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
                <svg
                  className="w-6 h-6 text-zinc-700 dark:text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  Your activity
                </span>
              </button>

              <button className="w-full px-5 py-4 flex items-center space-x-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
                <svg
                  className="w-6 h-6 text-zinc-700 dark:text-zinc-300"
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
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  Saved
                </span>
              </button>

              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2"></div>

              {/* Action: Switch to Food Partner */}
              <button
                onClick={() => handleLogout("/food-partner/login")}
                className="w-full px-5 py-4 flex items-center space-x-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                </svg>
                <span className="text-blue-500 font-medium">
                  Switch to Food Partner Account
                </span>
              </button>

              {/* Action: Logout */}
              <button
                onClick={() => handleLogout("/user/login")}
                className="w-full px-5 py-4 flex items-center space-x-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span className="text-red-500 font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
