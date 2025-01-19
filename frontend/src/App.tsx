import React, { useState, useEffect } from "react";
import { HashRouter as Router, Link, Route, Routes } from "react-router-dom";

import "./styles/BookStore.css";
import CartPage from "./pages/CartPage";
import BookList from "./pages/BookList";
import Book from "./types/Book";
import BookSubmissionForm from "./pages/BookSubmissionForm";

const App = () => {
  const [cart, setCart] = useState<Book[]>([]);

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((book) => book.ISBN !== bookId));
  };

  const addToCart = (book: Book) => {
    setCart((prev) => [...prev, book]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/sell"
          element={<BookList cart={cart} removeFromCart={removeFromCart} addToCart={addToCart} />}
        />
        <Route
          path="/"
          element={<BookSubmissionForm />}
        />
        <Route
          path="/cart"
          element={<CartPage cart={cart} removeFromCart={removeFromCart} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
