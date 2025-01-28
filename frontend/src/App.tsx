import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import CartPage from "./pages/CartPage";
import BookList from "./pages/BookList";
import BookSubmissionForm from "./pages/BookSubmissionForm";
import AvailableBook from "./types/AvailableBook";
import ThankYouPage from "./pages/ThankYou";
import BackOffice from "./pages/BackOffice";
import InsertBooks from "./pages/InsertBooks";
import PickUp from "./pages/PickUp";
import Liquidate from "./pages/Liquidate";

const App = () => {
  const [cart, setCart] = useState<AvailableBook[]>([]);

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((book) => book.PB_Id !== bookId));
  };

  const addToCart = (book: AvailableBook) => {
    setCart((prev) => [...prev, book]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BackOffice />} />
        <Route
          path="/sell"
          element={
            <BookList
              cart={cart}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/insertBooks" element={<InsertBooks />} />
        <Route path="/bookSubmission" element={<BookSubmissionForm />} />
        <Route
          path="/cart"
          element={<CartPage cart={cart} removeFromCart={removeFromCart} />}
        />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/pickUp" element={<PickUp />} />
        <Route path="/liquidate" element={<Liquidate />} />
      </Routes>
    </Router>
  );
};

export default App;
