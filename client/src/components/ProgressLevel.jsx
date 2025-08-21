import React, { useState, useEffect } from "react";
import ProgressDetails from "./ProgressDetails";

const ProgressLevel = () => {
  const [level, setLevel] = useState(1); // User's current level
  const [xp, setXp] = useState(0); // User's current XP
  const [maxXp, setMaxXp] = useState(100); // XP required to level up
  const [notes, setNotes] = useState({ active: 0, completed: 0, pending: 0 }); // Note stats

  useEffect(() => {
    const calculateProgress = () => {
      try {
        const completed = notes.completed;

        // Calculate XP based on completed notes
        const currentXp = completed * 10; // Example: 10 XP per completed note
        const xpToNextLevel = 100; // Example: Fixed XP required for next level

        // Update progress level
        const calculatedLevel = Math.floor(currentXp / xpToNextLevel) + 1;
        const calculatedXp = currentXp % xpToNextLevel;

        setLevel(calculatedLevel); // Example: Level increases every 100 XP
        setXp(calculatedXp); // XP within the current level
        setMaxXp(xpToNextLevel); // XP required for next level
      } catch (error) {
        console.error("Error calculating progress:", error);
      }
    };

    calculateProgress();
  }, [notes]);

  return (
    <div className="flex flex-col items-center mt-4 w-full">
      <div className="flex justify-between items-center w-full mb-1">
        <span className="text-lg font-bold">Level {level}</span>
        <span className="text-sm">
          XP: <span className="font-semibold">{xp}</span> / {maxXp}
        </span>
      </div>
      <div className="w-full border h-2 flex items-center">
        <div
          className="bg-white h-2"
          style={{
            width: `${(xp / maxXp) * 100}%`,
            transition: "width 0.5s",
          }}
        ></div>
      </div>
      <span className="text-xs text-[#aaa] mt-1.5">
        Keep completing notes to level up!
      </span>
      <ProgressDetails setNotes={setNotes} />
    </div>
  );
};

export default ProgressLevel;
