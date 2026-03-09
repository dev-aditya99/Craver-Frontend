import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FoodPartnerLogin = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnTo || "/food-partner/profile"; // Agar returnTo nahi hai toh Home pe jao

  const API_URL = import.meta.env.VITE_API_URL;

  // Functions
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const foodPartnerData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // Validation - Check if email and password are provided
    if (!foodPartnerData.email || !foodPartnerData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    // Make API call to login food partner
    axios
      .post(`${API_URL}/api/auth/food-partner/login`, foodPartnerData, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(response.data.message || "Login successful!");
        localStorage.setItem(
          "partnerDetails",
          JSON.stringify(response.data.foodPartner),
        );

        navigate(returnUrl);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Login failed. Please try again.",
        );
        console.error("Error logging in food partner:", error);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white transition-colors duration-300">
          Partner Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Manage your Reels, track orders, and grow.
        </p>
      </div>

      {/* Form Area  */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-10 shadow-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          {/* Form  */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email  */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Business Email
              </label>
              <input
                type="email"
                placeholder="contact@restaurant.com"
                name="email"
                className="block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
              />
            </div>

            {/* Password  */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                className="block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
              />
            </div>

            {/* Remember Me and Forgot Password  */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-zinc-900 focus:ring-zinc-900 border-zinc-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-zinc-900 dark:text-white hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-all duration-300"
            >
              Access Dashboard
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Want to join our platform?{" "}
              <Link
                to="/food-partner/register"
                className="font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Apply here
              </Link>
            </p>
          </div>

          {/* Role Switch Link */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Looking to order food?{" "}
              <Link
                to="/user/login"
                className="font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Login as User
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
