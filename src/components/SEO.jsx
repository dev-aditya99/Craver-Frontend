import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description = "Discover the best food reels and menus from top restaurants.",
  keywords = "food, reels, restaurant, zomato, swiggy, delivery, food videos",
  image = "https://yourwebsite.com/default-banner.jpg", // Aapki website ka default logo ya banner
}) => {
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title ? `${title} | Craver` : "Craver"}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta
        property="og:title"
        content={title ? `${title} | Craver` : "Craver"}
      />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={title ? `${title} | Craver` : "Craver"}
      />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
