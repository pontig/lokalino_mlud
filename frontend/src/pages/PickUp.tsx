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

const PickUp: React.FC = () => {
  // API service
  const api = {
    baseUrl: "/be",

    async fetchProviders(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/getProviders.php`);
      if (response.status === 401) {
        navigate("/login");
      }
      if (!response.ok) throw new Error("Failed to fetch providers");
      const data = await response.json();
      const res = data.filter((provider: any) => provider.State === "0");
      setProviders(res);
      return res;
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

        navigate("/backOffice");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form");
      }

      if (!form) {
        alert("Form data is missing");
        return;
      }
    },

    async getBooksByProvider(provider: Provider): Promise<void> {
      setSelectedProvider(provider);
      setIsLoading(true);
      try {
        const response = await fetch(
          `${this.baseUrl}/getBooksByProvider.php?Provider_Id=${provider.Provider_Id}`
        );
        if (response.status === 401) {
          navigate("/login");
        }
        const data = await response.json();
        setPersonalInfo({
          name: data.provider[0].Name,
          surname: data.provider[0].Surname,
        });

        setBooksInseredByPr(
          data.books.map((book: BookEntry_commented) => ({
            ISBN: book.ISBN || "",
            Title: book.Title || "",
            Author: book.Author || "",
            Editor: book.Editor || "",
            Price_new: book.Price_new || 0.0,
            Dec_conditions: book.Dec_conditions || "Buono",
            Comment: book.Comment || "",
            PB_Id: book.PB_Id || 0,
          })) || []
        );
      } catch (error) {
        console.error("Error loading provider books:", error);
      } finally {
        setIsLoading(false);
      }
    },
  };

  // Navigation and state
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
      Dec_conditions: "Buono",
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

  // Effects
  useEffect(() => {
    api.fetchProviders();
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

  // Functions
  const filteredProviders = providers.filter((provider) =>
    `${provider.Name} ${provider.Surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!selectedProvider) {
    return (
      <div className="bokstore-container form-container">
        <h1 style={{ textAlign: "center" }}>Seleziona un venditore</h1>
        <div className="search-container">
          <Link to="/backOffice" className="back-button">
            ← Torna alla Dashboard
          </Link>
          <input
            type="text"
            placeholder="🔍 Cerca venditore..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="content">
          {filteredProviders.length === 0 ? (
            <div className="empty-message">
              Nessuna corrispondenza trovata per "{searchQuery}"
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <button
                key={provider.Provider_Id}
                onClick={() => api.getBooksByProvider(provider)}
                className="choice"
              >
                <b>(ID#{provider.Provider_Id})</b> {provider.Name} {provider.Surname}
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

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
          ← Seleziona un altro venditore
        </span>
        <h1 className="form-title">
          Controlla libri portati da <b>(ID#{selectedProvider.Provider_Id})</b> {selectedProvider.Name}{" "}
          {selectedProvider.Surname}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        {/* Books Section */}
        <div className="books-section">
          <h2>Libri dichiarati</h2>
          {booksInseredByPr.length === 0 && (
            <div className="empty-message">Hai rimosso un po' troppo...</div>
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
                };
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
              secondDisabledFields = {false}
            />
          ))}

          <button type="button" onClick={addBook} className="add-book-button">
            Aggiungi manualmente un libro
          </button>
        </div>
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Segna come ritirato
        </button>
      </form>
    </div>
  );
};

export default PickUp;
