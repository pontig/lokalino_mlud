// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import "../styles/SubmissionForm.css";

interface BookEntry {
  isbn: string;
  title: string;
  author: string;
  editor: string;
  price: string;
  condition: "good" | "average" | "bad";
}

interface PersonalInfo {
  name: string;
  surname: string;
  school: string;
  email: string;
  phone: string;
}

interface ISBNLookupResult {
  ISBN: string;
  title: string;
  author: string;
  editor: string;
  price: string;
}

interface ISBNLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  results: ISBNLookupResult[];
  onSelect: (result: ISBNLookupResult) => void;
  isSearching: boolean;
}

const ISBNLookupField: React.FC<ISBNLookupFieldProps> = ({
  value,
  onChange,
  results,
  onSelect,
  isSearching,
}) => {
  console.log(results.length)
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter ISBN..."
      />

      {isSearching && (
        <div className="absolute w-full mt-1 text-sm text-gray-500">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        // {console.log(results.length)}
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          <div className="max-h-48 overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.ISBN}
                onClick={() => onSelect(result)}
                className="w-full p-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-gray-600">
                  by {result.author} • {result.editor}
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
      isbn: "",
      title: "",
      author: "",
      editor: "",
      price: "",
      condition: "good",
    },
  ]);

  const [isbnResults, setIsbnResults] = useState<ISBNLookupResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);

  const handlePersonalInfoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const searchISBN = async (isbn: string, index: number): Promise<void> => {
    if (isbn.length < 2) {
      setIsbnResults([]);
      return;
    }

    setActiveISBNIndex(index);
    setIsSearching(true);

    try {
      const response = await fetch(
        `https://pontiggiaelia.altervista.org/be/books.php`
      );
      const data: ISBNLookupResult[] = await response.json();
      setIsbnResults(data);
    } catch (error) {
      console.error("Error searching ISBN:", error);
      setIsbnResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookSelect = (result: ISBNLookupResult, index: number): void => {
    const newBooks = [...books];
    newBooks[index] = {
      ...newBooks[index],
      isbn: result.ISBN,
      title: result.title,
      author: result.author,
      editor: result.editor,
      price: result.price,
      
    };
    setBooks(newBooks);
    setIsbnResults([]);
    setActiveISBNIndex(null);
  };

  const addBook = (): void => {
    setBooks([
      ...books,
      {
        isbn: "",
        title: "",
        author: "",
        editor: "",
        price: "",
        condition: "good",
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
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Link to="/" className="back-button">
          ← Back to Books
        </Link>
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
                    value={book.isbn}
                    onChange={(value: string) => {
                      const newBooks = [...books];
                      newBooks[index].isbn = value;
                      setBooks(newBooks);
                      searchISBN(value, index);
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
                    value={book.title}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].title = e.target.value;
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
                    value={book.author}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].author = e.target.value;
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
                    value={book.editor}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].editor = e.target.value;
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
                    value={book.price}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].price = e.target.value;
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
                    value={book.condition}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].condition = e.target
                        .value as BookEntry["condition"];
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

        <button type="submit" className="submit-button">
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default BookSubmissionForm;
