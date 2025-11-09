import React, { useState } from "react";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  // Single state object
  const [data, setData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const { email, otp, newPassword, confirmPassword } = data;

  // Error state
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErr(""); // Clear error on input change
  };

  const handleSendOtp = async () => {
    if (!email) {
      return setErr("Email is required!");
    }
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      setErr(""); // clear error if success
      setStep(2);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error);
      setErr("Failed to send OTP. Try again!");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      return setErr("OTP is required!");
    }
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
      setErr("");
      setStep(3);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error);
      setErr("Invalid OTP. Please check and try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return setErr("Both password fields are required!");
    }
    if (newPassword !== confirmPassword) {
      return setErr("Passwords do not match!");
    }
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
      setErr("");
      setData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
      setStep(1);
      navigate("/signin");
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error);
      setErr("Failed to reset password. Try again!");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-3">
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-9 w-[92%] sm:w-[440px]">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center">
            <GiForkKnifeSpoon className="text-orange-500 text-4xl mr-2" />
            <span className="text-orange-500">Food</span>
            <span className="text-gray-800">Cort</span>
          </h1>
          <h2 className="text-lg text-gray-600 mt-4">
            {step === 1 && "Enter your email to receive OTP"}
            {step === 2 && "Enter OTP sent to your email"}
            {step === 3 && "Set your new password"}
          </h2>
        </div>

        {/* Error message */}
        {err && <p className="text-red-500 text-sm mb-3 text-center">{err}</p>}

        {/* Form Steps */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
              disabled = {loading}
            >
              {loading?<ClipLoader size = {20} /> : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
              disabled = {loading}
            >
              {loading?<ClipLoader size = {20} /> : "Verify OTP"}
              
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
              disabled = {loading}
            >
              {loading?<ClipLoader size = {20} /> : "Reset Password"}
              
            </button>
          </div>
        )}

        {/* Back to Sign In */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Remember your password?{" "}
          <NavLink
            to="/signin"
            className="text-orange-500 font-medium hover:underline"
            disabled = {loading}
          >
            {loading?<ClipLoader size = {20} /> : "Sign In"}
            
          </NavLink>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
