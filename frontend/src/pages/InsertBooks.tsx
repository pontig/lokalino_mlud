// InsertBooks.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import Book from "../types/Book";

interface ISBNLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  results: Book[];
  onSelect: (result: Book) => void;
  isSearching: boolean;
}

const ISBNLookupField: React.FC<ISBNLookupFieldProps> = ({
  value,
  onChange,
  results,
  onSelect,
  isSearching,
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (/^\d*$/.test(newValue)) {
            onChange(newValue);
          }
        }}
        className="w-full p-2 border rounded"
        placeholder="no spaces or dashes"
        required
      />

      {isSearching && (
        <div className="absolute w-full mt-1 text-sm text-gray-500">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="isbn-results">
            {results.map((result) => (
              <button
                key={result.ISBN}
                onClick={() => onSelect(result)}
                className="isbn-result-item"
              >
                <div className="font-medium">{result.Title}</div>
                <div className="text-sm text-gray-600">
                  by {result.Author} • {result.Editor}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InsertBooks: React.FC = () => {
  const [books, setBooks] = useState<Book>({
    ISBN: "",
    Title: "",
    Author: "",
    Editor: "",
    Price_new: 0.0,
  });
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);

  const api = {
    baseUrl: "https://pontiggiaelia.altervista.org/be",

    // Search for a book by ISBN
    async searchISBN(isbn: string): Promise<void> {
      if (isbn.length < 2) {
        setIsbnResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(
          `${this.baseUrl}/getExistingBooks.php?ISBN=${isbn}`
        );
        const data: Book[] = await response.json();
        setIsbnResults(data);
      } catch (error) {
        console.error("Error searching ISBN:", error);
        setIsbnResults([]);
      } finally {
        setIsSearching(false);
      }
    },

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
          });
          alert("Book submitted successfully!");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  };

  const handleBookSelect = (result: Book): void => {
    const newBooks = {
      ISBN: result.ISBN,
      Title: result.Title,
      Author: result.Author,
      Editor: result.Editor,
      Price_new: result.Price_new,
    };
    setBooks(newBooks);
    setIsbnResults([]);
    setActiveISBNIndex(null);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log({ books });
    api.submitForm(books);
  };

  return (
    <div className="form-container">
      <div className="form-header">
              <Link to="/" className="back-button">
                  ← Back to Main
                </Link>
        <h1 className="form-title">Pisello Submit Books</h1>
      </div>
      <form onSubmit={handleSubmit} className="submission-form">
        <div className="books-section">
          <h2>Books Information</h2>
          <div className="book-entry">
            <div className="book-header">
              <h3>Book </h3>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-field isbn-field">ISBN</label>
                <ISBNLookupField
                  value={books.ISBN}
                  onChange={(value: string) => {
                    const newBooks = books;
                    newBooks.ISBN = value;
                    setBooks(newBooks);
                    api.searchISBN(value);
                  }}
                  results={isbnResults}
                  onSelect={(result) => handleBookSelect(result)}
                  isSearching={isSearching}
                />
              </div>

              <div className="form-field">
                <label>Title</label>
                <input
                  type="text"
                  value={books.Title}
                  onChange={(e) => {
                    const newBooks = books;
                    newBooks.Title = e.target.value;
                    setBooks(newBooks);
                  }}
                  // className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="form-field">
                <label>Author</label>
                <input
                  type="text"
                  value={books.Author}
                  onChange={(e) => {
                    const newBooks = books;
                    newBooks.Author = e.target.value;
                    setBooks(newBooks);
                  }}
                  // className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="form-field">
                <label>Editor</label>
                <input
                  type="text"
                  value={books.Editor}
                  onChange={(e) => {
                    const newBooks = books;
                    newBooks.Editor = e.target.value;
                    setBooks(newBooks);
                  }}
                  // className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="form-field">
                <label>Price</label>
                <input
                  type="number"
                  value={books.Price_new}
                  onChange={(e) => {
                    const newBooks = books;
                    newBooks.Price_new = Number(e.target.value);
                    setBooks(newBooks);
                  }}
                  // className="w-full p-2 border rounded"
                  required
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default InsertBooks;
