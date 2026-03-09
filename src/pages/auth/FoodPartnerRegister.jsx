import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const FoodPartnerRegister = () => {
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
      name: e.target.name.value,
      contactName: e.target.contactName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      address: e.target.address.value,
      password: e.target.password.value,
    };

    // Validation
    if (
      !foodPartnerData.name ||
      !foodPartnerData.contactName ||
      !foodPartnerData.phone ||
      !foodPartnerData.email ||
      !foodPartnerData.address ||
      !foodPartnerData.password
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Make API call to register food partner
    axios
      .post(`${API_URL}/api/auth/food-partner/register`, foodPartnerData, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(
          response.data.message || "Registration successful! Please log in.",
        );
        localStorage.setItem(
          "partnerDetails",
          JSON.stringify(response.data.foodPartner),
        );
        navigate(returnUrl);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please check your details and try again.",
        );
        console.error("Error registering food partner:", error);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Partner with Reels
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Showcase your food, reach more hungry customers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-10 shadow-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="The Spice Lounge"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            {/* contactName */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                placeholder="Manager / Owner Name"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            {/* phone */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            {/* email */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Business Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="contact@restaurant.com"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            {/* address */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Address
              </label>
              <textarea
                rows="2"
                name="address"
                placeholder="123 Food Street, City, ZIP"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors duration-300"
            >
              Apply as Partner
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already a partner?{" "}
              <Link
                to="/food-partner/login"
                className="font-medium text-zinc-900 dark:text-white hover:underline transition-colors"
              >
                Go to Dashboard
              </Link>
            </p>
          </div>

          {/* Role Switch Link */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Just here to discover and eat?{" "}
              <Link
                to="/user/register"
                className="font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Register as User
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
