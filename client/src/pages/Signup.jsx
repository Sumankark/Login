import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { toast, ToastContainer, Zoom } from "react-toastify";
import axios from "axios";
import { passwordStrength } from "../utility/passwordStrength"; // Ensure this function works as expected

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [psdStrength, setPsdStrength] = useState("");
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      const strength = passwordStrength(value);
      setPsdStrength(strength);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.userName || !data.email || !data.password || !recaptchaToken) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
      return;
    }

    if (psdStrength === "weak") {
      toast.error("Password is too weak. Please choose a stronger password.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
      return;
    }

    const emailDomain = data.email.split("@")[1];
    if (emailDomain !== "gmail.com") {
      toast.error("Only Gmail addresses are allowed.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/users", {
        ...data,
        recaptchaToken,
      });

      setData({ userName: "", email: "", password: "" });
      setRecaptchaToken("");
      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
  };

  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="userName" className="block text-left text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={data.userName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
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
            {/* Password Strength Indicator */}
            {data.password && (
              <p
                className={`mt-2 ${
                  psdStrength === "weak"
                    ? "text-red-500"
                    : psdStrength === "moderate"
                    ? "text-yellow-500"
                    : "text-green-500"
                } text-left ml-2`}
              >
                {psdStrength.charAt(0).toUpperCase() + psdStrength.slice(1)}
              </p>
            )}
          </div>
          <div className="mb-6">
            <ReCAPTCHA
              sitekey="6Lcp3T0qAAAAAC1XSpyd9kkGCOU-b11WXYxsU_5d"
              onChange={handleCaptchaChange}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200 `}
          >
            Sign Up
          </button>
        </form>
        <div className="text-center">
          <p className="font-semibold m-2">Or</p>
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
