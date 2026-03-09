<div align="center">
  <img src="public/android-chrome-192x192.png" alt="Craver Logo" width="120" />
  <h1>🍔 Craver - Frontend </h1>
  <p><strong>Watch. Crave. Order.</strong></p>
  <p>The client-side application for Craver, a next-gen social food delivery platform blending the endless scroll of Reels with instant food ordering.</p>

<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" /></a>
<a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/tailwind%20css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>

</div>

<br />

## 📖 About The Frontend

This repository contains the React-based User Interface for **Craver**. Designed with a mobile-first approach, it provides a seamless TikTok/Reels-like experience where users can discover food through engaging short videos and order directly from local Food Partners.

## ✨ Key Features

- **Immersive Video Feed:** Utilizes the `Intersection Observer API` for smooth, auto-playing video scrolling.
- **Dual Dashboards:** Distinct and secure UI flows for standard **Users** (shopping/social) and **Food Partners** (store management/analytics).
- **Social Interactions:** Double-tap to like, save favorite reels, and engage via comments in an Instagram-style bottom sheet.
- **Public Shared Reels:** Unauthenticated users can view shared reels via special links (`/shared-reel/:id`). Interactive actions trigger a custom "Login Required" prompt to drive user conversion.
- **Dynamic SEO:** Implemented `react-helmet-async` for route-specific meta tags, titles, and Open Graph images, ensuring beautiful link previews on social media platforms like WhatsApp and X.
- **Secure Routing:** Strict protected routes using React Router DOM.

## 🛠️ Tech Stack

- **Core:** React.js, Vite
- **Styling:** Tailwind CSS (Custom animations and responsive design)
- **Routing:** React Router DOM v6
- **API Calls:** Axios (Configured for credentials/cookies)
- **SEO & Notifications:** React Helmet Async, React Hot Toast

## 🚀 Run Locally

1. **Clone the repo**
   ```sh
   git clone [https://github.com/dev-aditya99/craver-frontend.git](https://github.com/dev-aditya99/craver-frontend.git)
   cd craver-frontend
   ```
