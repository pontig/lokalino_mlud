// InsertBooks.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import Book from "../types/Book";
import BookEntryComponent from "../components/BookEntry";
import BookEntry from "../types/BookEntry";

// interface ISBNLookupFieldProps {
//   value: string;
//   onChange: (value: string) => void;
//   results: Book[];
//   onSelect: (result: Book) => void;
//   isSearching: boolean;
// }

// const ISBNLookupField: React.FC<ISBNLookupFieldProps> = ({
//   value,
//   onChange,
//   results,
//   onSelect,
//   isSearching,
// }) => {
//   return (
//     <div className="relative w-full">
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => {
//           const newValue = e.target.value;
//           if (/^\d*$/.test(newValue)) {
//             onChange(newValue);
//           }
//         }}
//         className="w-full p-2 border rounded"
//         placeholder="no spaces or dashes"
//         required
//       />

//       {isSearching && (
//         <div className="absolute w-full mt-1 text-sm text-gray-500">
//           Searching...
//         </div>
//       )}

//       {results.length > 0 && (
//         <div>
//           <div className="isbn-results">
//             {results.map((result) => (
//               <button
//                 key={result.ISBN}
//                 onClick={() => onSelect(result)}
//                 className="isbn-result-item"
//               >
//                 <div className="font-medium">{result.Title}</div>
//                 <div className="text-sm text-gray-600">
//                   by {result.Author} • {result.Editor}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

const InsertBooks: React.FC = () => {
  const [books, setBooks] = useState<BookEntry>({
    ISBN: "",
    Title: "",
    Author: "",
    Editor: "",
    Price_new: 0.0,
    Dec_conditions: "New",
  });
  // const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  // const [isSearching, setIsSearching] = useState<boolean>(false);
  // const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);

  const [isSearchingISBN, setIsSearchingISBN] = useState<boolean>(false);
  const [isSearchingTitle, setIsSearchingTitle] = useState<boolean>(false);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [titleResults, setTitleResults] = useState<Book[]>([]);

  const api = {
    baseUrl: "/be",

    // Search for a book by ISBN
    // async searchISBN(isbn: string): Promise<void> {
    //   if (isbn.length < 2) {
    //     setIsbnResults([]);
    //     return;
    //   }

    //   setIsSearching(true);

    //   try {
    //     const response = await fetch(
    //       `${this.baseUrl}/getExistingBooks.php?ISBN=${isbn}`
    //     );
    //     const data: Book[] = await response.json();
    //     setIsbnResults(data);
    //   } catch (error) {
    //     console.error("Error searching ISBN:", error);
    //     setIsbnResults([]);
    //   } finally {
    //     setIsSearching(false);
    //   }
    // },

    async submitForm(book: Book): Promise<void> {
      try {
        const requestBody = { book };

        const response = await fetch(`${this.baseUrl}/enterBook.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 200) {
          setBooks({
            ISBN: "",
            Title: "",
            Author: "",
            Editor: "",
            Price_new: 0.0,
            Dec_conditions: "New",
          });
          alert("Book submitted successfully!");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  };

  const handleBookSelect = (result: BookEntry, index = 0): void => {
    const newBooks = {
      ISBN: result.ISBN,
      Title: result.Title,
      Author: result.Author,
      Editor: result.Editor,
      Price_new: result.Price_new,
      Dec_conditions: "",
    };
    setBooks(newBooks);
    // setIsbnResults([]);
    // setActiveISBNIndex(null);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log({ books });
    api.submitForm(books);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Link to="/" className="back-button">
          ← Back to Main
        </Link>
        <h1 className="form-title">Pisello Submit Books</h1>
      </div>
      <form onSubmit={handleSubmit} className="submission-form">
        <div className="books-section">
          <BookEntryComponent
            book={books}
            index={0}
            showComment={false}
            disabledFields={false}
            onBookChange={(book: BookEntry) => handleBookSelect(book, 0)}
            isSearchingISBN={isSearchingISBN}
            isSearchingTitle={isSearchingTitle}
            showConditions={false}
          />
        </div>

        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default InsertBooks;
