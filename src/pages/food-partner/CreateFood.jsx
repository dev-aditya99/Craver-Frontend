import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PartnerBottomNavigation from "../../components/PartnerBottomNavigation";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  // Navigation State
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Meta Data
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Form Data States
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // --- Step 1 Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setStep(2); // Move straight to Preview step
    } else {
      toast.error("Please select a valid video file.");
    }
  };

  // --- Step 3 Handlers (Final Upload) ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!dishName.trim()) return toast.error("Dish Name is required!");

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("name", dishName);
    formData.append("description", description);

    try {
      const res = await axios.post(API_URL + "/api/food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(res.data.message || "Reel uploaded successfully!");
      navigate("/food-partner/profile");

      // Reset after success
      setStep(1);
      setVideoFile(null);
      setVideoUrl("");
      setDishName("");
      setDescription("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload reel.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-8 pt-4 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 text-center sm:text-left">
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Heading  */}
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Create New Reel
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {step === 1 && "Upload a mouth-watering video of your dish."}
          {step === 2 && "Preview your video to ensure it looks perfect."}
          {step === 3 && "Add dish details and publish your reel."}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300">
        {/* ================= STEP 1: UPLOAD ================= */}
        {step === 1 && (
          <div className="p-8 sm:p-12">
            <label className="flex flex-col items-center justify-center w-full h-[400px] border-2 border-zinc-300 dark:border-zinc-700 border-dashed rounded-3xl cursor-pointer bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="h-20 w-20 mb-4 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-10 h-10 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                </div>
                <p className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="text-red-500">Select a video</span> to begin
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center px-4 mt-2">
                  MP4, WebM or MOV
                  <br />
                  (Vertical 9:16 recommended)
                </p>
              </div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {/* ================= STEP 2: PURE PREVIEW ================= */}
        {step === 2 && (
          <div className="p-6 sm:p-10 flex flex-col items-center">
            {/* Mobile-style Video Preview Wrapper */}
            <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800 mb-8">
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[320px] flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Change Video
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl shadow-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: META DATA & UPLOAD ================= */}
        {step === 3 && (
          <div className="p-8 sm:p-12">
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                  Dish Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Sizzling Paneer Tikka"
                  className="block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-4 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                  Description{" "}
                  <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell your customers what makes this dish special..."
                  className="block w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-4 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isProcessing}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3 rounded-xl shadow-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-70 flex items-center transition-all duration-300"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Uploading...
                    </>
                  ) : (
                    "Publish Reel"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* <PartnerBottomNavigation /> */}
    </div>
  );
};

export default CreateFood;
