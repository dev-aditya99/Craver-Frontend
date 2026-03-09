import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PartnerBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if the current path matches the button's path
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md bg-black/90 backdrop-blur-lg border-t border-zinc-800 z-50 flex justify-around items-center py-3 pb-safe">
      {/* Dashboard / Home */}
      <button
        onClick={() => navigate("/food-partner/dashboard")}
        className={`flex flex-col items-center space-y-1 transition w-16 ${
          isActive("/food-partner/dashboard")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/food-partner/dashboard") ? (
            /* Filled Home/Dashboard Icon */
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          ) : (
            /* Outlined Home/Dashboard Icon */
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          )}
        </svg>
        <span
          className={`text-[10px] ${isActive("/food-partner/dashboard") ? "font-bold" : "font-medium"}`}
        >
          Dashboard
        </span>
      </button>

      {/* Orders */}
      <button
        onClick={() => navigate("/food-partner/orders")}
        className={`flex flex-col items-center space-y-1 transition relative w-16 ${
          isActive("/food-partner/orders")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
      >
        {/* Notification Dot (Optional - can be made dynamic) */}
        <span className="absolute top-0 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>

        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/food-partner/orders") ? (
            /* Filled List/Orders Icon */
            <path
              fill="currentColor"
              d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
            />
          ) : (
            /* Outlined List/Orders Icon */
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            ></path>
          )}
        </svg>
        <span
          className={`text-[10px] ${isActive("/food-partner/orders") ? "font-bold" : "font-medium"}`}
        >
          Orders
        </span>
      </button>

      {/* Add New (Center prominent button) */}
      <button
        onClick={() => navigate("/create-food")}
        className="flex flex-col items-center justify-center -mt-6 transition hover:scale-105 active:scale-95"
      >
        <div className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 border-4 border-black">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </div>
      </button>

      {/* Menus / Items */}
      <button
        onClick={() => navigate("/food-partner/menu")}
        className={`flex flex-col items-center space-y-1 transition w-16 ${
          isActive("/food-partner/menu")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/food-partner/menu") ? (
            /* Filled Grid Icon */
            <path
              fill="currentColor"
              d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"
            />
          ) : (
            /* Outlined Grid Icon */
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            ></path>
          )}
        </svg>
        <span
          className={`text-[10px] ${isActive("/food-partner/menu") ? "font-bold" : "font-medium"}`}
        >
          Menu
        </span>
      </button>

      {/* Partner Profile */}
      <button
        onClick={() => navigate("/food-partner/profile")}
        className={`flex flex-col items-center space-y-1 transition w-16 ${
          isActive("/food-partner/profile")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/food-partner/profile") ? (
            /* Filled Store Icon */
            <path
              fill="currentColor"
              d="M12 18H6v-4h6m9 0v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9-4H8v-2h4v2zM6.52 8L7.08 5h9.84l.56 3H6.52z"
            />
          ) : (
            /* Outlined Store Icon */
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          )}
        </svg>
        <span
          className={`text-[10px] ${isActive("/food-partner/profile") ? "font-bold" : "font-medium"}`}
        >
          Store
        </span>
      </button>
    </div>
  );
};

export default PartnerBottomNavigation;
