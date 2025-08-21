import {
  faEdit,
  faUpload,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import ProgressLevel from "./ProgressLevel";

const ProfileContainer = () => {
  const [user, setUser] = useState("User");
  const [image, setImage] = useState(null); // Default to null for no image
  const [hovered, setHovered] = useState(false);

  const handleNameChange = async () => {
    const newName = prompt("Enter your name");
    if (newName && newName.trim()) {
      try {
        await axiosInstance.patch("/user/update-name", {
          name: newName.trim(),
        });
        setUser(newName.trim());
        toast.success("Name updated successfully!");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Error updating name. Please try again."
        );
        console.error("Error updating name:", error);
      }
    } else {
      toast.error("Name cannot be empty.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axiosInstance.post("/upload/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setImage(res.data.url); // Update the profile image
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Error uploading image. Please try again."
        );
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/user/get-profile-image");
        const { name, profileImage } = res.data;
        setUser(name);
        setImage(profileImage || null); // Use null if no profile image exists
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Error fetching user data. Please try again."
        );
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="border p-1 font-mono h-[35rem] ">
      <div className="border h-full">
        <div className="flex flex-col justify-between items-center p-5">
          <div
            className="relative w-30 h-30 border-2 rounded-full flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {image ? (
              <img
                src={image}
                alt="avatar"
                className="w-full h-full rounded-full"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserSecret}
                className="text-6xl text-gray-400"
              />
            )}
            {hovered && (
              <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center rounded-full">
                <label className="cursor-pointer">
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="text-white text-2xl"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-3 mt-5">
            <h1 className="text-2xl font-semibold">Welcome, {user || "User"}</h1>
            <button>
              <FontAwesomeIcon
                icon={faEdit}
                className="text-sm cursor-pointer"
                onClick={handleNameChange}
              />
            </button>
          </div>
          <ProgressLevel />
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
