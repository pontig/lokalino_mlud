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
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
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
      if (!response.ok) throw new Error('Failed to fetch providers');
      return response.json();
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
    },


    async getBooksByProvider(providerId: number): Promise<{
      personalInfo: PersonalInfo;
      books: BookEntry_commented[];
    }> {
      const response = await fetch(
        `${this.baseUrl}/getBooksByProvider.php?Provider_Id=${providerId}`
      );
      if (!response.ok) throw new Error('Failed to fetch provider books');
      const data = await response.json();
      
      return {
        personalInfo: {
          name: data.provider.Name || "",
          surname: data.provider.Surname || "",
        },
        books: data.books.map((book: BookEntry_commented) => ({
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
      <div className="providers-list">
        <h1 className="text-2xl font-bold mb-4">Select a Provider</h1>
        <div className="grid gap-4">
          {providers.map((provider) => (
            <button
              key={provider.Provider_Id}
              onClick={() => handleProviderSelect(provider)}
              className="p-4 border rounded hover:bg-gray-100 text-left"
            >
              {provider.Name} {provider.Surname}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Fetch initial data on component mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const { personalInfo: initialPersonalInfo, books: initialBooks } =
  //         await api.fetchInitialFormData();

  //       // Only update if data is not empty
  //       if (initialBooks.length > 0) {
  //         setPersonalInfo(initialPersonalInfo);
  //         setBooks(initialBooks);
  //       }
  //     } catch (error) {
  //       console.error("Error in initial data fetch:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
    const allFieldsFilled =
      Object.values(personalInfo).every((value) => value !== "") &&
      books.every((book) =>
        Object.values(book).every((value) => value !== "" && value !== 0)
      );

    if (!allFieldsFilled) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log({ personalInfo, books });
    api.submitForm(personalInfo, books);
  };

  if (isLoading) {
    return <div>Loading form data...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Check all is good</h1>
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
