// CartPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AvailableBook from "../types/AvailableBook";

interface CartPageProps {
  cart: AvailableBook[];
  removeFromCart: (id: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart }) => {
  // API service
  const api = {
    baseUrl: "/be",

    // Checkout
    async checkout(cart: AvailableBook[]): Promise<void> {
      try {
        const requestBody = cart.map((book) => Number(book.PB_Id));
        console.log(requestBody);
        const response = await fetch(`${this.baseUrl}/checkout.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 200) {
          cart.forEach((book) => removeFromCart(book.PB_Id));
          alert("Checkout successful");
          navigate("/backOffice");
        } else if (response.status === 401) {
          alert(
            "La sessione è scaduta, effettua nuovamente il login. Le tue modifiche NON sono state salvate."
          );
          navigate("/login");
        } else {
          console.log("Checkout failed");
        }
      } catch (error) {
        console.log("Checkout failed, error:" + error);
      }
    },
  };

  // Navigation and state
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  // Effects
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/sell");
    }
  }, [cart.length]);

  // Functions
  const total = cart.reduce((sum, book) => sum + Number(book.Price_new), 0);

  const handleCheckout = () => {
    setShowConfirm(true);
  };

  const confirmCheckout = () => {
    api.checkout(cart);
    setShowConfirm(false);
  };

  const cancelCheckout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bookstore-container">
      <div className="cart-header">
        <Link to="/sell" className="back-button">
          ← Torna ai libri
        </Link>
        <h1 className="cart-title">Carrello ({cart.length} libri)</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Il tuo carrello è vuoto</p>
          <Link to="/sell" className="cart-button cart-button-add">
            Seleziona libri
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((book) => (
              <div key={book.ISBN} className="cart-item">
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{book.Title}</h3>
                  <p className="cart-item-author">
                    di {book.Author}, venduto da {book.ProviderName}{" "}
                    {book.ProviderSurname}
                  </p>
                  <p className="cart-item-price">
                    €{Number(book.Price_new).toFixed(2)}
                  </p>
                  <button
                    className="cart-button cart-button-remove"
                    onClick={() => removeFromCart(book.PB_Id)}
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Sommario</h2>
            <div className="cart-total">
              <span style={{ color: "#888" }}>Totale (nuovi): €{total}</span>
              <span>Totale (prezzo usato):</span>
              <span style={{ fontSize: "2rem" }}>
                €{(total / 2).toFixed(2)}
              </span>
            </div>
            <button
              className="cart-button cart-button-add checkout-button"
              onClick={handleCheckout}
            >
              Checkout
            </button>
            {showConfirm && (
              <div className="mt-4 p-4 border rounded-lg bg-white">
                <p className="text-center mb-4">
                  Sei sicuro di voler procedere con il checkout? Questa azione è
                  irreversibile.
                </p>
                <div className="confirm-buttons">
                  <button
                    onClick={confirmCheckout}
                    className="cart-button cart-button-add confirm-button"
                  >
                    Conferma
                  </button>
                  <button
                    onClick={cancelCheckout}
                    className="cart-button cart-button-remove confirm-button"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
