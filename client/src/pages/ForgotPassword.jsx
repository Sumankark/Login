import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, ToastContainer, Zoom } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [data, setData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !recaptchaToken) {
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

    // Validation for Gmail addresses only
    const emailDomain = data.email.split("@")[1];
    if (emailDomain !== "gmail.com") {
      toast.error("Only Gmail addresses are allowed.", {
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
      await axios.post("http://localhost:8080/users/forgot-password", {
        ...data,
        recaptchaToken,
      });

      setData({
        email: "",
      });
      setRecaptchaToken("");
      toast.success("Verify the account and Reset the password!", {
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
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
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
      } else {
        toast.error(error.message, {
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
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="mt-4">
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
          <p className="mt-2 font-semibold underline underline-offset-3 ">
            <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
