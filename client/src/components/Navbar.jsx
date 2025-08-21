import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ onNotificationClick }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <nav className="w-full border text-white py-4 px-14 flex justify-between items-center font-mono">
      <div>
        <h1>Notes Explorer</h1>
      </div>
      <ul className="flex items-center space-x-4 cursor-pointer">
        <li className="text-xl mr-6" onClick={onNotificationClick} title="Notifications">
          <FontAwesomeIcon icon={faBell} />
        </li>
        <li className="border py-1 px-5" onClick={handleLogoutClick}>
          Logout
        </li>
      </ul>
    </nav>
  );
};


export default Navbar;
