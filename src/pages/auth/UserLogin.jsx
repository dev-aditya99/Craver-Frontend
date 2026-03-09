import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserLogin = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnTo || "/"; // Agar returnTo nahi hai toh Home pe jao

  const API_URL = import.meta.env.VITE_API_URL;

  // Functions
  // Handle User Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // Validation - Check if email and password are provided
    if (!userData.email || !userData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    // Make API call to register user
    axios
      .post(`${API_URL}/api/auth/user/login`, userData, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message || "Login successful!");
        localStorage.setItem("userDetails", JSON.stringify(res.data.user));
        navigate(returnUrl);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Login failed. Please try again.",
        );
        console.error(
          "Error logging in user:",
          err.response ? err.response.data : err.message,
        );
      });
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 mb-6">
          <svg
            className="h-10 w-10 text-white"
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
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white transition-colors duration-300">
          Welcome back
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-10 shadow-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                name="email"
                className="block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-4 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-4 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            {/* remember me and forgot password section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-zinc-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/user/forgot-password"
                  className="font-medium text-red-500 hover:text-red-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Other Login Options (Google, Apple, etc.) */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-300">
              Google
            </button>
            <button className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-300">
              Apple
            </button>
          </div>

          {/* If user doesn't have an account, show register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              New to Reels?{" "}
              <Link
                to="/user/register"
                className="font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Role Switch Link */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Are you a restaurant owner?{" "}
              <Link
                to="/food-partner/login"
                className="font-medium text-zinc-900 dark:text-white hover:underline transition-all"
              >
                Login as Food Partner
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
