
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // This is just a safeguard to ensure users land on the correct page
    // The actual routing is handled by the Router in App.tsx
    const path = window.location.pathname;
    if (path === "/index" || path === "/index.html") {
      navigate("/");
    }
  }, [navigate]);
  
  return <LandingPage />;
};

export default Index;
