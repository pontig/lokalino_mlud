// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/SubmissionForm.css";
import Book from "../types/Book";
import BookEntry from "../types/BookEntry";

interface PersonalInfo {
  name: string;
  surname: string;
}

interface Provider {
  Provider_Id: number;
  Name: string;
  Surname: string;
}

interface BookEntry_commented extends BookEntry {
  Comment: string;
}

interface ISBNLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  results: Book[];
  onSelect: (result: Book) => void;
  isSearching: boolean;
}
// TODO: non va troppo bene, dovrei passare PB_id quando faccio submit

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

const PickUp: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    surname: "",
  });
  const [books, setBooks] = useState<BookEntry_commented[]>([
    {
      ISBN: "",
      Title: "",
      Author: "",
      Editor: "",
      Price_new: 0.0,
      Dec_conditions: "good",
      Comment: "",
    },
  ]);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const api = {
    baseUrl: "https://pontiggiaelia.altervista.org/be",

    async getProviders(): Promise<Provider[]> {
      const response = await fetch(`${this.baseUrl}/getProviders.php`);
      if (!response.ok) throw new Error("Failed to fetch providers");
      const data = await response.json();
      const res = data.filter((provider: any) => provider.State === "0");
      return res;
    },

    // Search for a book by ISBN
    async searchISBN(isbn: string, index: number): Promise<void> {
      if (isbn.length < 2) {
        setIsbnResults([]);
        return;
      }

      setActiveISBNIndex(index);
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

    async submitForm(
      personalInfo: PersonalInfo,
      books: BookEntry_commented[]
    ): Promise<void> {
      // TODO

      setSelectedProvider(null);
    },

    async getBooksByProvider(providerId: number): Promise<{
      personalInfo: PersonalInfo;
      books: BookEntry_commented[];
    }> {
      const response = await fetch(
        `${this.baseUrl}/getBooksByProvider.php?Provider_Id=${providerId}`
      );
      if (!response.ok) throw new Error("Failed to fetch provider books");
      const data = await response.json();

      return {
        personalInfo: {
          name: data.provider[0].Name || "",
          surname: data.provider[0].Surname || "",
        },
        books:
          data.books.map((book: BookEntry_commented) => ({
            ISBN: book.ISBN || "",
            Title: book.Title || "",
            Author: book.Author || "",
            Editor: book.Editor || "",
            Price_new: book.Price_new || 0.0,
            Dec_conditions: book.Dec_conditions || "good",
            Comment: book.Comment || "",
          })) || [],
      };
    },

    async fetchInitialFormData(): Promise<{
      personalInfo: PersonalInfo;
      books: BookEntry_commented[];
    }> {
      try {
        const response = await fetch(
          `${this.baseUrl}/getBooksByProvider.php?Provider_Id=3`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch initial data");
        }
        const data = await response.json();
        return {
          personalInfo: {
            name: data.provider.Name || "",
            surname: data.provider.Surname || "",
          },
          books:
            data.books.map((book: BookEntry_commented) => ({
              ISBN: book.ISBN || "",
              Title: book.Title || "",
              Author: book.Author || "",
              Editor: book.Editor || "",
              Price_new: book.Price_new || 0.0,
              Dec_conditions: book.Dec_conditions || "good",
            })) || [],
        };
      } catch (error) {
        console.error("Error fetching initial form data:", error);
        return {
          personalInfo: { ...personalInfo },
          books: books,
        };
      }
    },
  };

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await api.getProviders();
        setProviders(data);
      } catch (error) {
        console.error("Error loading providers:", error);
      }
    };
    loadProviders();
  }, []);

  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider);
    setIsLoading(true);
    try {
      const data = await api.getBooksByProvider(provider.Provider_Id);
      setPersonalInfo(data.personalInfo);
      setBooks(data.books);
    } catch (error) {
      console.error("Error loading provider books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProvider) {
    return (
      <div className="bokstore-container form-container">
         <div className="form-header">
        <Link to="/" className="back-button">
          ← Back to Provider list
        </Link>
        <h1 className="form-title">Select a provider</h1>
      </div>
        <div className="content">
          {providers.map((provider) => (
            <button
              key={provider.Provider_Id}
              onClick={() => handleProviderSelect(provider)}
              className="choice"
            >
              {provider.Name} {provider.Surname}
            </button>
          ))}
        </div>
      </div>
    );
  }

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
        Comment: "",
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
    const missingFields: string[] = [];

    if (personalInfo.name === "") {
      missingFields.push("Personal Info: name");
    }
    if (personalInfo.surname === "") {
      missingFields.push("Personal Info: surname");
    }

    books.forEach((book, index) => {
      if (book.ISBN === "") {
        missingFields.push(`Book ${index + 1}: ISBN`);
      }
      if (book.Title === "") {
        missingFields.push(`Book ${index + 1}: Title`);
      }
      if (book.Author === "") {
        missingFields.push(`Book ${index + 1}: Author`);
      }
      if (book.Editor === "") {
        missingFields.push(`Book ${index + 1}: Editor`);
      }
      if (book.Price_new === 0) {
        missingFields.push(`Book ${index + 1}: Price`);
      }
    });

    console.log({ personalInfo, books });
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields:\n${missingFields.join("\n")}`);
      return;
    }

    api.submitForm(personalInfo, books);
  };

  if (isLoading) {
    return <div>Loading form data...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <span className="back-link" style={{cursor: "pointer"}} onClick={() => setSelectedProvider(null)}>
          ← Back to Provider list
        </span>
        <h1 className="form-title">Check all is good for {selectedProvider.Name} {selectedProvider.Surname}</h1>
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
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
                        .value as BookEntry_commented["Dec_conditions"];
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

                <div className="form-field" style={{ gridColumn: "span 2" }}>
                  <label>Add a comment if needed</label>
                  <input
                    type="text"
                    value={book.Comment}
                    onChange={(e) => {
                      const newBooks = [...books];
                      newBooks[index].Comment = e.target.value;
                      setBooks(newBooks);
                    }}
                    // className="w-full p-2 border rounded"
                  />
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

export default PickUp;
