import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Book from "../types/Book";
import axios from "axios"; // Make sure to install axios: npm install axios

interface BookListProps {
  cart: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
}

// API service for books
const api = {
  // baseUrl: window.location.origin + '/be',
  baseUrl: "https://www.pontiggiaelia.altervista.org/be",
  
  // Get all books
  async getBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${this.baseUrl}/books.php`);
      const data = (await response.json()) as Book[];
      console.log(data);
      console.log(data.reduce((sum, book) => sum + book.price, 0));
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch books');
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
        throw new Error(error.response?.data?.message || 'Failed to fetch book');
      }
      throw error;
    }
  }
};

// Utility functions for cart storage
const saveCartToStorage = (cart: Book[]) => {
  localStorage.setItem('bookstore-cart', JSON.stringify(cart));
};

const loadCartFromStorage = (): Book[] => {
  const savedCart = localStorage.getItem('bookstore-cart');
  if (savedCart)
    console.log(savedCart)
  return savedCart ? JSON.parse(savedCart) as Book[] : [];
};

const BookList = ({ cart, removeFromCart, addToCart }: BookListProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // // Load cart from localStorage on initial render
  // useEffect(() => {
  //   const savedCart = loadCartFromStorage();
  //   savedCart.forEach(book => {
  //     if (!cart.some(item => item.id === book.id)) {
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
      // fetchedBooks = mockBooks;
      setBooks(fetchedBooks);
      setFilteredBooks(fetchedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : "An error occurred while fetching books");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter books based on search term
  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const isInCart = (bookId: string) => {
    return cart.some((book) => book.id === bookId);
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

  return (
    <div className="bookstore-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search books..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {cart.length && <Link to="/cart" className="cart-icon">
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
        </Link>}
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-content">
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="book-image"
                />
              )}
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <p className="book-description">{book.description}</p>
              <div className="book-footer">
                <span className="book-price">${Number(book.price).toFixed(2)}</span>
                <button
                  className={`cart-button ${
                    isInCart(book.id) ? "cart-button-remove" : "cart-button-add"
                  }`}
                  onClick={() =>
                    isInCart(book.id)
                      ? removeFromCart(book.id)
                      : addToCart(book)
                  }
                >
                  {isInCart(book.id) ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="empty-message">
          No books found matching your search.
        </div>
      )}
    </div>
  );
};

export default BookList;