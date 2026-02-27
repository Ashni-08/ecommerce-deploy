import React, { useEffect, useState } from "react";
import "./YourOrders.css"
function YourOrdersPage() {
    console.log("YourOrdersPage loaded");
    
  const [orders, setOrders] = useState([]);
  const userId = 1; // Replace with actual logged-in user

  useEffect(() => {
    fetch(`http://localhost:8080/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  return (
  <div className="orders-page">
    <div className="orders-container">

      <h2>Your Orders</h2>
 
      <p>Total Orders: {orders.length}</p>

 {orders.length === 0 ? (
  <p className="no-orders">No orders yet.</p>
) : (
  orders.map(order => {
    
    // 👇 ADD THIS LINE
    console.log("Image value:", order.productImage);

    return (
      <div key={order.id} className="order-card">

       <img
  src={
    order.productImage?.startsWith("http")
      ? order.productImage
      : `http://localhost:8080/${order.productImage}`
  }
  alt={order.productName}
  className="order-image"
/>

        <div>
          <h4>{order.productName}</h4>
          <p>Quantity: {order.quantity}</p>
          <p>Total: ₹{order.totalPrice}</p>
          <p>Status: {order.status}</p>
        </div>

      </div>
    );
  })
)}

    </div>
  </div>
  );
}

export default YourOrdersPage;