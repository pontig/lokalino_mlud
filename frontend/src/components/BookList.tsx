import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";


interface BookListProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredBooks: Book[];
  cart: Book[];
  isInCart: (bookId: string) => boolean;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
}

const BookList = ({
    searchTerm,
    setSearchTerm,
    filteredBooks,
    cart,
    isInCart,
    addToCart,
    removeFromCart
  }: BookListProps) => (
    <div className="bookstore-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search books..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/cart" className="cart-icon">
  
          <div className="cart-badge">
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
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
                <span className="book-price">${book.price.toFixed(2)}</span>
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

export default BookList;