import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useGetCity from "../../hooks/useGetCity";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { userData, city } = useSelector((state) => state.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // ✅ added for responsive check

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Detect user location
  useGetCity();

  // ✅ Detect resize to toggle mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Hide dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Hide search bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showMobileSearch) {
        setShowMobileSearch(false);
        setSearch("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showMobileSearch]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <GiForkKnifeSpoon className="text-orange-500 text-3xl" />
          <span className="text-2xl font-bold text-orange-500">FoodCort</span>
        </div>

        {/* Desktop Search */}
        <div className="hidden sm:flex items-center bg-gray-50 gap-2 px-10 py-2 rounded-xl hover:ring-2 hover:ring-orange-400 transition">
          <IoLocationSharp className="text-orange-500 text-lg mr-0.5" />
          <span className="font-medium text-gray-700">
            {city || "Detecting..."}
          </span>
          <span className="mx-3 text-gray-400">|</span>
          <div className="flex items-center">
            <AiOutlineSearch className="text-gray-500 mr-1" />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-48 sm:w-56"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Icon */}
          <AiOutlineSearch
            className="text-2xl text-orange-500 sm:hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileSearch((prev) => !prev);
            }}
          />

          {/* ✅ Cart Icon (only visible in Desktop view) */}
          {!isMobile && (
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <AiOutlineShoppingCart className="text-2xl text-orange-500" />
            </div>
          )}

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer font-bold text-lg"
            >
              {userData?.fullName?.slice(0, 1).toUpperCase() || "U"}
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl p-3 z-[9999]">
                <p className="text-gray-800 font-medium px-2 py-1 border-b truncate">
                  {userData?.fullName || "User"}
                </p>
                <p className="text-gray-500 px-2 py-1 truncate">
                  {userData?.email || "email@example.com"}
                </p>

                {/* Desktop Options */}
                <div className="hidden sm:block border-t mt-2 pt-2">
                  {/* <div
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 px-2 py-1 mt-1 cursor-pointer hover:bg-orange-50 rounded-lg"
                  >
                    <AiOutlineShoppingCart className="text-orange-500 text-lg" />
                    <span className="text-gray-700 text-sm">My Cart</span>
                  </div> */}

                  <button
                    onClick={() => console.log("Signout Clicked")}
                    className="w-full bg-orange-500 text-white text-sm font-semibold py-1.5 rounded-lg mt-2 hover:bg-orange-600"
                  >
                    Sign Out
                  </button>
                </div>

                {/* ✅ Mobile Options */}
                <div className="block sm:hidden border-t mt-2 pt-2">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <IoLocationSharp className="text-orange-500" />
                    <span className="text-gray-700 text-sm">
                      {city || "Detecting..."}
                    </span>
                  </div>

                  {/* ✅ Cart shown only in Mobile popup */}
                  {isMobile && (
                    <div
                      onClick={() => navigate("/cart")}
                      className="flex items-center gap-2 px-2 py-1 mt-1 cursor-pointer hover:bg-orange-50 rounded-lg"
                    >
                      <AiOutlineShoppingCart className="text-orange-500 text-lg" />
                      <span className="text-gray-700 text-sm">My Cart</span>
                    </div>
                  )}

                  <button
                    onClick={() => console.log("Signout Clicked")}
                    className="w-full bg-orange-500 text-white text-sm font-semibold py-1.5 rounded-lg mt-2 hover:bg-orange-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Search just below navbar */}
      {showMobileSearch && (
        <div
          ref={searchRef}
          className="bg-white shadow-md border-t border-gray-200 p-3 sticky top-[60px] z-40 sm:hidden"
        >
          <div className="flex items-center gap-2">
            <AiOutlineSearch className="text-orange-500 text-xl" />
            <input
              type="text"
              placeholder="Search your favorite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
