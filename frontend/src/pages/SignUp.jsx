import React, { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";
import { GiForkKnifeSpoon } from "react-icons/gi";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    role: "user",
    password: "",
  });

  const { fullName, email, mobile, role, password } = data;
  const roles = ["user", "owner", "deliveryboy"];

  const [loading,setLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!fullName || !email || !mobile || !password) {
      setErr("All fields are required!");
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      // console.log("Signup response:", result.data);
      dispatch(setUserData(result.data))
      setErr("");
      setLoading(false);
      alert("Signup successful!");
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      console.error("Signup Error:", error);
      let message = "Signup failed, please try again!";
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

  // Handle Google Signup
  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setErr("Mobile number is required");
    }
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      // console.log("Google Signup response:", response.data);
      dispatch(setUserData(response.data))
      setErr("");
      alert("Google signup successful!");
      setLoading(false)
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      console.error("Google Auth Error:", error);
      let message = "Google authentication failed, please try again!";
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
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-9 w-[92%] sm:w-[500px]">
        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <GiForkKnifeSpoon className="text-orange-500 text-4xl mr-2" />
            Welcome to <span className="text-orange-500 ml-2">Food</span>
            <span className="text-gray-800">Cort</span>
          </h1>
          <h2 className="text-lg text-gray-600 mt-1">Create your account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {[{ name: "fullName", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "mobile", type: "tel", placeholder: "Mobile Number" }].map(({ name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">{placeholder}</label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={data[name]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                required
              />
            </div>
          ))}

          {/* Role */}
          <div>
            <p className="font-medium text-gray-700 mb-1">Select Role</p>
            <div className="flex justify-around">
              {roles.map((r) => (
                <label key={r} className={`flex items-center gap-2 cursor-pointer ${data.role === r ? "text-orange-500 font-semibold" : "text-gray-700"}`}>
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={handleChange}
                    className="accent-orange-500 scale-110"
                  />
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[66%] translate-y-[-45%] text-gray-500 text-xl">
              {showPass ? <BiSolidShow /> : <BiSolidHide />}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg" disabled={loading}> 
            {loading?<ClipLoader size = {20} /> : "Sign Up"}
          </button>
        </form>

        {/* Error */}
        {err && <div className="error text-orange-500 font-semibold text-center pt-3">{err.toString()}</div>}

        {/* Divider */}
        <div className="flex items-center gap-3 mt-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Sign Up */}
        <div className="flex justify-center mt-3">
          <button type="button" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300" onClick={handleGoogleAuth}>
            <FcGoogle className="text-3xl cursor-pointer" />
            <span className="text-gray-700 font-medium">Sign Up with Google</span>
          </button>
        </div>

        {/* Login link */}
        <p className="text-center text-gray-600 text-sm mt-2">
          Already have an account? <NavLink to="/signin" className="text-orange-500 font-medium hover:underline" disabled = {loading}>
          {loading?<ClipLoader size = {20} /> : "Sign In"}
          </NavLink>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
