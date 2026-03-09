import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check karein ki user login hai ya nahi (Aapke logic ke hisaab se)
  const userDetails = localStorage.getItem("userDetails");
  const partnerDetails = localStorage.getItem("partnerDetails");
  const isAuthenticated = userDetails ? true : partnerDetails ? true : false;

  if (!isAuthenticated) {
    // Agar login nahi hai, toh turant login page pe redirect kar do
    // 'replace' use karne se user back button dabakar wapas us protected page pe nahi jaa payega
    // 'state' me current URL bhej rahe hain taaki login ke baad wapas yahin aa sake
    return (
      <Navigate
        to="/user/login"
        state={{ returnTo: location.pathname }}
        replace
      />
    );
  }

  // Agar login hai, toh jo page usne manga tha wahi dikhao
  return children;
};

export default ProtectedRoute;
