import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Book from "../types/Book";
import AvailableBook from "../types/AvailableBook";

interface BookListProps {
  cart: AvailableBook[];
  addToCart: (book: AvailableBook) => void;
  removeFromCart: (bookId: number) => void;
}
const BookList: React.FC<BookListProps> = ({ cart, removeFromCart, addToCart }) => {
  // API service
  const api = {
    baseUrl: "/be",

    // Get all books
    async fetchBooks(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${this.baseUrl}/getAvailableBooks.php`);
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

  // Functions
  const addToCartAndClearSearch = (book: AvailableBook) => {
    addToCart(book);
    setSearchTerm("");
  };

  const isInCart = (bookId: number) => {
    return cart.some((book) => book.PB_Id === bookId);
  };

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
      <h1 style={{ textAlign: "center" }}>Seleziona libri</h1>
      <div className="search-container">
        <Link to="/backOffice" className="back-button">
          ← Pannello di controllo
        </Link>
        <input
          type="text"
          placeholder="🔍 Cerca libri..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {cart.length > 0 && (
          <Link to="/cart" className="cart-icon">
            <div className="cart-badge">
              <span className="abso</div>lute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>

      <div className="content">
        {filteredBooks.map((book) => (
          <div key={book.PB_Id} className="book-card">
            <div className="book-content">
              <h3 className="book-title">{book.Title}</h3>
              <p className="book-author">di {book.Author}</p>
              <p className="book-author">isbn {book.ISBN}</p>
              <p className="book-description">Editore: {book.Editor}</p>
              <p className="book-description">
                Venduto da <b>(ID#{book.Provider_Id})</b> {book.ProviderName} {book.ProviderSurname}, stato{" "}
                {book.Dec_conditions}
              </p>
              {book.Comment && (
                <p className="book-description">{book.Comment}</p>
              )}
              <div className="book-footer">
                <span className="book-price">
                  €{Number(book.Price_new).toFixed(2)}
                </span>
                <button
                  className={`cart-button ${
                    isInCart(book.PB_Id)
                      ? "cart-button-remove"
                      : "cart-button-add"
                  }`}
                  onClick={() =>
                    isInCart(book.PB_Id)
                      ? removeFromCart(book.PB_Id)
                      : addToCartAndClearSearch(book)
                  }
                >
                  {isInCart(book.PB_Id) ? "Rimuovi" : "Nel carrello"}
                </button>
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

export default BookList;
