import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    if (!token) {
      toast.error("No token provided");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/v1/customers/email/validation?token=${token}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        // Optionally, you can automatically navigate to the login page here
        // navigate('/login');
      } else {
        toast.error("Error verifying email");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Verification failed");
      } else {
        toast.error("Error: " + error.message);
      }
    }
  };
  return (
    <>
      <h1>Verify Your Email</h1>
      <p>Thanks for signing up. Please click Confirm button.</p>
      <button onClick={() => navigate("/login")}>Confirm Email</button>
    </>
  );
};

export default VerifyEmail;
