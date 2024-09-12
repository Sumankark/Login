import React, { useContext } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyUser from "../pages/VerifyUser";
import Home from "../components/Home/Home";
import { GlobalVariableContext } from "../App";
const Routing = () => {
  const { token } = useContext(GlobalVariableContext);
  return (
    <div>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyUser />} />
      </Routes>
    </div>
  );
};

export default Routing;
