import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const token = query.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userVerify = async () => {
      try {
        let result = await axios.patch(
          "http://localhost:8080/users/verify-user",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(result);
        navigate("/login");
      } catch (error) {
        console.error("Verification failed: ", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      userVerify();
    } else {
      console.error("No token found in URL.");
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div>
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <p>{token ? "Verification process complete" : "No token provided"}</p>
      )}
    </div>
  );
};

export default VerifyUser;
