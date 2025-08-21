import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Lines from "../../components/Lines";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const resetPasswordToken = searchParams.get("accessToken");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const passwordIcon = showPassword ? faUnlock : faLock;
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axiosInstance.patch(`/auth/${resetPasswordToken}/reset-password`, {
        password: formData.password,
        resetPasswordToken,
      });

      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong!"
      );
    }
  };

  return (
    <>
      <Lines />
      <div className="w-full min-h-screen bg-zinc-800 text-white flex justify-center items-center font-mono">
        <div className="border max-w-fit p-1">
          <form
            onSubmit={handleSubmit}
            className="border max-w-fit min-w-sm pt-4 p-6"
          >
            <div className="text-center mb-3 text-2xl font-semibold">
              Reset Your Password
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="password">New Password:</label>
                <div className="relative flex items-center justify-center border">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                    required
                    className="w-full p-1 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <div className="relative flex items-center justify-center border">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    id="confirmPassword"
                    required
                    className="w-full p-1 focus:outline-none"
                  />
                  <FontAwesomeIcon
                    icon={passwordIcon}
                    className="cursor-pointer absolute right-4"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full border mt-3 p-1 cursor-pointer"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
