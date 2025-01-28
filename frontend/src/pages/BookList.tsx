import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Book from "../types/Book";
import AvailableBook from "../types/AvailableBook";

interface BookListProps {
  cart: AvailableBook[];
  addToCart: (book: AvailableBook) => void;
  removeFromCart: (bookId: number) => void;
}

// API service for books
const api = {
  baseUrl: '/be',

  // Get all books
  async getBooks(): Promise<AvailableBook[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAvailableBooks.php`);
      const data = (await response.json()) as AvailableBook[];
      console.log(data);
      console.log(data.reduce((sum, book) => sum + book.Price_new, 0));
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch books"
        );
      }
      throw error;
    }
  },

  // You can add more API methods here as needed
  async getBookById(id: string): Promise<Book> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/books/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch book"
        );
      }
      throw error;
    }
  },
};

// // Utility functions for cart storage
// const saveCartToStorage = (cart: Book[]) => {
//   localStorage.setItem("bookstore-cart", JSON.stringify(cart));
// };

// const loadCartFromStorage = (): Book[] => {
//   const savedCart = localStorage.getItem("bookstore-cart");
//   if (savedCart) console.log(savedCart);
//   return savedCart ? (JSON.parse(savedCart) as Book[]) : [];
// };

const BookList = ({ cart, removeFromCart, addToCart }: BookListProps) => {
  const [books, setBooks] = useState<AvailableBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<AvailableBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // // Load cart from localStorage on initial render
  // useEffect(() => {
  //   const savedCart = loadCartFromStorage();
  //   savedCart.forEach(book => {
  //     if (!cart.some(item => item.id === book.ISBN)) {
  //       addToCart(book);
  //     }
  //   });
  // }, []);

  // // Save cart to localStorage whenever it changes
  // useEffect(() => {
  //   saveCartToStorage(cart);
  // }, [cart]);

  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let fetchedBooks = await api.getBooks();

      setBooks(fetchedBooks);
      setFilteredBooks(fetchedBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching books"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addToCartAndClearSearch = (book: AvailableBook) => {
    addToCart(book);
    setSearchTerm("");
  };

  // Filter books based on search term
  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const isInCart = (bookId: number) => {
    return cart.some((book) => book.PB_Id === bookId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <div>
          Error: {error}
          <button
            onClick={fetchBooks}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log(filteredBooks);

  return (
    <div className="bookstore-container">
      <h1 style={{textAlign: "center"}}>Select books</h1>
      <div className="search-container">
      <Link to="/" className="back-button">
          ← Back to Main
        </Link>
        <input
          type="text"
          placeholder="Search books..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {(cart.length > 0) && (
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
              <p className="book-author">by {book.Author}</p>
              <p className="book-description">
                Provided by {book.ProviderName} {book.ProviderSurname},{" "}
                {book.Dec_conditions} state
              </p>
              {book.Comment && <p className="book-description">{book.Comment}</p>}
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
                  {isInCart(book.PB_Id) ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}

      {filteredBooks.length === 0 && (
        <div className="empty-message">
          No books found matching your search.
        </div>
      )}
      </div>
    </div>
  );
};

export default BookList;
