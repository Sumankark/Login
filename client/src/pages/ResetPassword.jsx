import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast, ToastContainer, Zoom } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ password: "" });
  const [params] = useSearchParams();
  const token = params.get("token");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.password || !recaptchaToken) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
      return;
    }

    try {
      await axios.patch(
        "http://localhost:8080/users/reset-password",
        {
          ...data,
          recaptchaToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData({ password: "" });
      setRecaptchaToken("");
      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-6">
            <label htmlFor="password" className="block text-left text-gray-700">
              Password
            </label>
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={data.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="p-3 border border-gray-300 rounded mt-1"
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <ReCAPTCHA
              sitekey="6Lcp3T0qAAAAAC1XSpyd9kkGCOU-b11WXYxsU_5d"
              onChange={handleCaptchaChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
          >
            Submit
          </button>
        </form>
        <div className="text-center">
          <p className="font-semibold mt-2">Or</p>
          <p className="mt-2 font-semibold underline underline-offset-3">
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
