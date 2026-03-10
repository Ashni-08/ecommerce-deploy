import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./YourOrders.css";
import axios from "axios";
import Navbar from "./Navbar";

function YourOrdersPage() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 1;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("Please login to view your orders.");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = () => {
    fetch(`https://ecommerce-deploy-production.up.railway.app/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Please state the reason for cancellation:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Reason is required to cancel the order.");
      return;
    }

    try {
      await axios.put(
        `https://ecommerce-deploy-production.up.railway.app/api/orders/cancel/${orderId}`,
        reason,
        {
          headers: { "Content-Type": "text/plain" }
        }
      );

      alert("Order cancelled successfully!");
      fetchOrders();

    } catch (err) {
      console.error("Error cancelling order", err);
      alert("Failed to cancel order.");
    }
  };

  return (
    <div className="orders-page">
      <Navbar />

      <div className="orders-container">
        <h2>Your Orders</h2>
        <p className="order-count">Total Orders: {orders.length}</p>

        {orders.length === 0 ? (
          <p className="no-orders">No orders yet.</p>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div
                key={order.id}
                className={`order-card ${
                  order.status === "CANCELLED" ? "cancelled" : ""
                }`}
              >
                <div className="order-image-container">
                  <img
                    src={
                      order.productImage?.startsWith("http")
                        ? order.productImage
                        : `https://ecommerce-deploy-production.up.railway.app/${order.productImage}`
                    }
                    alt={order.productName}
                    className="order-image"
                  />
                </div>

                <div className="order-details">
                  <h4>{order.productName}</h4>

                  <div className="order-meta">
                    <p>
                      <span>Quantity:</span> {order.quantity}
                    </p>

                    <p>
                      <span>Total Price:</span> ₹{order.totalPrice}
                    </p>

                    <p
                      className={`status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </p>
                  </div>

                  {order.status === "CANCELLED" && (
                    <div className="cancellation-info">
                      <p className="reason-label">Cancellation Reason:</p>
                      <p className="reason-text">
                        {order.cancellationReason}
                      </p>
                    </div>
                  )}

                  {order.status !== "CANCELLED" && (
                    <button
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default YourOrdersPage;