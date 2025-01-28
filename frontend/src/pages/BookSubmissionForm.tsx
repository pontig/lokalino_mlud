// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/SubmissionForm.css";
import BookEntry from "../types/BookEntry";
import Book from "../types/Book";

interface PersonalInfo {
  Name: string;
  Surname: string;
  School: string;
  Email: string;
  Phone_no: string;
  Mail_list: boolean;
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
    Name: "",
    Surname: "",
    School: "",
    Email: "",
    Phone_no: "",
    Mail_list: false,
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
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const navigate = useNavigate();

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
            Name: "",
            Surname: "",
            School: "",
            Email: "",
            Phone_no: "",
            Mail_list: false,
          });
          setBooks([]);
        }
        const pm = new URLSearchParams({
          name: personalInfo.Name + " " + personalInfo.Surname,
        });
        navigate("/thank-you?" + pm.toString());
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
    const allFieldsFilled =
      Object.values(personalInfo).every((value) => value !== "") &&
      books.every((book) =>
        Object.values(book).every((value) => value !== "" && value !== 0)
      );

    if (!allFieldsFilled || !acceptTerms) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log({ personalInfo, books });
    api.submitForm(personalInfo, books);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title" style={{ textAlign: "center" }}>
          Submit Books
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="submission-form">
        {/* Personal Info Section */}
        <div className="personal-info-section">
          <h2>Personal Information</h2>
          <div className="form-grid">
            {Object.entries(personalInfo).map(
              ([key, value]) =>
                key !== "Mail_list" && (
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
                )
            )}
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

        {/* Accept Terms + subscribe to newsletter (two flags) */}
        <div className="form-field">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              required
              onClick={() => setAcceptTerms(!acceptTerms)}
            />
            <span className="checkbox-style"></span>I accept the {"  "}
            <button
              type="button"
              onClick={() => {
                setShowTerms(true);
              }}
              className="link-button term-link"
            >
              terms and conditions
            </button>
          </label>
          {showTerms && (
            <div className="terms-and-conditions">
              <h2>Terms and Conditions</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas fermentum ex diam, vel tincidunt elit vulputate vel.
                Phasellus ornare accumsan neque vitae scelerisque. Duis erat
                diam, dapibus ac accumsan at, tincidunt eu sem. Proin pharetra
                elit semper venenatis tincidunt. Quisque elementum, nulla quis
                posuere varius, massa purus vulputate ligula, eu ultrices elit
                dui sed mi. Sed in velit vitae odio blandit ultrices sed ut
                lacus. Suspendisse finibus in ante quis laoreet. Vestibulum
                feugiat nunc nec nisi malesuada, at malesuada mauris tempus. Sed
                ut venenatis quam. Vestibulum dictum mauris ut urna scelerisque,
                vel vulputate dui porttitor. Nunc molestie nec nisi ac porta.
                Etiam vitae diam eu nunc imperdiet interdum et eget ipsum.
                Vestibulum elementum arcu at dui pharetra, at vehicula sem
                posuere.
                <br />
                Duis sagittis finibus nisi, ac rutrum mi aliquet in. Aliquam
                feugiat sapien ac diam maximus cursus. Phasellus porttitor nibh
                lacus. Fusce tristique at magna at consectetur. Nullam et ante
                ut risus ultrices pharetra. Donec condimentum nunc eu diam
                fringilla, sit amet tincidunt felis dignissim. Morbi ut tortor
                eget mi porttitor elementum at ac libero.
                <br />
                Vivamus aliquam, justo vel pulvinar gravida, elit est ultrices
                mauris, sit amet aliquam purus tortor eget ante. Etiam blandit
                ultricies porta. Curabitur a est tempus, ultrices leo sed,
                faucibus lorem. Nulla tempor erat ac congue luctus. Cras
                eleifend dolor aliquam tortor bibendum dignissim. Morbi
                imperdiet erat nunc, venenatis rhoncus dolor feugiat id. Ut
                dapibus malesuada massa, mollis eleifend felis facilisis eget.
                Nam id lorem non tortor feugiat hendrerit eu et mauris.
                Pellentesque ipsum ex, dapibus non velit ac, condimentum
                pharetra est. Nullam dui ex, congue pellentesque velit eget,
                suscipit maximus leo.
                <br />
                Ut eget pellentesque augue, ac tempor ante. Ut pellentesque,
                nibh nec porta ultricies, metus leo consequat erat, nec
                hendrerit justo metus condimentum elit. Mauris felis nibh,
                rutrum a facilisis vel, luctus eu diam. Quisque a felis
                condimentum augue hendrerit malesuada. Praesent eget ante ex.
                Aliquam erat volutpat. Proin at tincidunt ante.
                <br />
                Nunc accumsan blandit elementum. Nulla quis velit sed dolor
                hendrerit suscipit nec posuere nunc. Nulla facilisi. Integer
                molestie varius erat id faucibus. Sed sed rhoncus ante. Maecenas
                et justo vel justo rhoncus pellentesque sed vel risus. Nunc
                porttitor aliquam ullamcorper. Cras suscipit sem nisi. Praesent
                consectetur, quam ut ultricies ornare, sapien urna accumsan
                tellus, quis ullamcorper magna lorem ut nulla.
                <br />
                Cras nec diam luctus, lacinia orci venenatis, dapibus felis.
                Mauris posuere velit a blandit bibendum. Nulla sodales aliquet
                lacus, non venenatis arcu scelerisque hendrerit. Nam quis
                efficitur elit. Vestibulum ante ipsum primis in faucibus orci
                luctus et ultrices posuere cubilia curae; Nullam quis euismod
                augue. Ut tincidunt tempus est at lacinia. Nunc lacinia, magna
                quis congue mollis, ligula ex sodales felis, nec laoreet metus
                lacus semper arcu. Class aptent taciti sociosqu ad litora
                torquent per conubia nostra, per inceptos himenaeos. Sed
                pellentesque, urna eu tincidunt auctor, sem mi fringilla nibh,
                vel vulputate dui ligula quis lorem. Aliquam ornare varius ante,
                eget imperdiet ipsum ornare eu. Proin tempor urna vitae felis
                posuere, ac malesuada nunc varius. Nam id tortor sit amet est
                dignissim rhoncus. Curabitur posuere mi a risus malesuada,
                varius pulvinar dui mollis. Donec vel odio vitae libero
                pellentesque aliquet.
                <br />
                Pellentesque et felis accumsan ex elementum sagittis. Integer
                euismod gravida egestas. Fusce ultricies libero at feugiat
                consectetur. Nam vel arcu eget neque luctus gravida. Quisque sed
                ante urna. Sed aliquet dolor porta lacus accumsan cursus. Fusce
                ut ligula ullamcorper, finibus odio at, tempus augue. Aenean ut
                faucibus nunc, eget volutpat nunc. Nam suscipit molestie magna.
                Vestibulum nec magna venenatis, ultrices dolor quis, rutrum est.
                Proin mattis, elit in venenatis ultricies, est ex dictum enim,
                in consequat enim orci mollis velit.
                <br />
                Curabitur tempor urna a ipsum porttitor mollis. Cras malesuada
                blandit neque at pulvinar. Nullam et bibendum velit, sit amet
                condimentum mauris. Cras mollis id augue ut aliquet. Vestibulum
                ac nisl sit amet magna blandit tincidunt. Integer velit lorem,
                dictum at vehicula ut, aliquam vel felis. Cras rhoncus rutrum
                sodales. Fusce ut nibh nibh. Nunc sit amet enim urna. Donec nec
                eleifend tortor, a porta dui. Pellentesque enim nunc, fringilla
                at massa quis, pretium consequat nisi. Morbi sit amet ipsum nec
                orci feugiat mollis at in dolor. Nam vitae varius augue. Quisque
                et tellus ultrices, hendrerit tortor sit amet, euismod magna.
                Vestibulum elementum lacus nec tellus facilisis, et aliquet nibh
                vehicula. Cras vel posuere justo.
                <br />
                Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. Vivamus nec magna convallis,
                aliquet sapien non, molestie enim. Donec scelerisque hendrerit
                fermentum. Integer vel dapibus enim, et rutrum tortor. Donec non
                dolor a libero semper sagittis. Etiam vel pretium dolor, vel
                lacinia nulla. Praesent arcu eros, porta eget mattis sed,
                vestibulum vitae lacus. Vestibulum sit amet ultrices lacus.
                Phasellus ornare ligula non dignissim dignissim. Donec
                ullamcorper feugiat porttitor.
                <br />
                Nulla sodales tortor in pharetra malesuada. Integer eget nulla
                vitae magna maximus semper at nec nunc. Quisque in interdum est,
                sed aliquam ante. Maecenas eget ultricies augue, ut porttitor
                ante. Donec in tincidunt massa, non egestas velit. Donec ut
                varius metus, fermentum luctus sem. Etiam efficitur quis lectus
                sit amet euismod. Interdum et malesuada fames ac ante ipsum
                primis in faucibus. Quisque rhoncus ligula viverra sapien
                viverra, ut placerat velit mollis. Cras facilisis nisl maximus
                volutpat feugiat. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
                <br />
                Proin augue leo, placerat sit amet ornare non, congue vel neque.
                Nam consequat nec leo eget condimentum. Suspendisse potenti.
                Curabitur efficitur libero vitae felis egestas iaculis. Donec
                eget tincidunt erat, ullamcorper malesuada augue. In congue nibh
                et elit posuere, ac luctus risus facilisis. Pellentesque
                condimentum, felis quis tincidunt tempus, lectus orci imperdiet
                enim, in volutpat est justo id justo. Fusce aliquet, lorem non
                viverra porttitor, dolor libero malesuada orci, at feugiat sem
                justo sed urna. Sed feugiat feugiat purus. Maecenas venenatis
                lorem nisl, ut placerat turpis commodo imperdiet. Ut non aliquet
                elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                In eu leo efficitur, maximus ex ac, semper augue. Fusce eget
                ligula non arcu pretium condimentum. Vestibulum ante ipsum
                primis in faucibus orci luctus et ultrices posuere cubilia
                curae;
                <br />
                Duis fringilla ante eu pulvinar consequat. In pretium ante ut
                turpis lobortis tempus. Donec erat ligula, lobortis in
                vestibulum in, maximus at ligula. Sed vulputate, diam eu congue
                egestas, turpis tellus placerat leo, eu consectetur nibh risus
                semper est. Aliquam id sapien lacus. Donec eget nunc at orci
                accumsan dictum at id metus. Maecenas volutpat a nisl ut
                sagittis. Vestibulum nec orci accumsan, vulputate ante quis,
                pulvinar enim. Integer et felis vel augue dapibus mattis finibus
                in arcu. Donec ac rutrum elit.
                <br />
                Donec ullamcorper aliquet faucibus. Donec molestie vehicula
                ligula, vel feugiat massa vehicula et. Suspendisse sapien est,
                consectetur nec malesuada in, eleifend quis lectus. Donec vitae
                aliquam lacus. Curabitur maximus ante consequat, euismod nisl
                non, convallis arcu. Vestibulum venenatis et ipsum eget varius.
                Phasellus sit amet gravida libero. Curabitur leo leo, efficitur
                at venenatis sed, aliquet a ex. Suspendisse mattis commodo
                risus, ac venenatis metus bibendum eget. Nunc vel enim dolor.
                Etiam egestas mauris a est viverra, et congue nisl fermentum.
                Donec in suscipit velit.
                <br />
                Nulla facilisi. Curabitur rhoncus erat vulputate nulla sagittis,
                ac pretium lectus tincidunt. In iaculis elit vitae sapien
                ultrices congue. Class aptent taciti sociosqu ad litora torquent
                per conubia nostra, per inceptos himenaeos. Donec quis feugiat
                arcu, ut vestibulum neque. Mauris varius sed nisi quis
                ullamcorper. Nulla ultrices sit amet libero eget varius. Quisque
                vel est lectus. Etiam pulvinar lobortis malesuada. Donec tempor
                id erat vel pretium. In iaculis sapien felis, in hendrerit lacus
                suscipit porta. Mauris venenatis posuere magna, a interdum augue
                varius ullamcorper. Vestibulum convallis quam nunc, sit amet
                pharetra nibh pretium sed. Vestibulum ante ipsum primis in
                faucibus orci luctus et ultrices posuere cubilia curae;
                <br />
                Nam non dignissim purus. Nam laoreet enim et nisl ultricies
                iaculis. Morbi porta vel nisi sed aliquet. Maecenas blandit
                porttitor mollis. Phasellus convallis dapibus pulvinar. Maecenas
                at dui viverra, pulvinar diam ultricies, vestibulum magna. Nunc
                ut sapien id leo elementum imperdiet eu ac diam.
              </p>
              <button
                className="remove-book-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(false);
                }}
              >
                Close
              </button>
            </div>
          )}
          {showTerms && (
            <div className="screen" onClick={() => setShowTerms(false)}></div>
          )}
        </div>
        <div className="form-field">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              onChange={(e) =>
                setPersonalInfo({
                  ...personalInfo,
                  Mail_list: e.target.checked,
                })
              }
            />
            <span className="checkbox-style"></span>
            Subscribe to newsletter
          </label>
        </div>

        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default BookSubmissionForm;
