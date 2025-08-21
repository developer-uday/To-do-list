import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/login");
  }, [navigate]);

  return (
    <div className="text-8xl font-extrabold absolute top-2/5 left-2/5">
      Home
    </div>
  );
};

export default Home;
