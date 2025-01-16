// CartPage.tsx
import React, { useEffect } from "react";
import { Link, HashRouter as Router } from "react-router-dom";
import Book from "../types/Book";

import "../styles/Cart.css";

interface CartPageProps {
  cart: Book[];
  removeFromCart: (id: string) => void;
}

const api = {
  baseUrl: "https://www.pontiggiaelia.altervista.org/be",

  // Checkout
  async checkout(cart: Book[]): Promise<void> {
    try {
      const requestBody = cart.map((book) => book.id);

      const response = await fetch(`${this.baseUrl}/checkout.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        alert("Checkout successful");
      } else {
        alert("Checkout failed");
      }
    } catch (error) {
      alert("Checkout failed, error:" + error);
    }
  },
};

const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, book) => sum + book.price, 0);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "Are you sure you want to leave? Your cart will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      window.location.href = "/";
    }
  }, [cart.length]);

  const checkout = () => {
    api.checkout(cart);
  };

  return (
    <div className="bookstore-container">
      <div className="cart-header">
        <Link to="/" className="back-button">
          ← Back to Books
        </Link>
        <h1 className="cart-title">Your Cart ({cart.length} items)</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="cart-button cart-button-add">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((book) => (
              <div key={book.id} className="cart-item">
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{book.title}</h3>
                  <p className="cart-item-author">by {book.author}</p>
                  <p className="cart-item-price">
                    ${Number(book.price).toFixed(2)}
                  </p>
                  <button
                    className="cart-button cart-button-remove"
                    onClick={() => removeFromCart(book.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-total">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <button
              className="cart-button cart-button-add checkout-button"
              onClick={checkout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
