import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { signInStart,signInFailure,signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading,error} = useSelector(state => state.user)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          email: "",
          password: "",
        });
        toast.success(data.message);
        dispatch(signInSuccess(data));
        console.log(data);
        navigate("/");
        return;
      } else {
        dispatch(signInFailure(data));
        toast.error(data.message);
      }
      console.log(data.message);
      console.log(data);
    } catch (err) {
      dispatch(signInFailure(err));
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <span className="text-blue-500 self-end -my-2"><Link to="/forgot-password">Forgot Password </Link></span>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth/>
        </form>
        <p className="text-red-700 text-center mt-5">
          {error && "Somthing went wrong !!"}
        </p>
        <div className="mt-5">
          <p className="text-center">
            Dont have an account ?
            <Link to="/sign-up">
              <span className="text-blue-500"> Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
