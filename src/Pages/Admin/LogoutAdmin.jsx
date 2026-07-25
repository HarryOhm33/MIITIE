import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const LogoutAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        toast.success("Logged out successfully");
        navigate("/loginadmin");
      } catch {
        toast.error("Logout failed");
        navigate("/admin");
      }
    };

    handleLogout();
  }, [navigate]);

  return null;
};

export default LogoutAdmin;
