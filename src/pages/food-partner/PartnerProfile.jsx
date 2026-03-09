import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// Import your partner bottom navigation
import PartnerBottomNavigation from "../../components/PartnerBottomNavigation";

const PartnerProfile = () => {
  const [activeTab, setActiveTab] = useState("reels");
  const [partnerData, setPartnerData] = useState({});
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Modals and Sidebars
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for the 3-dots options menu on a reel
  const [activeReelMenuId, setActiveReelMenuId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Food Partner's own profile data and their uploaded reels
    axios
      .get(`${API_URL}/api/food-partner/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setPartnerData(res.data.foodPartner || {});
        // Backend bhej raha hai: foodItems: foodItemsByFoodPartner
        setReels(res.data.foodPartner?.foodItems || []);
      })
      .catch((err) => {
        toast.error("Error loading profile data");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Logout / Switch Account Logic
  const handleLogout = async (redirectPath = "/food-partner/login") => {
    try {
      await axios.get(`${API_URL}/api/auth/food-partner/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("partnerDetails"); // Clear partner local storage

      toast.success("Logged out successfully");
      setIsSidebarOpen(false);
      navigate(redirectPath);
    } catch (error) {
      toast.error("Error logging out.");
      console.error("Logout Error:", error);
    }
  };

  // Function to toggle the 3-dots menu for a specific reel
  const toggleReelMenu = (e, reelId) => {
    e.stopPropagation(); // Image pe click na ho (fullscreen play na ho jaye)
    setActiveReelMenuId((prev) => (prev === reelId ? null : reelId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-white">
        Loading Store...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center transition-colors duration-300 pb-16 overflow-x-hidden"
      onClick={() => setActiveReelMenuId(null)}
    >
      <div className="w-full max-w-3xl min-h-screen bg-white dark:bg-black relative flex flex-col shadow-sm border-x border-transparent sm:border-zinc-200 sm:dark:border-zinc-900">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <img
              src="https://ik.imagekit.io/adityazvs6yuayk/logos/Craver-logo-1.png"
              alt="craver-logo"
              className="w-7 inline"
            />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center">
              <span className="max-w-[70%] sm:max-w-none truncate">
                {partnerData.name}
              </span>
              {/* <svg
                className="w-5 h-5 text-blue-500 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
              </svg> */}

              <img
                width="48"
                height="48"
                className="w-5 h-5 text-blue-500 ml-1"
                src="https://img.icons8.com/color/48/instagram-verification-badge.png"
                alt="instagram-verification-badge"
              />
            </h1>
          </div>

          {/* Hamburger Menu */}
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
          <div className="flex flex-row items-center space-x-4 sm:space-x-8 mb-6">
            {/* Profile Pic Clickable */}
            <div
              className="flex-shrink-0 relative cursor-pointer group"
              onClick={() => setIsPicModalOpen(true)}
            >
              <img
                src={
                  partnerData.profile_pic ||
                  `https://ui-avatars.com/api/?name=${partnerData.name}&background=ef4444&color=fff&size=150`
                }
                alt={partnerData.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Stats */}
            <div className="flex-1 min-w-0">
              <div className="flex overflow-x-auto space-x-6 sm:space-x-8 pb-2 [&::-webkit-scrollbar]:hidden snap-x">
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    {reels.length}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Reels
                  </span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    {partnerData.followerCount || 0}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    12.5K
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Served
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="max-w-xl">
            <h2 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
              {partnerData.name}
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              {partnerData.contactName}
            </p>
            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed">
              {partnerData.description ||
                "Authentic Flavors 🔥\n100% Fresh & Hygienic 🌱"}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>

              {/* address  */}
              <span>
                {partnerData.address ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partnerData.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {partnerData.address}
                  </a>
                ) : (
                  "Location not added"
                )}
              </span>
            </p>
          </div>

          {/* Edit & Share Buttons */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => navigate("/food-partner/edit-profile")}
              className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-lg transition"
            >
              Edit profile
            </button>
            <button className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-lg transition">
              Share profile
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-b border-zinc-200 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex-1 py-3 flex justify-center border-b-2 transition ${activeTab === "reels" ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
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
            onClick={() => setActiveTab("menu")}
            className={`flex-1 py-3 flex justify-center border-b-2 transition ${activeTab === "menu" ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* --- Tab Content: Reels --- */}
        {activeTab === "reels" &&
          (reels && reels.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-[2px] pb-16">
              {reels.map((reel) => (
                <div
                  key={reel._id}
                  onClick={() =>
                    navigate("/food-partner/my-reels", {
                      state: { clickedReelId: reel._id },
                    })
                  }
                  className="relative aspect-[9/16] bg-zinc-200 dark:bg-zinc-800 cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <video
                    src={reel?.video ? `${reel.video}#t=0.1` : ""}
                    preload="metadata"
                    muted
                    className="w-full h-full object-cover"
                  ></video>

                  {/* Top Right: Reel Play Icon & 3 Dots Menu */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    {/* Play Icon */}
                    <div className="text-white drop-shadow-md">
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

                    {/* 3 Dots Menu Button */}
                    <div
                      onClick={(e) => toggleReelMenu(e, reel._id)}
                      className="p-1 text-white bg-black/30 rounded-full hover:bg-black/50 transition backdrop-blur-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown Options Menu */}
                  {activeReelMenuId === reel._id && (
                    <div
                      className="absolute top-10 right-2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl py-1 z-20 w-32 border border-zinc-200 dark:border-zinc-700 animate-fade-in"
                      onClick={(e) => e.stopPropagation()} // Prevent closing immediately or clicking the reel
                    >
                      <button className="w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                        Pin to profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                        Private
                      </button>
                      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700 my-1"></div>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium">
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Bottom Left: Views or Like Count (Optional) */}
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-white drop-shadow-md"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                      {reel?.likeCount || 0}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-200 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Premium Empty State */
            <div className="relative w-full px-4 py-20 flex flex-col items-center justify-center text-center">
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">
                You haven't made any reels yet
              </h2>
              <p className="text-zinc-500 text-sm max-w-[250px] mb-6">
                Share your delicious food items with the world by uploading your
                first reel.
              </p>
              <button
                onClick={() => navigate("/food-partner/add-food")}
                className="text-red-500 font-semibold text-sm hover:underline"
              >
                Upload your first Reel
              </button>
            </div>
          ))}

        {/* --- Tab Content: Menus --- */}
        {activeTab === "menu" &&
          // Agar menu items hain toh grid dikhao (Maan lijiye partnerData.menus aapki array hai)
          (partnerData?.menus && partnerData.menus.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pb-16">
              {partnerData.menus.map((menu, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer group bg-zinc-200 dark:bg-zinc-800"
                >
                  <img
                    src={
                      menu.img ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop"
                    }
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
                        {menu.rating || "New"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Premium Empty State for Menu */
            <div className="relative w-full px-4 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800">
                {/* Restaurant Menu / Book Icon */}
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <h2 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">
                Your menu is empty
              </h2>
              <p className="text-zinc-500 text-sm max-w-[250px] mb-6">
                Add mouth-watering dishes to your menu so customers can see what
                you offer.
              </p>
              <button
                onClick={() => navigate("/food-partner/add-menu")} // Ye route aap apne hisab se set kar lein
                className="text-red-500 font-semibold text-sm hover:underline"
              >
                Add your first menu item
              </button>
            </div>
          ))}

        {/* Fullscreen Pic Modal */}
        {isPicModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity p-4"
            onClick={() => setIsPicModalOpen(false)}
          >
            <div className="relative flex flex-col items-center justify-center w-full max-w-sm animate-fade-in">
              <img
                src={
                  partnerData.profile_pic ||
                  `https://ui-avatars.com/api/?name=${partnerData.name}&background=ef4444&color=fff&size=500`
                }
                alt={partnerData.name}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl border-2 border-zinc-800"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Right Sidebar Drawer */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-zinc-950 z-[120] transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-zinc-950 z-[120] transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col h-full">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                    Dashboard
                  </span>
                </button>

                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2"></div>

                {/* Action: Switch to User Account */}
                <button
                  onClick={() => handleLogout("/user/login")}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span className="text-blue-500 font-medium">
                    Switch to User Account
                  </span>
                </button>

                {/* Action: Logout */}
                <button
                  onClick={() => handleLogout("/food-partner/login")}
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

        <PartnerBottomNavigation />
      </div>
    </div>
  );
};

export default PartnerProfile;
