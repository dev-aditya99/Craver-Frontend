import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Profile = () => {
  // Hooks
  const [activeTab, setActiveTab] = useState("reels");
  const [profile, setProfile] = useState(null);
  const [reels, setReels] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  // FIX: Fetch initial state from localStorage to persist on refresh
  const [isFollowing, setIsFollowing] = useState(() => {
    return localStorage.getItem(`isFollowing_${id}`) === "true";
  });

  const [isPicModalOpen, setIsPicModalOpen] = useState(false);

  // useEffects
  useEffect(() => {
    axios
      .get(`${API_URL}/api/food-partner/` + id, {
        withCredentials: true,
      })
      .then((res) => {
        setProfile(res.data.foodPartner);
        setReels(res.data.foodPartner.foodItems);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
        console.log("Error at Food Partner Profile", err);
      });
  }, [id]);

  // Loading State
  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          Loading store...
        </p>
      </div>
    );
  }

  // Naya Follow Handler Function
  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/follow`,
        { partnerId: id },
        { withCredentials: true },
      );

      setIsFollowing(response.data.isFollowing);
      localStorage.setItem(`isFollowing_${id}`, response.data.isFollowing);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    // Outer container background
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center transition-colors duration-300">
      {/* Responsive Container */}
      <div className="w-full max-w-3xl min-h-screen bg-white dark:bg-black relative flex flex-col shadow-sm border-x border-transparent sm:border-zinc-200 sm:dark:border-zinc-900">
        {/* Top Header */}
        <div className="sticky max-w-full overflow-auto top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center sm:justify-between justify-center">
          <div className="max-w-[80%] flex items-center space-x-4">
            <button
              onClick={() => history.back()}
              className="text-zinc-900 dark:text-white hover:opacity-70 transition"
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
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center">
              <span className="sm:max-w-none max-w-[60%] truncate">
                {" "}
                {profile.name}
              </span>
              <svg
                className="w-5 h-5 text-blue-500 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
              </svg>
            </h1>
          </div>
          <div className="max-w-[19%] flex space-x-4">
            <button className="text-zinc-900 dark:text-white hover:opacity-70 transition hidden sm:block">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>
            <button className="text-zinc-900 dark:text-white hover:opacity-70 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-8 pt-6 pb-4">
          <div className="flex flex-row items-center space-x-4 sm:space-x-8 mb-6">
            {/* Profile Pic */}
            <div
              className="flex-shrink-0 relative cursor-pointer group"
              onClick={() => setIsPicModalOpen(true)}
            >
              <img
                src={
                  profile.profile_pic ||
                  `https://ui-avatars.com/api/?name=${profile.name}&background=ef4444&color=fff&size=150`
                }
                alt={profile.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-red-500 rounded-full p-1.5 border-2 border-white dark:border-black z-10">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-7v2h2v3h-2v2h2v3h-2v2h2v5h2V2h-4z" />
                </svg>
              </div>
            </div>

            {/* Stats (Horizontally Scrollable) */}
            <div className="flex-1 min-w-0">
              <div className="flex overflow-x-auto space-x-6 sm:space-x-8 pb-2 [&::-webkit-scrollbar]:hidden snap-x">
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    124
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Meals
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
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    48.2K
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    154
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Following
                  </span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0 snap-start">
                  <span className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    28
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Friends
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="max-w-xl">
            <h2 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              {profile.contactName}
            </p>
            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed">
              Authentic Flavors 🔥
              <br />
              100% Fresh & Hygienic 🌱
            </p>

            {/* address  */}
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 hover:underline flex items-center">
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
              <span>
                {profile.address ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {profile.address}
                  </a>
                ) : (
                  "Location not added"
                )}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={handleFollowToggle}
              className={`flex-1 font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-lg transition ${
                isFollowing
                  ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-lg transition">
              Message
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-sm sm:text-base py-2 sm:py-2.5 rounded-lg transition"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="px-4 sm:px-8 py-2 flex space-x-6 overflow-x-auto [&::-webkit-scrollbar]:hidden border-b border-zinc-200 dark:border-zinc-900 pb-6">
          {["Menu", "Offers", "Behind Scenes", "Combos", "Reviews"].map(
            (highlight, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-zinc-300 dark:border-zinc-700 p-0.5 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition">
                  <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🔥</span>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {highlight}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex-1 py-3 flex justify-center border-b-2 transition ${activeTab === "reels" ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"></path>
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

        {/* Reels Grid Content (Responsive Grid: 3 cols mobile, 4 cols tablet/desktop) */}
        {activeTab === "reels" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-[2px] pb-16">
            {reels.map((reel, index) => (
              <div
                key={index}
                className="relative aspect-[9/16] bg-zinc-200 dark:bg-zinc-800 cursor-pointer group"
              >
                {/* <img
                  src={
                    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=500&auto=format&fit=crop"
                  }
                  alt={`Reel ${index}`}
                  className="w-full h-full object-cover"
                /> */}
                <video
                  src={reel?.video}
                  alt={`Reel ${index}`}
                  muted
                  className="w-full h-full object-cover"
                ></video>
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
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-white text-sm font-semibold drop-shadow-md">
                    {Math.floor(Math.random() * 50) + 10}K
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-200 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Tab Content Placeholder */}
        {activeTab === "menu" && (
          <div className="flex flex-col items-center justify-center py-20 pb-32 text-zinc-500">
            <svg
              className="w-16 h-16 mb-4 text-zinc-300 dark:text-zinc-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            <p className="font-medium text-lg text-zinc-900 dark:text-white">
              Full Menu
            </p>
            <p className="text-sm">
              Detailed list of food items will appear here.
            </p>
          </div>
        )}

        {/* Contact Modal / Popup Dialog */}
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                  Contact Store
                </h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition bg-zinc-200 dark:bg-zinc-800 rounded-full p-1.5"
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Modal Body with Actionable Links */}
              <div className="p-6 space-y-4">
                {/* Email Action */}
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition group"
                >
                  <div className="h-12 w-12 flex-shrink-0 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {profile.email}
                    </p>
                  </div>
                </a>

                {/* Phone Action */}
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition group"
                >
                  <div className="h-12 w-12 flex-shrink-0 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {profile.phone}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Profile Pic Fullscreen Modal for Food Partner */}
        {isPicModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity p-4"
            onClick={() => setIsPicModalOpen(false)} // Click anywhere to close
          >
            <div className="relative flex flex-col items-center justify-center w-full max-w-sm animate-fade-in">
              <img
                src={`https://ui-avatars.com/api/?name=${profile.name}&background=ef4444&color=fff&size=500`}
                alt={profile.name}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl border-2 border-zinc-800"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking the image itself
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
