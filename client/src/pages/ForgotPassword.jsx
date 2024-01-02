import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  getOtpStart,
  getOtpSuccess,
  getOtpFailure,
} from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import getInfo from "../getInfo.js";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, permission } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(getOtpStart());
      const response = await fetch(`${BASE_URL}/api/v1/auth/getOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        dispatch(getOtpSuccess(data));
        console.log("data id", data.user_id);
        console.log("data token", data.token);
        navigate(`/otp-verification/${data.user_id}/${data.token}`);
      } else {
        dispatch(getOtpFailure(data));
        console.log(data);
      }
    } catch (err) {
      dispatch(getOtpFailure(err));
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            className="bg-slate-100 p-3 rounded-lg"
            id="email"
            type="email"
            placeholder="Email"
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "Generate Otp"}
          </button>
        </form>
        <p className="text-red-700 text-center mt-5">
          {error && "Somthing went wrong !!"}
        </p>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
