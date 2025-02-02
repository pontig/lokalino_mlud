// InsertBooks.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Book from "../types/Book";
import BookEntryComponent from "../components/BookEntry";
import BookEntry from "../types/BookEntry";

const InsertBooks: React.FC = () => {
  // API service
  const api = {
    baseUrl: "/be",

    async submitForm(book: Book): Promise<void> {
      try {
        const requestBody = { book };

        const response = await fetch(`${this.baseUrl}/enterBook.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 200) {
          setBooks({
            ISBN: "",
            Title: "",
            Author: "",
            Editor: "",
            Price_new: 0.0,
            Dec_conditions: "New",
          });
          alert("Book submitted successfully!");
        } else if (response.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    async checkSession(): Promise<void> {
      try {
        const response = await fetch(`${this.baseUrl}/utils/session.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    },
  };

  // Navigation and state
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookEntry>({
    ISBN: "",
    Title: "",
    Author: "",
    Editor: "",
    Price_new: 0.0,
    Dec_conditions: "New",
  });
  const [isSearchingISBN, setIsSearchingISBN] = useState<boolean>(false);
  const [isSearchingTitle, setIsSearchingTitle] = useState<boolean>(false);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [titleResults, setTitleResults] = useState<Book[]>([]);

  // Effects
  useEffect(() => {
    api.checkSession();
  }, []);

  // Functions
  const handleBookSelect = (result: BookEntry, index = 0): void => {
    const newBooks = {
      ISBN: result.ISBN,
      Title: result.Title,
      Author: result.Author,
      Editor: result.Editor,
      Price_new: result.Price_new,
      Dec_conditions: "",
    };
    setBooks(newBooks);
    // setIsbnResults([]);
    // setActiveISBNIndex(null);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log({ books });
    api.submitForm(books);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Link to="/backOffice" className="back-button">
          ← Torna alla Dashboard
        </Link>
        <h1 className="form-title">Inserisci libro nel sistema</h1>
      </div>
      <form onSubmit={handleSubmit} className="submission-form">
        <div className="books-section">
          <BookEntryComponent
            book={books}
            index={0}
            showComment={false}
            disabledFields={false}
            onBookChange={(book: BookEntry) => handleBookSelect(book, 0)}
            isSearchingISBN={isSearchingISBN}
            isSearchingTitle={isSearchingTitle}
            showConditions={false}
          />
        </div>

        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Fatto
        </button>
      </form>
    </div>
  );
};

export default InsertBooks;
