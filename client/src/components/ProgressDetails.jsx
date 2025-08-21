import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faList } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../utils/axiosInstance";

const ProgressDetails = ({ setNotes }) => {
  const [progressDetails, setProgressDetails] = useState([
    { icon: faList, title: "Active", value: 0 },
    { icon: faBarsProgress, title: "Completed", value: 0 },
    { icon: faList, title: "Pending", value: 0 },
    { icon: faBarsProgress, title: "Total", value: 0 },
  ]);

  useEffect(() => {
    const fetchProgressDetails = async () => {
      try {
        const activeRes = await axiosInstance.get("/notes");
        const activeNotes = activeRes.data;

        if (!Array.isArray(activeNotes)) {
          throw new Error("Invalid response format for active notes");
        }

        const active = activeNotes.length;
        const completed = activeNotes.filter((note) => note.completed).length;
        const pending = active - completed;

        const totalRes = await axiosInstance.get("/user/get-notes-created");
        const total = totalRes.data.totalNotesCreated;

        if (typeof total !== "number") {
          throw new Error("Invalid response format for total notes");
        }

        setProgressDetails([
          { icon: faList, title: "Active", value: active },
          { icon: faBarsProgress, title: "Completed", value: completed },
          { icon: faList, title: "Pending", value: pending },
          { icon: faBarsProgress, title: "Total", value: total },
        ]);

        // Update note stats in ProgressLevel
        if (setNotes) {
          setNotes({ active, completed, pending });
        }
      } catch (error) {
        console.error("Error fetching progress details:", error);
      }
    };

    // Fetch data initially and set up polling
    fetchProgressDetails();
    const interval = setInterval(fetchProgressDetails, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [setNotes]);

  return (
    <div className="grid grid-cols-2 gap-2 mt-5">
      {progressDetails.map((item, idx) => (
        <div key={idx} className="border flex flex-col p-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={item.icon} className="mb-2" />
            <span className="mb-1">{item.title}</span>
          </div>
          <span className="text-2xl font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressDetails;
