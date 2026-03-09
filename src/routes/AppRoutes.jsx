import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Home from "../pages/general/Home";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";
import UserProfile from "../pages/user/UserProfile";
import SavedReels from "../pages/user/SavedReels";
import EditProfile from "../pages/user/EditProfile";
import EditProfilePic from "../pages/user/EditProfilePic";
import UserFollowings from "../pages/user/UserFollowings";
import PartnerProfile from "../pages/food-partner/PartnerProfile";
import EditPartnerProfile from "../pages/food-partner/EditPartnerProfile";
import EditPartnerProfilePic from "../pages/food-partner/EditPartnerProfilePic";
import PartnerMyReels from "../pages/food-partner/PartnerMyReels";
import SharedReel from "../pages/general/SharedReel";
import ProtectedRoute from "../pages/general/ProtectedRoute";
import ComingSoon from "../components/ComingSoon";
import AutoSEO from "../components/AutoSEO";

const AppRoutes = () => {
  return (
    <Router>
      <AutoSEO />
      <Routes>
        {/* User Auth Routes  */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />

        {/* Food Partner Auth Routes */}
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegister />}
        />

        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

        {/* General Pages  */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {" "}
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/shared-reel/:reelId" element={<SharedReel />} />

        {/* Food Partner  */}
        <Route
          path="/create-food"
          element={
            <ProtectedRoute>
              <CreateFood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-partner/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-partner/profile"
          element={
            <ProtectedRoute>
              <PartnerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-partner/edit-profile"
          element={
            <ProtectedRoute>
              <EditPartnerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-partner/edit-profile/pic"
          element={
            <ProtectedRoute>
              <EditPartnerProfilePic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-partner/my-reels"
          element={
            <ProtectedRoute>
              <PartnerMyReels />
            </ProtectedRoute>
          }
        />

        {/* Menu  */}
        <Route
          path="/food-partner/menu"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Menu is Discussing!🫠"
                message="We are currently developing the menu for you 💖"
              />
            </ProtectedRoute>
          }
        />

        {/* Orders  */}
        <Route
          path="/food-partner/orders"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Orders will Schedule Soon!🫠"
                message="We are currently developing the Order System for you 💖"
              />
            </ProtectedRoute>
          }
        />

        {/* Dashboard  */}
        <Route
          path="/food-partner/dashboard"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Dashing Dashboard Coming For You!🫠"
                message="We are currently developing the best dashboard system for you 💖"
              />
            </ProtectedRoute>
          }
        />

        {/* Add Menu  */}
        <Route
          path="/food-partner/add-menu"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Add Menu Coming Next!🫠"
                message="Add menu feature coming soon for you!💖"
              />
            </ProtectedRoute>
          }
        />

        {/* ------------------------------ */}
        {/* User  */}
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/saved-reels"
          element={
            <ProtectedRoute>
              <SavedReels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit-profile/pic"
          element={
            <ProtectedRoute>
              <EditProfilePic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/followings"
          element={
            <ProtectedRoute>
              <UserFollowings />
            </ProtectedRoute>
          }
        />

        {/* User Search  */}
        <Route
          path="/user/search"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Search is Cooking! 🍳"
                message="We are preparing the best search experience so you can find your favorite foods instantly."
              />
            </ProtectedRoute>
          }
        />

        {/* User Orders  */}
        <Route
          path="/user/orders"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Orders Preparing for You!🔥"
                message="Your order history will appear here. We are finalizing the kitchen details!"
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
