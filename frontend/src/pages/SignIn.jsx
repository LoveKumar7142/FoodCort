import React, { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router-dom";
import { GiForkKnifeSpoon } from "react-icons/gi";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const { email, password } = data;

  const dispatch = useDispatch();

  const [loading,setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // Handle SignIn with email/password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      // Ensure email and password are not empty
      if (!email || !password) {
        setErr("Please fill in all fields.");
        return;
      }

      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      setErr(""); // clear errors
      // console.log("SignIn response:", result.data);
      dispatch(setUserData(result.data))
      setLoading(false)
      alert("Signin successful!");
    } catch (error) {
      setLoading(false)

      console.error("Signin error:", error);

      // Safely extract error message
      let message = "Signin failed, please try again!";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "object" && error.response.data.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
      }
      setErr(message);
    }
  };

  // Handle Google SignIn
  const handleGoogleAuth = async () => {
      setLoading(true)

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Send user data to backend
      const response = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
        },
        { withCredentials: true }
      );

      setErr(""); // clear errors
      // console.log("Google SignIn server response:", response.data);
      dispatch(setUserData(response.data))
      setLoading(false)

      alert("SignIn successful!");

    } catch (error) {
      setLoading(false)

      console.error("Google SignIn error:", error);

      // Safely extract error message
      let message = "Google SignIn failed, please try again!";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "object" && error.response.data.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
      }
      setErr(message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-3">
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-9 w-[92%] sm:w-[440px]">
        {/* Heading with Logo */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center">
            <GiForkKnifeSpoon className="text-orange-500 text-5xl mr-2" />
            <span className="text-orange-500">Food</span>
            <span className="text-gray-800">Cort</span>
          </h1>
          <h2 className="text-lg text-gray-600 mt-4">Hungry? Let’s Sign In!</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-[66%] translate-y-[-45%] text-gray-500 text-xl"
            >
              {showPass ? <BiSolidShow /> : <BiSolidHide />}
            </button>
          </div>

          {/* Forgot Password link */}
          <div className="forgot-pass text-right text-orange-500 hover:underline whitespace-nowrap">
            <NavLink to="/forgot-password">Forgot Password?</NavLink>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
            disabled = {loading}
          >

            {loading?<ClipLoader size = {20} /> : "Sign In"}
          </button>
        </form>

        {/* Error message */}
        {err && (
          <div className="error text-orange-500 font-semibold text-center pt-3">
            {err.toString()}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 mt-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Sign In */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300"
            onClick={handleGoogleAuth}
          >
            <FcGoogle className="text-3xl cursor-pointer" />
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        </div>

        {/* Signup link */}
        <p className="text-center text-gray-600 text-sm mt-3">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-orange-500 font-medium hover:underline"
            disabled = {loading}
          >
            {loading?<ClipLoader size = {20} /> : "Sign Up"}

            
          </NavLink>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
