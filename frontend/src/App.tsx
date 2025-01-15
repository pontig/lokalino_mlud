import React, { useState, useEffect } from "react";
import { HashRouter as Router, Link, Route, Routes } from "react-router-dom";

import "./BookStore.css";
import CartPage from "./CartPage";
import BookList from "./components/BookList";
import Book from "./types/Book";

// Mock data to simulate API response
const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 9.99,
    description:
      "A story of decadence and excess, Gatsby explores the darker aspects of the American Dream.",
    coverImage: "/api/placeholder/300/400",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    price: 12.99,
    description:
      "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
    coverImage: "/api/placeholder/300/400",
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 7.99,
    description:
      "A romantic novel of manners. The story follows the main character Elizabeth Bennet.",
    coverImage: "/api/placeholder/300/400",
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 11.99,
    description:
      "A story that explores human behavior and the collective conscience of The Deep South.",
    coverImage: "/api/placeholder/300/400",
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 14.99,
    description:
      "A fantasy novel about the adventures of hobbit Bilbo Baggins.",
    coverImage: "/api/placeholder/300/400",
  },
  {
    id: "6",
    title: "Dune",
    author: "Frank Herbert",
    price: 13.99,
    description:
      "A science fiction novel about the desert planet Arrakis and its native spice melange.",
    coverImage: "/api/placeholder/300/400",
  },
];

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (book: Book) => {
    setCart((prev) => [...prev, book]);
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((book) => book.id !== bookId));
  };

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
        Error: {error}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <BookList
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredBooks={filteredBooks}
              cart={cart}
              isInCart={isInCart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          }
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
