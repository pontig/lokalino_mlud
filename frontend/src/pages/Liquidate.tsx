// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Sold_date?: string;
  PB_Id: number;
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

const Liquidate: React.FC = () => {
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
      Sold_date: undefined,
      PB_Id: -1,
    },
  ]);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liquidation, setLiquidation] = useState<number>(0);
  const [confirming, setConfirming] = useState<boolean>(false);
  const navigate = useNavigate();

  const api = {
    baseUrl: "https://pontiggiaelia.altervista.org/be",

    async getProviders(): Promise<Provider[]> {
      const response = await fetch(`${this.baseUrl}/getProviders.php`);
      if (!response.ok) throw new Error("Failed to fetch providers");
      const data = await response.json();
      const res = data.filter((provider: any) => provider.State === "1");
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

    async submitForm(    ): Promise<void> {
      const requestBody = {
        Provider_Id: selectedProvider
      }

      const response = await fetch(`${this.baseUrl}/liquidateProvider.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        console.log("Provider liquidated");
        setSelectedProvider(null);
        navigate("/");
      } else {
        console.log("Liquidation failed");
      }
      // setSelectedProvider(null);
    },

    async getBooksByProvider(providerId: number): Promise<{
      personalInfo: PersonalInfo;
      books: BookEntry_commented[];
      liquidation: number;
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
          data.books
            .filter((book: BookEntry_commented) => book.Sold_date === null)
            .map((book: BookEntry_commented) => ({
              ISBN: book.ISBN || "",
              Title: book.Title || "",
              Author: book.Author || "",
              Editor: book.Editor || "",
              Price_new: book.Price_new || 0.0,
              Dec_conditions: book.Dec_conditions || "good",
              Comment: book.Comment || "",
              Sold_date: book.Sold_date || undefined,
            })) || [],
        liquidation:
          data.books
            .filter((book: BookEntry_commented) => book.Sold_date !== null)
            .reduce(
              (acc: number, book: BookEntry_commented) =>
                acc + Number(book.Price_new),
              0
            ) / 2,
      };
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
      setLiquidation(data.liquidation);
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
        Sold_date: undefined,
        PB_Id: -1,
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
    api.submitForm();
  };

  if (isLoading) {
    return <div>Loading form data...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <span
          className="back-link"
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedProvider(null)}
        >
          ← Back to Provider list
        </span>
        <h1 className="form-title">
          Check all is good for {selectedProvider.Name}{" "}
          {selectedProvider.Surname}
        </h1>
      </div>

      <div className="search-container">
        <h2 style={{ textAlign: "center" }} className="form-title">
          Amount to liquidate: €{liquidation.toFixed(2)}
        </h2>
      </div>

      <div className="content">
        {books.map((book) => (
          <div key={book.PB_Id} className="book-card">
            <div className="book-content">
              <h3 className="book-title">{book.Title}</h3>
              <p className="book-author">by {book.Author}</p>
              <p className="book-description">{book.Dec_conditions} state</p>
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

        {books.length === 0 && (
          <div className="empty-message">All books were sold.</div>
        )}
      </div>
      <div className="search-container" style={{ gridTemplateColumns: "1fr" }}>
      {!confirming && (
        <button
          type="submit"
          className="submit-button"
          onClick={() => setConfirming(true)}
        >
          Mark as liquidated
        </button>
      )}

        {confirming && (
          <div className="confirm">
            <div className="confirm-message">
              <p style={{textAlign: "center"}}>Are you sure you want to mark all books as liquidated?</p>
            </div>
            <div className="confirm-buttons">
              <button
                className="cart-button cart-button-remove confirm-button"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                className="cart-button cart-button-add confirm-button"
                onClick={handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liquidate;
