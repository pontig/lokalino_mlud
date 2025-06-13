import React from "react";

import "../styles/SubmissionForm.css";
import { Link } from "react-router-dom";

const InsertBooksBatch: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const booksTextArea = form.elements.namedItem(
      "books"
    ) as HTMLTextAreaElement;
    const booksText = booksTextArea.value;

    fetch("/be/admin_book_insert.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ books: booksText }), // send JSON safely
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Response from server:", data);
        alert("Import completato con successo!");
        // reload the page
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Errore durante l'invio");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 style={{ textAlign: "center" }}>Iscritti alla mailing list</h1>
      <div className="search-container">
        <Link to="/backOffice" className="back-button">
          ← Torna alla Dashboard
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <textarea
          name="books"
          className="submission-form"
          style={{ width: "80%", marginLeft: "10%", height: "300px" }}
          placeholder='Inserisci qui i libri nel formato:("ISBN","Titolo","Autore","Editore","Prezzo xx.xx","Nome Scuola",1)'
        ></textarea>
        <button
          type="submit"
          className="submit-button"
          style={{ marginTop: "20px", width: "80%", marginLeft: "10%" }}
        >
          Invia
        </button>
      </form>
    </div>
  );
};

export default InsertBooksBatch;
