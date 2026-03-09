import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Form State matching your schema exactly
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    email: "",
    profile_pic: "", // used for display
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // useEffects
  // Load actual user data when page opens
  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/profile`, { withCredentials: true })
      .then((res) => {
        const user = res.data.user;
        if (user) {
          setFormData({
            fullName: user.fullName || "",
            username: user.username || "",
            bio: user.bio || "",
            email: user.email || "",
            profile_pic:
              user.profile_pic ||
              `https://ui-avatars.com/api/?name=${user.fullName}&background=zinc&color=fff`,
          });
        }
      })
      .catch(() => toast.error("Could not fetch profile"))
      .finally(() => setIsLoading(false));
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Updated Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Jab file select ho, toh naye route par navigate karein aur file ko state me bhej dein
      navigate("/user/edit-profile/pic", { state: { file } });
    }
    // Note: Reset input value so same file can be selected again if needed
    e.target.value = null;
  };

  // Trigger hidden file input
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Update Basic Profile Details
      await axios.put(
        `${API_URL}/api/user/update/profile/details`,
        {
          fullName: formData.fullName,
          username: formData.username,
          bio: formData.bio,
        },
        { withCredentials: true },
      );

      // 2. Update Email Separately
      await axios.put(
        `${API_URL}/api/user/update/profile/email`,
        { email: formData.email },
        { withCredentials: true },
      );

      toast.success("Profile updated successfully!");
      navigate("/user/profile"); // Go back to profile after save
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center transition-colors duration-300">
      {/* Responsive Container */}
      <div className="w-full max-w-2xl min-h-screen bg-white dark:bg-black relative flex flex-col shadow-sm border-x border-transparent sm:border-zinc-200 sm:dark:border-zinc-900">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-900 dark:text-white hover:opacity-70 transition"
            >
              {/* Cancel/Close Icon */}
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
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Edit Profile
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-bold text-base transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Done"}
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 sm:p-10">
          {/* Profile Picture Edit Section */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative group cursor-pointer"
              onClick={triggerFileSelect}
            >
              <img
                src={formData.profile_pic}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-800 transition group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              onClick={triggerFileSelect}
              className="mt-4 text-blue-500 dark:text-blue-400 font-semibold text-sm hover:underline"
            >
              Edit picture or avatar
            </button>
          </div>

          {/* Form Fields */}
          <form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                name="fullName" // CHANGE HERE: from 'name' to 'fullName'
                value={formData.fullName} // CHANGE HERE: from 'name' to 'fullName'
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a bio..."
                rows="3"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition resize-none"
              ></textarea>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
              />
            </div>

            {/* Account Settings Links (Optional UI flair) */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-8 space-y-4">
              <button
                type="button"
                className="w-full text-left text-blue-500 dark:text-blue-400 font-medium text-sm hover:underline"
              >
                Personal information settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
