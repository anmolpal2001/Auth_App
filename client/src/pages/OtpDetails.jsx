import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { verifyOtpFailure, verifyOtpStart, verifyOtpSuccess } from '../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import getInfo from '../getInfo.js'

const OtpDetails = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const {loading,error,currentData} = useSelector(state => state.auth);
    console.log("Current Data : ",currentData);
    const id = getInfo('otp_token');
            console.log(id);
            const token = getInfo('otp_token');
            console.log(token);
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.id] : e.target.value}));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            dispatch(verifyOtpStart());

            
            const response = await fetch(`/api/v1/auth/verifyOtp/${currentData.user_id}/${currentData.token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log(response.cookies);
            const data = await response.json();
            if(response.ok)
            {
                console.log(data);
                dispatch(verifyOtpSuccess(data));
                navigate(`/reset-password/${data.user_id}/${data.resetPassToken}`);
            }
            else
            {
                dispatch(verifyOtpFailure(data));
                console.log(data);
            }
        }
        catch(err)
        {
            dispatch(verifyOtpFailure(err));
            console.log(err);
        }
    }

    
  return (
    <Layout>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">
          Enter your OTP
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            className="bg-slate-100 p-3 rounded-lg"
            id="otp"
            type="number"
            placeholder="OTP"
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Reset Password'}</button>
        </form>
        <p className="text-red-700 text-center mt-5">
          {error && "Somthing went wrong !!"}
        </p>
      </div>
    </Layout>
  )
}

export default OtpDetails