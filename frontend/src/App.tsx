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
import MailingList from "./pages/mailingList";
import Login from "./pages/Login";
import Schedule from "./pages/Schedule";
import InsertBooksBatch from "./pages/InsertBooksBatch";
import BackupDatabase from "./pages/backupDatabase";
import PeriodEmails from "./pages/PeriodEmails";

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
        <Route path="/login" element={<Login />} />
        <Route path="/backOffice" element={<BackOffice />} />
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
        <Route path="/" element={<BookSubmissionForm />} />
        <Route
          path="/cart"
          element={<CartPage cart={cart} removeFromCart={removeFromCart} />}
        />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/pickUp" element={<PickUp />} />
        <Route path="/liquidate" element={<Liquidate />} />
        <Route path="/mailinglist" element={<MailingList />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/admin" element={<InsertBooksBatch />} />
        <Route path="/backupDatabase" element={<BackupDatabase />} />
        <Route path="/periodemail" element={<PeriodEmails />} />
      </Routes>
    </Router>
  );
};

export default App;
