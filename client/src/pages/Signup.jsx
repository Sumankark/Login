import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation for required fields
    if (!data.userName || !data.email || !data.password || !recaptchaToken) {
      setError("All fields are required.");
      return;
    }

    // Validation for Gmail addresses only
    const emailDomain = data.email.split("@")[1];
    if (emailDomain !== "gmail.com") {
      setError("Only Gmail addresses are allowed.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/users", {
        ...data,
        recaptchaToken,
      });
      console.log(response.data);

      setData({
        userName: "",
        email: "",
        password: "",
      });
      setRecaptchaToken("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }
  };

  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="userName" className="block text-gray-700">
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
            <label htmlFor="email" className="block text-gray-700">
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
            <label htmlFor="password" className="block text-gray-700">
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
