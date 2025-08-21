import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Lines from "../../components/Lines";

const VerifyEmail = ({ user_Id }) => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = localStorage.getItem("accessToken");
        console.log(response);

        if (!response) {
          setVerificationStatus("Kindly login first. Redirecting to login...");
          setIsVerifying(false);
          setTimeout(() => {
            navigate("/auth/login", { state: { from: "/auth/verify-email" } });
          }, 3000); // Redirect after 3 seconds
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error checking login status:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken"); // Clear invalid token
          setVerificationStatus("Session expired. Redirecting to login...");
        } else {
          setVerificationStatus("An error occurred. Redirecting to login...");
        }
        setIsVerifying(false);
        setTimeout(() => {
          navigate("/auth/login", { state: { from: "/auth/verify-email" } });
        }, 3000); // Redirect after 3 seconds
        return false;
      }
    };

    const verifyEmail = async () => {
      const accessToken = searchParams.get("accessToken");
      console.log("Full URL:", window.location.href);
      console.log("Extracted token:", accessToken);

      if (!accessToken) {
        setVerificationStatus(
          "Invalid or missing token. Please check your email link."
        );
        setIsVerifying(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/verify-email", {
          accessToken,
        });
        setVerificationStatus(
          response.data.message || "Email verified successfully!"
        );
        setTimeout(() => navigate("/dashboard"), 5000); // Redirect after 5 seconds
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationStatus(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to verify email. Please try again."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    const handleVerification = async () => {
      const isLoggedIn = await checkLoginStatus();
      if (isLoggedIn) {
        verifyEmail(); // Only call verifyEmail if the user is logged in
      }
    };

    handleVerification();
  }, [searchParams, navigate, user_Id]);

  return (
    <>
      <Lines />
      <div className="flex items-center justify-center min-h-screen p-10 font-mono">
        <div className="border p-1">
          <div className="p-5 border w-full max-w-lg text-center">
            {isVerifying ? (
              <p className="text-3xl font-semibold">Verifying your email...</p>
            ) : (
              <p className="text-3xl font-semibold">{verificationStatus}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
