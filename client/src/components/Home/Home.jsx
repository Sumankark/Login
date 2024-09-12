import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="h-screen flex">
      <div className="bg-white">
        <button
          className="bg-zinc-500 text-white p-2 rounded "
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="w-full flex items-center justify-center font-bold text-5xl text-zinc-500">
        This is My Project
      </div>
    </div>
  );
};

export default Home;
