import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfilePic = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Get the file that was passed from the previous screen
  const file = location.state?.file;

  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Agar direct is URL pe aa gaye bina file select kiye, toh waapas bhej do
    if (!file) {
      navigate("/user/edit-profile", { replace: true });
      return;
    }

    // Create a temporary URL to preview the image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Cleanup memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, navigate]);

  const handleSave = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    // Make sure the key matches what your backend expects ("profile_pic")
    formData.append("profile_pic", file);

    try {
      const response = await axios.put(
        `${API_URL}/api/user/update/profile/pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      toast.success(response.data.message || "Profile picture updated!");
      // Upload hone ke baad main profile page par bhej dein
      navigate("/user/profile");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture.",
      );
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Prevent rendering if there's no file (it will redirect via useEffect anyway)
  if (!file) return null;

  return (
    <div className="min-h-screen bg-black flex justify-center h-[100dvh] w-full overflow-hidden">
      {/* Container restricted to mobile width for exact Instagram feel */}
      <div className="w-full max-w-md h-full relative flex flex-col items-center justify-between">
        {/* Top Navigation Bar */}
        <div className="w-full px-4 py-5 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            disabled={isUploading}
            className="text-white hover:text-zinc-300 transition p-2 disabled:opacity-50"
          >
            {/* Cancel (X) Icon */}
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <h1 className="text-white font-semibold text-lg">Preview Photo</h1>

          <button
            onClick={handleSave}
            disabled={isUploading}
            className="text-blue-500 hover:text-blue-400 font-bold text-lg px-2 disabled:opacity-50 transition"
          >
            {isUploading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Center Circular Preview */}
        <div className="flex-1 flex items-center justify-center w-full px-8">
          <div className="relative w-full aspect-square max-w-[300px]">
            {/* Helper circle outline to show the bounds */}
            <div className="absolute inset-0 rounded-full border border-zinc-700/50 pointer-events-none scale-105"></div>

            {/* Actual Image preview masked into a perfect circle */}
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-full h-full object-cover rounded-full shadow-2xl"
            />

            {/* Uploading Overlay Spinner */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="animate-spin h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Text/Helper */}
        <div className="w-full pb-10 px-6 text-center">
          <p className="text-zinc-400 text-sm">
            This is how your profile picture will appear on your profile and
            reels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePic;
