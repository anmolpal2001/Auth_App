import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useNavigate } from 'react-router-dom'
import { resetPasswordFailure,resetPasswordStart,resetPasswordSuccess } from '../redux/auth/authSlice'
import { useDispatch,useSelector } from 'react-redux'

const ResetPassword = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading,error,currentData} = useSelector(state => state.auth);
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.id] : e.target.value}));
    }
    console.log("Current Data : ",currentData);
    console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            dispatch(resetPasswordStart());
            const response = await fetch(`/api/v1/auth/resetPassword/${currentData.user_id}/${currentData.resetPassToken}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok)
            {
                console.log(data);
                dispatch(resetPasswordSuccess(data));
                navigate("/sign-in");
            }
            else
            {
                dispatch(resetPasswordFailure(data));
                console.log(data);
            }
        }
        catch(err)
        {
            dispatch(resetPasswordFailure(err));
            console.log(err);
        }
    }
  return (
    <Layout>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            className="bg-slate-100 p-3 rounded-lg"
            id="password"
            type="password"
            placeholder="Password"
          />
          <input
            onChange={handleChange}
            className="bg-slate-100 p-3 rounded-lg"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Submit'}</button>
        </form>
        <p className="text-red-700 text-center mt-5">
          {error && "Somthing went wrong !!"}
        </p>
      </div>
    </Layout>
  )
}

export default ResetPassword