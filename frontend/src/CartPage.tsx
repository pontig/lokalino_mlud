// CartPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  coverImage?: string;
}

interface CartPageProps {
  cart: Book[];
  removeFromCart: (id: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, book) => sum + book.price, 0);

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
                <img src={book.coverImage} alt={book.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{book.title}</h3>
                  <p className="cart-item-author">by {book.author}</p>
                  <p className="cart-item-price">${book.price.toFixed(2)}</p>
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
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="cart-button cart-button-add checkout-button">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;