import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserRegister = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnTo || "/"; // Agar returnTo nahi hai toh Home pe jao

  const API_URL = import.meta.env.VITE_API_URL;

  // Functions
  // Handle User Registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // Validation - Check if all fields are provided
    if (!userData.fullName || !userData.email || !userData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Make API call to register user
    axios
      .post(`${API_URL}/api/auth/user/register`, userData, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message || "Registration successful!");
        localStorage.setItem("userDetails", JSON.stringify(res.data.user));
        navigate(returnUrl);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            "Registration failed. Please check your details and try again.",
        );
        console.error(
          "Error registering user:",
          err.response ? err.response.data : err.message,
        );
      });
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Join Zomato Reels
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Discover new flavors and order your next meal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-10 shadow-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                name="fullName"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                name="email"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              Create User Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/user/login"
                className="font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Role Switch Link */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Want to showcase your food?{" "}
              <Link
                to="/food-partner/register"
                className="font-medium text-zinc-900 dark:text-white hover:underline transition-all"
              >
                Register as Food Partner
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
