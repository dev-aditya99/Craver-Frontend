import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Base keywords jo har page pe common rahenge
const baseKeywords =
  "Craver, Gigglade, Food Reels, Social Media for Food, Order Food Online, Food Discounts, Coupons, Zomato alternative, Swiggy alternative, Restaurant Reviews, Pizza, Burger, Samosa, Kachori";

// Heavy SEO Configuration har page ke hisaab se
const seoConfig = {
  "/": {
    title: "Home | Watch Food Reels & Order Directly",
    description:
      "Welcome to Craver by Gigglade. Watch endless delicious food reels, discover new local food partners, and order your favorite dishes instantly with exclusive discounts.",
    keywords:
      "home feed, watch food videos, trending food reels, local restaurants, order food directly, fast food delivery, daily food shorts",
  },
  "/user/login": {
    title: "User Login",
    description:
      "Log in to Craver to like, save, comment on food reels, and order directly from your favorite food partners.",
    keywords:
      "user login, sign in Craver, access account, order food online login",
  },
  "/user/register": {
    title: "Create User Account",
    description:
      "Join Craver today! Sign up to explore mouth-watering food reels, share with friends, and grab exclusive food coupons.",
    keywords:
      "register, sign up, create account Craver, new user food delivery, join social food network",
  },
  "/user/profile": {
    title: "My Profile",
    description:
      "Manage your Craver profile. Check your details, view your activity, and keep track of your food preferences.",
    keywords:
      "user profile, my account, food preferences, manage profile, Craver user",
  },
  "/user/saved-reels": {
    title: "Saved Food Reels",
    description:
      "Watch your favorite saved food reels. Revisit the dishes you loved and order them anytime from Craver.",
    keywords:
      "saved reels, favorite food videos, bookmarked food, crave and order, my food collection",
  },
  "/user/edit-profile": {
    title: "Edit Profile",
    description:
      "Update your Craver personal details, phone number, and preferences to get better food recommendations.",
    keywords:
      "edit profile, update account details, change settings, Craver settings",
  },
  "/user/followings": {
    title: "Following Food Partners",
    description:
      "See all the amazing Food Partners, chefs, and restaurants you follow on Craver. Never miss their new reels and offers.",
    keywords:
      "following, subscribed restaurants, favorite chefs, food partners list, local food creators",
  },
  "/user/search": {
    title: "Search Food & Restaurants",
    description:
      "Craving something specific? Search for Pizza, Samosa, Kachori, or your favorite local Food Partner on Craver.",
    keywords:
      "search food, find restaurants, explore food reels, search pizza near me, discover local food",
  },
  "/user/orders": {
    title: "My Food Orders",
    description:
      "Track all your past and active food orders placed directly through Craver reels. Enjoy your meal!",
    keywords:
      "my orders, track food delivery, order history, Craver purchases, active orders",
  },

  "/food-partner/login": {
    title: "Partner Login | Grow Your Business",
    description:
      "Log in to your Food Partner dashboard. Upload new food reels, manage your menu, and receive direct orders from customers.",
    keywords:
      "restaurant login, food creator login, partner sign in, business dashboard, sell food online",
  },
  "/food-partner/register": {
    title: "Partner Sign Up | List Your Restaurant",
    description:
      "Become a Food Partner on Craver by Gigglade. Upload reels, showcase your menu, and get direct orders with 0% hassle.",
    keywords:
      "register restaurant, become food partner, list business, food creator signup, gigglade business",
  },
  "/food-partner/profile": {
    title: "Store Dashboard & Profile",
    description:
      "Manage your Food Partner profile. See how many followers you have, check reel engagement, and update your store info.",
    keywords:
      "store profile, restaurant dashboard, business analytics, manage food reels",
  },
  "/food-partner/my-reels": {
    title: "My Uploaded Reels",
    description:
      "View and manage all the food reels you have uploaded to Craver. See likes, comments, and shares.",
    keywords:
      "my uploaded reels, manage videos, content creator dashboard, restaurant reels",
  },
  "/food-partner/add-menu": {
    title: "Add Menu Items",
    description:
      "Add new delicious items to your restaurant's menu so customers can order directly while watching your reels.",
    keywords:
      "add menu, update restaurant items, food catalog, pricing, sell dishes online",
  },
  "/create-food": {
    title: "Upload New Reel",
    description:
      "Upload a fresh, mouth-watering food reel to attract more customers and get direct orders on Craver.",
    keywords:
      "upload reel, create food video, post content, marketing for restaurant, share food video",
  },
};

const AutoSEO = () => {
  const location = useLocation();
  // Trailing slash remove karne ke liye taaki exact match ho
  const path = location.pathname.replace(/\/+$/, "") || "/";

  // Default SEO Backup
  let currentSEO = {
    title: "Craver : By Gigglade",
    description:
      "Craver is a social media platform for watching reels of different types of foods from Food Partners. Like, Save, Comment, Share, and Order Directly!",
    keywords: "social food app, Craver main, gigglade app",
  };

  // Logic to find the correct SEO data
  if (seoConfig[path]) {
    currentSEO = seoConfig[path];
  } else if (path.startsWith("/shared-reel/")) {
    currentSEO = {
      title: "Watch this amazing Food Reel!",
      description:
        "Someone shared a delicious food reel with you. Open Craver to watch, like, and order this dish directly!",
      keywords:
        "shared reel, viral food video, delicious food, order now, Craver link",
    };
  } else if (
    path.startsWith("/food-partner/") &&
    path.split("/").length === 3
  ) {
    currentSEO = {
      title: "Food Partner Profile",
      description:
        "Explore this amazing Food Partner on Craver. Watch their reels and order their best dishes today.",
      keywords:
        "restaurant profile, local food partner, order direct, food menu",
    };
  }

  // Combine Base Keywords with Page Specific Keywords
  const finalKeywords = `${currentSEO.keywords}, ${baseKeywords}`;

  // Format Final Title
  const finalTitle = currentSEO.title.includes("Craver")
    ? currentSEO.title
    : `${currentSEO.title} | Craver`;

  // FIX: Forcefully update document title as a fallback mapping for SPAs
  useEffect(() => {
    document.title = finalTitle;
  }, [finalTitle]);

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={currentSEO.description} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph / Social Media Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={currentSEO.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Craver by Gigglade" />
    </Helmet>
  );
};

export default AutoSEO;
