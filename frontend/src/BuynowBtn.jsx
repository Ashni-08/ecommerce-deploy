import React from "react";
import { useNavigate } from "react-router-dom";

function BuynowBtn({ product }) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate("/order", {
      state: { product } // Send product data to OrderPage
    });
  };

  return (
    <div className="button" onClick={handleBuyNow}>
      <div className="button-wrapper">
        <div className="text">Buy Now</div>
        <span className="icon">
          <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16">
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

export default BuynowBtn;