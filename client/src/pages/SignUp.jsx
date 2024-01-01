import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("https://auth-app-server-tuhe.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        toast.success(data.message);
        console.log(data);
        navigate("/sign-in");
        return;
      } else {
        setError(true);
        toast.error(data.message);
      }
      console.log(data.message);
      console.log(data);
    } catch (err) {
      setLoading(false);
      setError(true);
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="bg-slate-100 p-3 rounded-lg"
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            className="bg-slate-100 p-3 rounded-lg"
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="bg-slate-100 p-3 rounded-lg"
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <p className="text-red-700 text-center mt-5">
          {error && "Somthing went wrong !!"}
        </p>
        <div className="mt-5">
          <p className="text-center">
            Have an account ?
            <Link to="/sign-in">
              <span className="text-blue-500"> Sign In</span>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
