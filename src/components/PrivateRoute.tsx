import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import auth from Firebase
import { onAuthStateChanged } from "firebase/auth";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        // Redirect to login page if not authenticated
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children;
};
