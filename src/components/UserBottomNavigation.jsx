import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if the current path matches the button's path
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md bg-black/90 backdrop-blur-lg border-t border-zinc-800 z-50 flex justify-around items-center py-3 pb-safe">
      {/* Home */}
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center space-y-1 transition w-16 ${
          isActive("/") ? "text-white" : "text-zinc-500 hover:text-white/80"
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/") ? (
            /* Filled Home Icon */
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          ) : (
            /* Outlined Home Icon */
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
          className={`text-[10px] ${isActive("/") ? "font-bold" : "font-medium"}`}
        >
          Home
        </span>
      </button>

      {/* Search */}
      <button
        onClick={() => navigate("/user/search")}
        className={`flex flex-col items-center space-y-1 transition w-16 ${
          isActive("/search")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
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
            // Search icon becomes slightly bolder when active since it has no "filled" state
            strokeWidth={isActive("/search") ? "3" : "2"}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <span
          className={`text-[10px] ${isActive("/search") ? "font-bold" : "font-medium"}`}
        >
          Search
        </span>
      </button>

      {/* My Orders */}
      <button
        onClick={() => navigate("/user/orders")}
        className={`flex flex-col items-center space-y-1 transition relative w-16 ${
          isActive("/orders")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/orders") ? (
            /* Filled Bag Icon */
            <>
              <path fill="currentColor" d="M5 9h14l1 12H4L5 9z" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                d="M16 11V7a4 4 0 00-8 0v4"
              />
            </>
          ) : (
            /* Outlined Bag Icon */
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          )}
        </svg>
        <span
          className={`text-[10px] ${isActive("/orders") ? "font-bold" : "font-medium"}`}
        >
          Orders
        </span>
      </button>

      {/* User Profile */}
      <button
        onClick={() => navigate("/user/profile")}
        className={`flex flex-col items-center space-y-1 transition w-16 ${
          isActive("/user/profile")
            ? "text-white"
            : "text-zinc-500 hover:text-white/80"
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {isActive("/user/profile") ? (
            /* Filled Profile Icon */
            <path
              fill="currentColor"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          ) : (
            /* Outlined Profile Icon */
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          )}
        </svg>
        <span
          className={`text-[10px] ${isActive("/user/profile") ? "font-bold" : "font-medium"}`}
        >
          Profile
        </span>
      </button>
    </div>
  );
};

export default UserBottomNavigation;
