import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Lines from "../../components/Lines";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/auth/forget-password", formData);
      setTimeout(() => navigate("/auth/login"), 3000); // After 3 sec
      toast.success("Kindly check your mail")
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "An error occurred. Please try again."
      );
      console.error("Error: ", err);
    }
  };
  return (
    <>
      <Lines />
      <div className="w-full min-h-screen bg-zinc-800 text-white flex justify-center items-center font-mono">
        <div className="border max-w-fit p-1">
          <form onSubmit={handleSubmit} className="border max-w-fit min-w-sm pt-5 p-6">
            <div className="text-center mb-4 text-2xl font-semibold">
              Find your account
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                  required
                  className="w-full border p-1 focus:outline-none"
                />
                <Link to={"/auth/login"} className="text-sm text-[#aaa]">back to login</Link>
              </div>
              <button
                type="submit"
                className="w-full border mt-3 p-1 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
