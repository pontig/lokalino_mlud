import React, { useState, useCallback, useRef } from "react";
import SearchField from "./SearchField";
import BookEntryProps from "../types/BookEntryProps";
import BookEntry from "../types/BookEntry";
import Book from "../types/Book";

const BookEntryComponent: React.FC<BookEntryProps> = ({
  book,
  index,
  showComment = false,
  disabledFields = false,
  secondDisabledFields = false,
  showConditions = true,
  onBookChange,
  onRemove,
  booksToSearchAmong = [],
}) => {
  const [isSearchingISBN, setIsSearchingISBN] = useState(false);
  const [isSearchingTitle, setIsSearchingTitle] = useState(false);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [titleResults, setTitleResults] = useState<Book[]>([]);

  // Use refs to handle debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const api = {
    baseUrl: "/be",

    async searchISBN(isbn: string): Promise<Book[]> {
      if (isbn.length < 2) {
        return [];
      }

      if (booksToSearchAmong.length > 0) {
        // Filter booksToSearchAmong for ISBNs that match the search term
        return booksToSearchAmong.filter((book) =>
          book.ISBN.toLowerCase().includes(isbn.toLowerCase())
        );
      }

      try {
        const response = await fetch(
          `${this.baseUrl}/getExistingBooks.php?ISBN=${isbn}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error searching ISBN:", error);
        return [];
      }
    },

    async searchTitle(title: string): Promise<Book[]> {
      if (title.length < 2) {
        return [];
      }

      if (booksToSearchAmong.length > 0) {
        // Filter booksToSearchAmong for titles that include the search term
        return booksToSearchAmong.filter((book) =>
          book.Title.toLowerCase().includes(title.toLowerCase())
        );
      }

      try {
        const response = await fetch(
          `${this.baseUrl}/getExistingBooks.php?title=${encodeURIComponent(
            title
          )}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error searching title:", error);
        return [];
      }
    },
  };

  const handleFieldChange = (
    field: keyof BookEntry,
    value: string | number | boolean
  ) => {
    onBookChange(
      {
        ...book,
        [field]: value,
      },
      index
    );
  };

  const handleISBNSearch = useCallback(
    async (value: string) => {
      handleFieldChange("ISBN", value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (value.length < 2) {
        setIsbnResults([]);
        return;
      }

      setIsSearchingISBN(true);

      // Debounce the search
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await api.searchISBN(value);
        setIsbnResults(results);
        setIsSearchingISBN(false);
      }, 300);
    },
    [book, index, onBookChange]
  );

  const handleTitleSearch = useCallback(
    async (value: string) => {
      handleFieldChange("Title", value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (value.length < 2) {
        setTitleResults([]);
        return;
      }

      setIsSearchingTitle(true);

      // Debounce the search
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await api.searchTitle(value);
        setTitleResults(results);
        setIsSearchingTitle(false);
      }, 300);
    },
    [book, index, onBookChange]
  );

  const handleBookSelect = (selectedBook: Book) => {
    onBookChange(
      {
        ...book,
        ISBN: selectedBook.ISBN,
        Title: selectedBook.Title,
        Author: selectedBook.Author,
        Editor: selectedBook.Editor,
        Price_new: 0.0,
      },
      index
    );
    // Clear results after selection
    setIsbnResults([]);
    setTitleResults([]);
  };

  return (
    <div className="book-entry">
      <div className="book-header">
        <h3>Libro #{index + 1}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="remove-book-button"
          >
            Rimuovi
          </button>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>ISBN</label>
          <SearchField
            value={book.ISBN}
            onChange={handleISBNSearch}
            results={isbnResults}
            onSelect={handleBookSelect}
            isSearching={isSearchingISBN}
            placeholder="Niente spazi o trattini"
            disabled={disabledFields}
            index={index}
          />
        </div>

        <div className="form-field">
          <label>Titolo</label>
          <SearchField
            value={book.Title}
            onChange={handleTitleSearch}
            results={titleResults}
            onSelect={handleBookSelect}
            isSearching={isSearchingTitle}
            placeholder="Digita per cercare"
            disabled={disabledFields}
            index={index}
          />
        </div>

        <div className="form-field">
          <label>Prezzo di copertina (xx,xx)</label>
          <input
            type="text"
            value={book.Price_new === 0.0 ? "" : book.Price_new}
            onChange={(e) => {
              const input = e.target.value.replace(",", ".");
              // Allow only numbers and one decimal separator
              if (/^\d*\.?\d*$/.test(input)) {
          handleFieldChange("Price_new", input);
              }
            }}
            className="w-full p-2 border rounded"
            required
            disabled={disabledFields}
          />
        </div>

        {showConditions && (
          <div className="form-field">
            <label>Condizioni</label>
            <select
              value={book.Dec_conditions}
              onChange={(e) =>
                handleFieldChange(
                  "Dec_conditions",
                  e.target.value as BookEntry["Dec_conditions"]
                )
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--</option>
              <option value="new">Nuovo</option>
              <option value="optimal">Ottimo</option>
              <option value="good">Buono</option>
              <option value="bad">Usurato</option>
            </select>
          </div>
        )}

        <div className="form-field">
          <label>Autore</label>
          <input
            type="text"
            value={book.Author}
            onChange={(e) => handleFieldChange("Author", e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={disabledFields || secondDisabledFields}
          />
        </div>

        <div className="form-field">
          <label>Editore</label>
          <input
            type="text"
            value={book.Editor}
            onChange={(e) => handleFieldChange("Editor", e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={disabledFields || secondDisabledFields}
          />
        </div>

        {showComment && (
          <div className="form-field" style={{ gridColumn: "span 2" }}>
            <label>Aggiungi un commento se necessario</label>
            <input
              type="text"
              value={book.Comment}
              onChange={(e) => handleFieldChange("Comment", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Es. Copertina rovinata"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookEntryComponent;
