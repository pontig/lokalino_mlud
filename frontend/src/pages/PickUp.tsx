// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/SubmissionForm.css";
import Book from "../types/Book";
import BookEntry from "../types/BookEntry";
import BookEntryComponent from "../components/BookEntry";

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
  PB_Id: number;
}

interface ISBNLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  results: Book[];
  onSelect: (result: Book) => void;
  isSearching: boolean;
}

interface SubmissionType {
  Provider_Id: number;
  Books_to_edit: {
    PB_Id: number;
    Dec_conditions: string;
    Comment: string;
  }[];
  Books_to_add: BookEntry_commented[];
  Books_to_remove: { PB_Id: number }[];
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
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    surname: "",
  });
  const [booksInseredByPr, setBooksInseredByPr] = useState<
    BookEntry_commented[]
  >([
    {
      ISBN: "",
      Title: "",
      Author: "",
      Editor: "",
      Price_new: 0.0,
      Dec_conditions: "good",
      Comment: "",
      PB_Id: 0,
    },
  ]);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [booksToRemove, setBooksToRemove] = useState<number[]>([]);
  const [manuallyAddedBooks, setManuallyAddedBooks] = useState<
    BookEntry_commented[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitObj, setSubmitObj] = useState<SubmissionType | null>(null);
  const [showConfirm, setShowConfirm] = useState<number>(-1);

  const api = {
    baseUrl: "/be",

    async getProviders(): Promise<Provider[]> {
      const response = await fetch(`${this.baseUrl}/getProviders.php`);
      if (response.status === 401) {
      navigate("/login");
      return [];
      }
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
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      const data: Book[] = await response.json();
      setIsbnResults(data);
      } catch (error) {
      console.error("Error searching ISBN:", error);
      setIsbnResults([]);
      } finally {
      setIsSearching(false);
      }
    },

    async submitForm(form: SubmissionType | null): Promise<void> {
      console.log("Submitting form:", form);

      try {
      const response = await fetch(`${this.baseUrl}/storeBooks.php`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      navigate("/");
      } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
      }

      if (!form) {
      alert("Form data is missing");
      return;
      }
    },

    async getBooksByProvider(providerId: number): Promise<{
      personalInfo: PersonalInfo;
      books: BookEntry_commented[];
    }> {
      const response = await fetch(
      `${this.baseUrl}/getBooksByProvider.php?Provider_Id=${providerId}`
      );
      if (response.status === 401) {
      navigate("/login");
      return { personalInfo: { name: "", surname: "" }, books: [] };
      }
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
        PB_Id: book.PB_Id || 0,
        })) || [],
      };
    },

    //   async fetchInitialFormData(): Promise<{
    //     personalInfo: PersonalInfo;
    //     books: BookEntry_commented[];
    //   }> {
    //     try {
    //       const response = await fetch(
    //         `${this.baseUrl}/getBooksByProvider.php?Provider_Id=3`
    //       );
    //       if (!response.ok) {
    //         throw new Error("Failed to fetch initial data");
    //       }
    //       const data = await response.json();
    //       return {
    //         personalInfo: {
    //           name: data.provider.Name || "",
    //           surname: data.provider.Surname || "",
    //         },
    //         books:
    //           data.books.map((book: BookEntry_commented) => ({
    //             ISBN: book.ISBN || "",
    //             Title: book.Title || "",
    //             Author: book.Author || "",
    //             Editor: book.Editor || "",
    //             Price_new: book.Price_new || 0.0,
    //             Dec_conditions: book.Dec_conditions || "good",
    //           })) || [],
    //       };
    //     } catch (error) {
    //       console.error("Error fetching initial form data:", error);
    //       return {
    //         personalInfo: { ...personalInfo },
    //         books: books,
    //       };
    //     }
    //   },
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

  useEffect(() => {
    setSubmitObj({
      Provider_Id: selectedProvider?.Provider_Id || 0,
      Books_to_edit: booksInseredByPr.map((book) => ({
        PB_Id: book.PB_Id,
        Dec_conditions: book.Dec_conditions,
        Comment: book.Comment,
      })),
      Books_to_add: manuallyAddedBooks,
      Books_to_remove: booksToRemove.map((PB_Id) => ({ PB_Id })),
    });
  }, [
    booksInseredByPr,
    manuallyAddedBooks,
    booksToRemove,
    selectedProvider?.Provider_Id,
  ]);

  const filteredProviders = providers.filter((provider) =>
    `${provider.Name} ${provider.Surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider);
    setIsLoading(true);
    try {
      const data = await api.getBooksByProvider(provider.Provider_Id);
      setPersonalInfo(data.personalInfo);
      setBooksInseredByPr(data.books);
      console.log(data);
      console.log(data.books);
    } catch (error) {
      console.error("Error loading provider books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProvider) {
    return (
      <div className="bokstore-container form-container">
        <h1 style={{ textAlign: "center" }}>Select a provider</h1>
        <div className="search-container">
          <Link to="/backOffice" className="back-button">
            ← Back to Main
          </Link>
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="content">
          {filteredProviders.length === 0 ? (
            <div className="empty-message">
              No providers found matching your search
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <button
                key={provider.Provider_Id}
                onClick={() => handleProviderSelect(provider)}
                className="choice"
              >
                {provider.Name} {provider.Surname}
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  const handleBookSelect = (result: Book, index: number): void => {
    const newBooks = [...manuallyAddedBooks];
    newBooks[index] = {
      ...newBooks[index],
      ISBN: result.ISBN,
      Title: result.Title,
      Author: result.Author,
      Editor: result.Editor,
      Price_new: result.Price_new,
    };
    setManuallyAddedBooks(newBooks);
    setIsbnResults([]);
    setActiveISBNIndex(null);
  };

  const addBook = (): void => {
    setManuallyAddedBooks([
      ...manuallyAddedBooks,
      {
        ISBN: "",
        Title: "",
        Author: "",
        Editor: "",
        Price_new: 0.0,
        Dec_conditions: "good",
        Comment: "",
        PB_Id: 0,
      },
    ]);
  };

  const removePrBook = (index: number, Pb_Id: number): void => {
    setBooksInseredByPr(booksInseredByPr.filter((_, i) => i !== index));
    setBooksToRemove([...booksToRemove, Pb_Id]);
  };

  const removeManBook = (index: number): void => {
    setManuallyAddedBooks(manuallyAddedBooks.filter((_, i) => i !== index));
  };

  const sureToRemove = (PB_Id: number) => {
    setShowConfirm(PB_Id);
  };

  const cancelDelete = () => {
    setShowConfirm(-1);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    const missingFields = [];

    if (!personalInfo.name) missingFields.push("Name");
    if (!personalInfo.surname) missingFields.push("Surname");

    booksInseredByPr.forEach((book, index) => {
      if (!book.ISBN) missingFields.push(`Book ${index + 1} ISBN`);
      if (!book.Title) missingFields.push(`Book ${index + 1} Title`);
      if (!book.Author) missingFields.push(`Book ${index + 1} Author`);
      if (!book.Editor) missingFields.push(`Book ${index + 1} Editor`);
      if (!book.Price_new) missingFields.push(`Book ${index + 1} Price`);
    });

    manuallyAddedBooks.forEach((book, index) => {
      if (!book.ISBN)
        missingFields.push(`Manually Added Book ${index + 1} ISBN`);
      if (!book.Title)
        missingFields.push(`Manually Added Book ${index + 1} Title`);
      if (!book.Author)
        missingFields.push(`Manually Added Book ${index + 1} Author`);
      if (!book.Editor)
        missingFields.push(`Manually Added Book ${index + 1} Editor`);
      if (!book.Price_new)
        missingFields.push(`Manually Added Book ${index + 1} Price`);
    });

    if (missingFields.length > 0) {
      alert(
        `Please fill in the following fields:\n${missingFields.join("\n")}`
      );
      return;
    }
    api.submitForm(submitObj);
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

      <form onSubmit={handleSubmit} className="submission-form">
        {/* Books Section */}
        <div className="books-section">
          <h2>Books Information</h2>
          {booksInseredByPr.length === 0 && (
            <div className="empty-message">No books to remove</div>
          )}
          {booksInseredByPr.map((book, index) => (
            <BookEntryComponent
              key={index}
              book={book}
              index={index}
              showComment
              showConditions
              onBookChange={(book, index) => {
                const newBooks = [...booksInseredByPr];
                newBooks[index] = {
                  ...book,
                  Comment: book.Comment || "",
                  Dec_conditions: book.Dec_conditions || "good",
                  PB_Id: book.PB_Id || 0,
                }
                setBooksInseredByPr(newBooks);
              }}
              onRemove={(index) => removePrBook(index, book.PB_Id)}
              disabledFields
            />
          ))}

          {manuallyAddedBooks.map((book, index) => (
            <BookEntryComponent
              key={index}
              book={book}
              index={index}
              showComment
              showConditions
              onBookChange={(book, index) => {
                const newBooks = [...manuallyAddedBooks];
                newBooks[index] = {
                  ...book,
                  Comment: book.Comment || "",
                  Dec_conditions: book.Dec_conditions || "good",
                  PB_Id: 0,
                };
                setManuallyAddedBooks(newBooks);
              }}
              onRemove={(index) => removeManBook(index)}
            />
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
