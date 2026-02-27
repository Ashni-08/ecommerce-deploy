import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderPage.css";

function OrderPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [quantity, setQuantity] = useState(1); // Add quantity input
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) {
      alert("No product selected!");
      return;
    }

    const userId = 1; // Replace with logged-in user id if available

    const orderRequest = {
      userId: userId,
      productId: product.id,
      quantity: quantity,
      productName: product.title,
      productImage: product.image 
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders/buyNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRequest)
      });

      if (!response.ok) throw new Error("Failed to place order");

      const savedOrder = await response.json();
      console.log("Order saved:", savedOrder);

      alert("Order Placed Successfully!");
      navigate("/your-orders");

    } catch (err) {
      console.error(err);
      alert("Error placing order. Check console.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="order-container">
        <h2>Order Details</h2>

        {product && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img src={product.image} alt={product.title} style={{ width: "150px" }} />
            <h4>{product.title}</h4>
            <p>Price: ₹{product.price}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea placeholder="Enter your address" required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="number" placeholder="Enter phone number" required />
          </div>

          <div className="payment-section">
            <h3>Payment Method</h3>
            {["Cash on Delivery", "UPI", "Card"].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                />
                {method}
              </label>
            ))}
          </div>

          <button className="place-order-btn" type="submit">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderPage;