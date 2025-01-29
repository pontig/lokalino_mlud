import React from "react";

import SearchField from "./SearchField";
import BookEntryProps from "../types/BookEntryProps";
import BookEntry from "../types/BookEntry";
import Book from "../types/Book";

const BookEntryComponent: React.FC<BookEntryProps> = ({
  book,
  index,
  showComment = false,
  disabledFields = false,
  onBookChange,
  onRemove,
  isSearchingISBN = false,
  isSearchingTitle = false,
  isbnResults = [],
  titleResults = [],
  activeISBNIndex,
  activeTitleIndex,
}) => {

      const api = {
        baseUrl: "/be",
    
        // Search for a book by ISBN
        async searchISBN(isbn: string, index: number): Promise<[Book[], number]> {
          if (isbn.length < 2) {
            return [[], index];
          }
    
          try {
            const response = await fetch(
              `${this.baseUrl}/getExistingBooks.php?ISBN=${isbn}`
            );
            const data = await response.json();
            return [data, index];
          } catch (error) {
            console.error("Error searching ISBN:", error);
            return [[], index];
          }
        },
    
        async searchTitle(title: string, index: number): Promise<[Book[], number]> {
          if (title.length < 2) {
            return [[], index];
          }
    
          try {
            const response = await fetch(
              `${this.baseUrl}/getExistingBooks.php?title=${encodeURIComponent(
                title
              )}`
            );
            const data = await response.json();
            return [data, index];
          } catch (error) {
            console.error("Error searching title:", error);
            return [[], index];
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

  const handleISBNSearch = async (value: string, fieldIndex: number) => {
    handleFieldChange("ISBN", value);
    const [results, resultIndex] = await api.searchISBN(
      value,
      fieldIndex
    );
    return [results, resultIndex];
  };

  const handleTitleSearch = async (value: string, fieldIndex: number) => {
    handleFieldChange("Title", value);
    const [results, resultIndex] = await api.searchTitle(
      value,
      fieldIndex
    );
    return [results, resultIndex];
  };

  const handleBookSelect = (result: Book) => {
    onBookChange(
      {
        ...book,
        ISBN: result.ISBN,
        Title: result.Title,
        Author: result.Author,
        Editor: result.Editor,
        Price_new: result.Price_new,
      },
      index
    );
  };

  return (
    <div className="book-entry">
      <div className="book-header">
        <h3>Book {index + 1}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="remove-book-button"
          >
            Remove
          </button>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>ISBN</label>
          <SearchField
            value={book.ISBN}
            onChange={handleISBNSearch}
            results={activeISBNIndex === index ? isbnResults : []}
            onSelect={handleBookSelect}
            isSearching={isSearchingISBN && activeISBNIndex === index}
            placeholder="Enter ISBN"
            index={index}
            disabled={disabledFields}
          />
        </div>

        <div className="form-field">
          <label>Title</label>
          <SearchField
            value={book.Title}
            onChange={handleTitleSearch}
            results={activeTitleIndex === index ? titleResults : []}
            onSelect={handleBookSelect}
            isSearching={isSearchingTitle && activeTitleIndex === index}
            placeholder="Enter book title"
            index={index}
            disabled={disabledFields}
          />
        </div>

        <div className="form-field">
          <label>Author</label>
          <input
            type="text"
            value={book.Author}
            onChange={(e) => handleFieldChange("Author", e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={disabledFields}
          />
        </div>

        <div className="form-field">
          <label>Editor</label>
          <input
            type="text"
            value={book.Editor}
            onChange={(e) => handleFieldChange("Editor", e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={disabledFields}
          />
        </div>

        <div className="form-field">
          <label>Price</label>
          <input
            type="number"
            value={book.Price_new}
            onChange={(e) =>
              handleFieldChange("Price_new", Number(e.target.value))
            }
            className="w-full p-2 border rounded"
            required
            step="0.01"
            disabled={disabledFields}
          />
        </div>

        <div className="form-field">
          <label>Condition</label>
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
            disabled={disabledFields}
          >
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="bad">Bad</option>
          </select>
        </div>

        {showComment && (
          <div className="form-field" style={{ gridColumn: "span 2" }}>
          <label>Add a comment if needed</label>
          <input
            type="text"
            value={book.Comment}
            onChange={(e) => handleFieldChange("Comment", e.target.value)}            
            // className="w-full p-2 border rounded"
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default BookEntryComponent;
