import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SingleReel = ({ reel }) => {
  const videoRef = useRef(null);
  const clickTimeout = useRef(null);
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const [totalLikes, setTotalLikes] = useState(reel?.likeCount || 0);
  const [totalSave, setTotalSave] = useState(reel?.saveCount || 0);

  const [isLiked, setIsLiked] = useState(() => {
    return localStorage.getItem(`isLiked_${reel?._id}`) === "true";
  });

  const [isSaved, setIsSaved] = useState(() => {
    return localStorage.getItem(`isSaved_${reel?._id}`) === "true";
  });

  const [isFollowing, setIsFollowing] = useState(() => {
    return (
      localStorage.getItem(`isFollowing_${reel?.foodPartner?._id}`) === "true"
    );
  });

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Naya state Share modal ke liye
  const [isShareOpen, setIsShareOpen] = useState(false);

  const initialCount =
    reel?.commentCount ||
    (Array.isArray(reel?.comments)
      ? reel.comments.length
      : Number(reel?.comments)) ||
    0;

  const [localCommentCount, setLocalCommentCount] = useState(initialCount);

  const currentUserId =
    JSON.parse(localStorage.getItem("userDetails"))?.id || null;

  useEffect(() => {
    setLocalCommentCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current
            ?.play()
            .then(() => setIsPlaying(true))
            .catch((err) => console.log("Autoplay prevented:", err));
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const likeHandler = async (isFromDoubleTap = false) => {
    if (isFromDoubleTap && isLiked) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reel?._id },
        { withCredentials: true },
      );

      if (response.data.like) {
        setTotalLikes((prev) => prev + 1);
        setIsLiked(true);
        localStorage.setItem(`isLiked_${reel?._id}`, "true");
      } else {
        setTotalLikes((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
        localStorage.setItem(`isLiked_${reel?._id}`, "false");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error in the like reel");
      console.error(error);
    }
  };

  const handleVideoClick = (e) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;

      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);

      if (!isLiked) {
        likeHandler(true);
      }
    } else {
      clickTimeout.current = setTimeout(() => {
        togglePlay();
        clickTimeout.current = null;
      }, 250);
    }
  };

  const saveHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: reel?._id },
        { withCredentials: true },
      );

      if (response.data.save) {
        setTotalSave((prev) => prev + 1);
        setIsSaved(true);
        localStorage.setItem(`isSaved_${reel?._id}`, "true");
      } else {
        setTotalSave((prev) => Math.max(0, prev - 1));
        setIsSaved(false);
        localStorage.setItem(`isSaved_${reel?._id}`, "false");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/follow",
        { partnerId: reel?.foodPartner?._id },
        { withCredentials: true },
      );

      setIsFollowing(response.data.isFollowing);
      localStorage.setItem(
        `isFollowing_${reel?.foodPartner?._id}`,
        response.data.isFollowing,
      );
    } catch (error) {
      console.error("Error following partner", error);
    }
  };

  const handleOpenComments = async () => {
    setIsCommentOpen(true);
    setIsLoadingComments(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/food/${reel?._id}/comments`,
      );
      setCommentsList(res.data.comments);
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/comment",
        { foodId: reel?._id, text: newComment },
        { withCredentials: true },
      );

      setCommentsList([res.data.comment, ...commentsList]);
      setNewComment("");
      setLocalCommentCount((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const previousComments = [...commentsList];
    const previousCount = localCommentCount;

    setCommentsList((prev) =>
      prev.filter((comment) => comment._id !== commentId),
    );
    setLocalCommentCount((prev) => Math.max(0, prev - 1));

    try {
      await axios.delete(
        `http://localhost:3000/api/food/comment/${commentId}`,
        {
          withCredentials: true,
        },
      );
      toast.success("Comment deleted");
    } catch (error) {
      setCommentsList(previousComments);
      setLocalCommentCount(previousCount);
      toast.error(
        error.response?.data?.message || "Cannot delete this comment",
      );
    }
  };

  // --- Share Logic ---
  const shareUrl = `${window.location.origin}/shared-reel/${reel?._id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setIsShareOpen(false);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const shareToPlatform = (platform) => {
    const text = encodeURIComponent(
      `Check out this amazing food reel on Craver! 🤤`,
    );
    const url = encodeURIComponent(shareUrl);
    let shareLink = "";

    switch (platform) {
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${text} %0A ${url}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      default:
        break;
    }

    if (shareLink) window.open(shareLink, "_blank");
    setIsShareOpen(false);
  };

  return (
    <div className="h-[100dvh] w-full relative snap-start snap-always bg-black flex-shrink-0">
      <style>
        {`
          @keyframes foodPop {
            0% { transform: scale(0) rotate(-15deg); opacity: 0; }
            40% { transform: scale(1.4) rotate(10deg); opacity: 1; filter: drop-shadow(0 0 20px rgba(239,68,68,0.6)); }
            60% { transform: scale(1.1) rotate(0deg); opacity: 1; }
            100% { transform: scale(1) translateY(-40px); opacity: 0; }
          }
          @keyframes sparkParticle {
            0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(1.5); opacity: 0; }
          }
          .animate-food-pop { animation: foodPop 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .animate-spark { animation: sparkParticle 1.2s ease-out forwards; }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}
      </style>

      <video
        ref={videoRef}
        src={reel?.video}
        loop
        playsInline
        onClick={handleVideoClick}
        className="h-full w-full object-cover cursor-pointer select-none"
      />

      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="relative flex items-center justify-center animate-food-pop">
            <span className="text-8xl md:text-9xl drop-shadow-2xl">🍔</span>
            <span
              className="absolute animate-spark text-3xl"
              style={{ "--tx": "-60px", "--ty": "-80px" }}
            >
              ✨
            </span>
            <span
              className="absolute animate-spark text-4xl"
              style={{ "--tx": "70px", "--ty": "-70px" }}
            >
              🔥
            </span>
            <span
              className="absolute animate-spark text-2xl"
              style={{ "--tx": "-70px", "--ty": "50px" }}
            >
              🤤
            </span>
            <span
              className="absolute animate-spark text-3xl"
              style={{ "--tx": "60px", "--ty": "60px" }}
            >
              ✨
            </span>
          </div>
        </div>
      )}

      {!isPlaying && !showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="h-20 w-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-10 h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none z-10"></div>

      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center space-y-6">
        {/* Like */}
        <button
          onClick={() => likeHandler(false)}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <svg
              className={`w-8 h-8 drop-shadow-lg transition-colors duration-300 ${isLiked ? "text-red-500" : "text-white"}`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isLiked ? "0" : "2"}
              viewBox="0 0 24 24"
            >
              {isLiked ? (
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              )}
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md transition-all">
            {totalLikes}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={handleOpenComments}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition hover:scale-110 active:scale-95">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
            {localCommentCount}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={saveHandler}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg transition-all duration-300"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isSaved ? "0" : "2"}
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              ></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md transition-all">
            {totalSave}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex flex-col items-center group"
        >
          <div className="h-11 w-11 flex items-center justify-center transition hover:scale-110">
            <svg
              className="w-8 h-8 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              ></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
            Share
          </span>
        </button>
      </div>

      {/* Bottom Info Section */}
      <div className="absolute bottom-20 left-0 w-full p-4 z-20 pb-4 pr-16 pointer-events-none">
        <div className="flex items-center space-x-3 mb-3 pointer-events-auto">
          <img
            src={
              reel?.foodPartner?.profile_pic ||
              "https://ui-avatars.com/api/?name=Food&background=ef4444&color=fff"
            }
            alt="profile"
            className="w-10 h-10 rounded-full border border-white/50 object-cover"
          />
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold text-base drop-shadow-md">
              {reel?.foodPartner?.name}
            </h3>
            <button
              onClick={handleFollowToggle}
              className={`text-sm font-bold px-3 py-1 rounded-full backdrop-blur-md transition ${isFollowing ? "bg-white/20 text-white border border-transparent" : "text-white border border-white/40 hover:bg-white/20"}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        <p className="text-white text-sm mb-4 line-clamp-2 drop-shadow-md pointer-events-auto">
          <span className="font-bold">{reel?.name} </span>
          <span className="">{reel?.description}</span>
        </p>

        <button
          onClick={() => navigate("/food-partner/" + reel?.foodPartner?._id)}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white py-3 px-5 rounded-xl shadow-lg shadow-red-500/30 font-bold text-base pointer-events-auto"
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Visit Store</span>
        </button>
      </div>

      {/* Share Bottom Sheet Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md w-full">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsShareOpen(false)}
          ></div>

          <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl flex flex-col p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease-out] pb-safe">
            <div className="w-full flex justify-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="absolute top-2 w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <h3 className="text-zinc-900 dark:text-white font-bold text-base mt-2">
                Share this Reel
              </h3>
            </div>

            <div className="py-6 flex justify-around items-center">
              {/* WhatsApp */}
              <button
                onClick={() => shareToPlatform("whatsapp")}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-105 transition">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  WhatsApp
                </span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={() => shareToPlatform("twitter")}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white hover:scale-105 transition border border-zinc-700">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  X (Twitter)
                </span>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:scale-105 transition">
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Copy Link
                </span>
              </button>
            </div>

            {/* Read-only URL box */}
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl flex items-center mb-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate flex-1">
                {shareUrl}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Style Comment Bottom Sheet */}
      {isCommentOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md w-full">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCommentOpen(false)}
          ></div>

          <div className="relative w-full h-[70%] bg-zinc-100 dark:bg-zinc-900 rounded-t-2xl flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease-out]">
            <div className="w-full flex justify-center py-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="absolute top-2 w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <h3 className="text-zinc-900 dark:text-white font-bold text-sm mt-2">
                Comments
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden">
              {isLoadingComments ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-900 dark:border-white"></div>
                </div>
              ) : commentsList.length === 0 ? (
                <div className="text-center text-zinc-500 py-10 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                commentsList.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex space-x-3 group relative items-start"
                  >
                    <img
                      src={
                        comment.user?.profile_pic ||
                        `https://ui-avatars.com/api/?name=${comment.user?.fullName}&background=zinc&color=fff`
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {comment.user?.username || comment.user?.fullName}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Just now
                        </span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-0.5 leading-snug pr-6">
                        {comment.text}
                      </p>
                    </div>

                    {currentUserId === comment.user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-zinc-400 hover:text-red-500 p-1 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 absolute right-0 top-1"
                        title="Delete Comment"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pb-6 sm:pb-3">
              <form
                onSubmit={handlePostComment}
                className="flex items-center space-x-3"
              >
                <img
                  src={
                    reel?.foodPartner?.profile_pic ||
                    `https://ui-avatars.com/api/?name=User&background=ef4444&color=fff`
                  }
                  alt="My Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm rounded-full px-4 py-2.5 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm disabled:opacity-50 transition-all pr-2"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleReel;
