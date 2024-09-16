import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalError, setModalError] = useState(null);
  const [showPassword, setShowPassword] = useState();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(result.data.result);
      } catch (error) {
        setError("Failed to fetch profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [token]);

  const handleUpdatePassword = () => {
    setIsModalOpen(true);
  };

  const handleSubmitPasswordUpdate = async () => {
    try {
      await axios.patch(
        "http://localhost:8080/users/update-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOldPassword("");
      setNewPassword("");
      setIsModalOpen(false);
    } catch (error) {
      setModalError("Failed to update password. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setOldPassword("");
    setNewPassword("");
    setModalError(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <span className="text-lg font-medium text-gray-600">UserName:</span>
          <b className="text-xl text-gray-900">{profile.userName}</b>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <span className="text-lg font-medium text-gray-600">Email:</span>
          <b className="text-xl text-gray-900">{profile.email}</b>
        </div>
        <button
          onClick={handleUpdatePassword}
          className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
        >
          Update Password
        </button>
      </div>

      {/* Update Password Modal */}
      {isModalOpen && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-center ">
                    <h3
                      className="text-3xl font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Update Password
                    </h3>
                  </div>
                </div>
                <div className="bg-white px-4 py-5 sm:p-6">
                  {modalError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                      {modalError}
                    </div>
                  )}
                  <form id="update-password-form">
                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="block text-left text-gray-700"
                      >
                        Old Password
                      </label>
                      <div className="flex">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
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
                      <label
                        htmlFor="password"
                        className="block text-left text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="flex">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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
                  </form>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleSubmitPasswordUpdate}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
