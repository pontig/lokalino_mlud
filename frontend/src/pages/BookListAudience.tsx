import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import AvailableBook from "../types/AvailableBook";
import Header from "../components/Header";


const BookListAudience: React.FC = () => {
  // API service
  const api = {
    baseUrl: "/be",

    // Get all books
    async fetchBooks(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${this.baseUrl}/getAvailableBooksAudience.php`);
        if (response.status === 401) {
          navigate("/login");
        }
        const data = (await response.json()) as AvailableBook[];
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setIsLoading(false);
        return
      }
    },
  };

  // Navigation and state
  const navigate = useNavigate();
  const [books, setBooks] = useState<AvailableBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<AvailableBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    api.fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <div>
          Error: {error}
          <button
            onClick={api.fetchBooks}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookstore-container">
      <Header title={"Seleziona libri"}
        hasSearchBox={true}
        value={searchTerm}
        onPassedChange={setSearchTerm}
        onLinkClick={async () => await navigate("/backOffice")}
      />

      <div className="content">
        {filteredBooks.map((book) => (
          <div key={book.PB_Id} className="book-card">
            <div className="book-content">
              <h3 className="book-title">{book.Title}</h3>
              <p className="book-author">di {book.Author}</p>
              <p className="book-author">isbn {book.ISBN}</p>
              <p className="book-description">Editore: {book.Editor}</p>
              <p className="book-description">
                Stato del libro {" "}
                {book.Dec_conditions}
              </p>
              {book.Comment && (
                <p className="book-description">{book.Comment}</p>
              )}
              <div className="book-footer">
                <span className="book-price">
                  €{Number(book.Price_new).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="empty-message">
            Nessun libro trovato. Prova a cercare qualcos'altro.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListAudience;
