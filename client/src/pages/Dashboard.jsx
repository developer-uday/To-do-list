import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Lines from "../components/Lines";
import NotesContainer from "../components/NotesContainer";
import ProfileContainer from "../components/ProfileContainer";
import Notification from "../components/Notification";

const Dashboard = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className="w-full min-h-screen bg-zinc-800 font-mono relative">
      <Navbar
        onNotificationClick={() => setShowNotification((prev) => !prev)}
      />
      {showNotification && <Notification />}
      <Lines />
      <div className="w-full min-h-screen flex justify-center items-center gap-2 -mt-10">
        <ProfileContainer />
        <NotesContainer />
      </div>
    </div>
  );
};

export default Dashboard;
