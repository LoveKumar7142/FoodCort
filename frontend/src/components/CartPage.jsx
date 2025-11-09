import React from "react";
import { useSelector, useDispatch } from "react-redux";

const CartPage = () => {
  const { cart = [] } = useSelector((state) => state.user); // default empty array
  const dispatch = useDispatch();

  const handleQtyChange = (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (item.qty + delta <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
    } else {
      dispatch({ type: "CHANGE_QTY", payload: { id, delta } });
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <h1 className="text-3xl font-bold text-orange-500 mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-700">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">
                  ${item.price} x {item.qty} = ${item.price * item.qty}
                </p>
                {item.offer && <p className="text-green-500 text-sm">{item.offer}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQtyChange(item.id, -1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.id, 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl">Total: ${totalPrice}</div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
