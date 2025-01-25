// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import "../styles/SubmissionForm.css";
import BookEntry from "../types/BookEntry";
import Book from "../types/Book";

interface PersonalInfo {
  name: string;
  surname: string;
  school: string;
  email: string;
  phone: string;
}

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

const BookSubmissionForm: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    surname: "",
    school: "",
    email: "",
    phone: "",
  });
  const [books, setBooks] = useState<BookEntry[]>([
    {
      ISBN: "",
      Title: "",
      Author: "",
      Editor: "",
      Price_new: 0.0,
      Dec_conditions: "good",
    },
  ]);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);

  const api = {
    baseUrl: "https://pontiggiaelia.altervista.org/be",

    // Search for a book by ISBN
    async searchISBN(isbn: string, index: number): Promise<void> {
      if (isbn.length < 2) {
        setIsbnResults([]);
        return;
      }

      setActiveISBNIndex(index);
      setIsSearching(true);

      try {
        const response = await fetch(`${this.baseUrl}/getExistingBooks.php?ISBN=${isbn}`);
        const data: Book[] = await response.json();
        setIsbnResults(data);
      } catch (error) {
        console.error("Error searching ISBN:", error);
        setIsbnResults([]);
      } finally {
        setIsSearching(false);
      }
    },

    async submitForm(
      personalInfo: PersonalInfo,
      books: BookEntry[]
    ): Promise<void> {
      try {
        const requestBody = {
          personalInfo,
          books,
        };

        const response = await fetch(`${this.baseUrl}/submitBooks.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 200) {
          // Clear form
          setPersonalInfo({
            name: "",
            surname: "",
            school: "",
            email: "",
            phone: "",
          });
          setBooks([]);
          
        }
        const pm = new URLSearchParams({name : personalInfo.name + " " + personalInfo.surname});
        window.location.href = "/#/thank-you?" + pm.toString();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  };

  const handlePersonalInfoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookSelect = (result: Book, index: number): void => {
    const newBooks = [...books];
    newBooks[index] = {
      ...newBooks[index],
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

  const addBook = (): void => {
    setBooks([
      ...books,
      {
        ISBN: "",
        Title: "",
        Author: "",
        Editor: "",
        Price_new: 0.0,
        Dec_conditions: "good",
      },
    ]);
  };

  const removeBook = (index: number): void => {
    if (books.length > 1) {
      setBooks(books.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log({ personalInfo, books });
    api.submitForm(personalInfo, books);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Submit Books</h1>
      </div>
      <form onSubmit={handleSubmit} className="submission-form">
        {/* Personal Info Section */}
        <div className="personal-info-section">
          <h2>Personal Information</h2>
          <div className="form-grid">
            {Object.entries(personalInfo).map(([key, value]) => (
              <div key={key} className="form-field">
                <label className="block text-sm font-medium mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  value={value}
                  onChange={handlePersonalInfoChange}
                  // className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Books Section */}
        <div className="books-section">
          <h2>Books Information</h2>
          {books.map((book, index) => (
            <div key={index} className="book-entry">
              <div className="book-header">
                <h3>Book {index + 1}</h3>
                {books.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBook(index)}
                    className="remove-book-button"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="form-field isbn-field">ISBN</label>
                  <ISBNLookupField
                    value={book.ISBN}
                    onChange={(value: string) => {
                      const newBooks = [...books];
                      newBooks[index].ISBN = value;
                      setBooks(newBooks);
                      api.searchISBN(value, index);
                    }}
                    results={activeISBNIndex === index ? isbnResults : []}
                    onSelect={(result) => handleBookSelect(result, index)}
                    isSearching={isSearching && activeISBNIndex === index}
                  />
                </div>

                <div className="form-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={book.Title}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].Title = e.target.value;
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
                    value={book.Author}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].Author = e.target.value;
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
                    value={book.Editor}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].Editor = e.target.value;
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
                    value={book.Price_new}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].Price_new = Number(e.target.value);
                      setBooks(newBooks);
                    }}
                    // className="w-full p-2 border rounded"
                    required
                    step="0.01"
                  />
                </div>

                <div className="form-field">
                  <label>Condition</label>
                  <select
                    value={book.Dec_conditions}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].Dec_conditions = e.target
                        .value as BookEntry["Dec_conditions"];
                      setBooks(newBooks);
                    }}
                    // className="w-full p-2 border rounded"
                    required
                  >
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="bad">Bad</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addBook} className="add-book-button">
            Add Another Book
          </button>
        </div>

        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default BookSubmissionForm;
