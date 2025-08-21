import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lines from "../../components/Lines";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlock, faLock } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setNotification } from "../../redux/notificationSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [showPassword, setShowPassword] = useState(false);
  const passwordIcon = showPassword ? faUnlock : faLock;
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/register", formData, {
        withCredentials: true,
      });
      console.log("Response: ", response.data);
      dispatch(setNotification("A verification mail is sent to your registered mail id. Kindly verify your email."))
      toast.success("Registration successful!");
      navigate("/auth/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please check your input."
      );
      console.error("Error: ", err);
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
              Create a new account
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
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password:</label>
                <div className="relative flex items-center justify-center border">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
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
                Register
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <button
                className="border mt-3 p-1 cursor-pointer w-full"
                style={{ position: "relative" }}
                onClick={() => navigate("/auth/login")}
              >
                Go to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
