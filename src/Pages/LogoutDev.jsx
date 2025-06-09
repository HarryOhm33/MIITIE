import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const LogoutDev = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        toast.success("Logged out successfully");
        navigate("/logindev");
      } catch (error) {
        toast.error("Logout failed");
        navigate("/developer");
      }
    };

    handleLogout();
  }, [navigate]);

  return null;
};

export default LogoutDev;
