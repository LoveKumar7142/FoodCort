import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const sampleItems = [
      {
        id: 1,
        name: "Pizza Margherita",
        price: 8,
        offer: "10% off",
        image: "https://source.unsplash.com/400x300/?pizza",
      },
      {
        id: 2,
        name: "Burger Deluxe",
        price: 5,
        offer: "Buy 1 Get 1",
        image: "https://source.unsplash.com/400x300/?burger",
      },
      {
        id: 3,
        name: "Pasta Alfredo",
        price: 7,
        offer: "20% off",
        image: "https://source.unsplash.com/400x300/?pasta",
      },
      {
        id: 4,
        name: "Sushi Platter",
        price: 12,
        offer: "Special Combo",
        image: "https://source.unsplash.com/400x300/?sushi",
      },
    ];
    setItems(sampleItems);
  }, []);

  const handleAddToCart = (item) => {
    const exist = cart.find((i) => i.id === item.id);
    if (exist) {
      setCart(
        cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const handleQtyChange = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((i) => {
          if (i.id === id) {
            const newQty = i.qty + delta;
            if (newQty <= 0) return null;
            return { ...i, qty: newQty };
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <GiForkKnifeSpoon className="text-orange-500 text-3xl" />
          <span className="text-2xl font-bold text-orange-500">FoodCort</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl py-1 px-3 outline-none focus:ring-2 focus:ring-orange-400 w-48 sm:w-60"
            />
            <AiOutlineSearch className="absolute right-2 top-1.5 text-gray-400" />
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => cart.length > 0 && navigate("/cart")}
          >
            <AiOutlineShoppingCart className="text-2xl text-orange-500" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer font-bold text-lg"
            >
              {userData?.fullName?.slice(0, 1).toUpperCase()}
            </div>

            <div
              className={`absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl p-2 z-50 transform transition-all duration-300 ease-out ${
                showProfileMenu
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2 pointer-events-none"
              }`}
            >
              <p className="text-gray-800 font-medium px-2 py-1 border-b truncate">
                {userData?.fullName}
              </p>
              <p className="text-gray-500 px-2 py-1 truncate">
                {userData?.email}
              </p>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-2 py-2 hover:bg-orange-100 rounded-xl"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome */}
      <div className="text-center my-6 px-4 sm:px-0">
        <h2 className="text-3xl font-bold text-orange-500">
          Hello, {userData?.fullName}!
        </h2>
        <p className="text-gray-700 mt-2">
          Browse items and add them to your cart
        </p>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 truncate">
                {item.name}
              </h3>
              <p className="text-orange-500 font-bold mt-1">${item.price}</p>
              {item.offer && (
                <p className="text-green-500 text-sm">{item.offer}</p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleQtyChange(item.id, -1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{cart.find((i) => i.id === item.id)?.qty || 0}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(item)}
                className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t p-4 border-t border-gray-200 flex justify-between items-center sm:hidden">
          <span className="font-bold text-gray-800">Total: ${totalPrice}</span>
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded-xl transition"
          >
            {showCart ? "Hide Cart" : "View Cart"}
          </button>
        </div>
      )}

      {/* Cart popup */}
      {cart.length > 0 && showCart && (
        <div className="fixed bottom-16 right-4 w-80 sm:w-96 bg-white shadow-xl rounded-xl p-4 z-50 max-h-96 overflow-y-auto">
          {cart.map((i) => (
            <div
              key={i.id}
              className="flex justify-between items-center py-2 border-b border-gray-200"
            >
              <div>
                <p className="font-medium truncate">{i.name}</p>
                <p className="text-gray-500">
                  ${i.price} x {i.qty} = ${i.price * i.qty}
                </p>
                {i.offer && <p className="text-green-500 text-sm">{i.offer}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQtyChange(i.id, -1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{i.qty}</span>
                <button
                  onClick={() => handleQtyChange(i.id, 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
