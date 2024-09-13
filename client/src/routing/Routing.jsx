import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyUser from "../pages/VerifyUser";
import Home from "../components/Home/Home";

const Routing = () => {
  const token = localStorage.getItem("token");

  return (
    <div>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to={"/"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyUser />} />
      </Routes>
    </div>
  );
};

export default Routing;
