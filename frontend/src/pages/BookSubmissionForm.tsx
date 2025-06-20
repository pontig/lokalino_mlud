// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/SubmissionForm.css";
import BookEntry from "../types/BookEntry";
import Book from "../types/Book";
import School from "../types/School";
import BookEntryComponent from "../components/BookEntry";

interface PersonalInfo {
  Nome: string;
  Cognome: string;
  Email: string;
  N_telefono: string;
  Istituto: string;
  Mail_list: boolean;
  Periodo: number;
}

interface Period {
  P_id: number;
  Description: string;
  Num_Providers: number;
}

const BookSubmissionForm: React.FC = () => {
  // API service
  const api = {
    baseUrl: "/be",

    async fetchSchools(): Promise<School[]> {
      const response = await fetch(`${this.baseUrl}/getSchools.php`);
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
      return data;
    },

    async fetchAdoptedBooks(): Promise<Book[]> {
      let data: Book[] = [];
      const response = await fetch(`${this.baseUrl}/getAdoptedBooks.php`);
      if (!response.ok) throw new Error("Failed to fetch adopted books");
      data = (await response.json()) as Book[];
      setAdoptedBooks(data);
      return data;
    },

    async fetchPeriods(): Promise<Period[]> {
      const response = await fetch(
        `${this.baseUrl}/getPeriodsAndAffluences.php`
      );
      if (!response.ok) throw new Error("Failed to fetch periods");
      const data = await response.json();
      setPeriods(data);
      return data;
      // TODO: Handle affluences
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
            Nome: "",
            Cognome: "",
            Istituto: "",
            Email: "",
            N_telefono: "",
            Mail_list: true,
            Periodo: -1,
          });
          setBooks([]);
        }
        const pm = new URLSearchParams({
          name: personalInfo.Nome + " " + personalInfo.Cognome,
          period: selectedPeriod,
        });
        navigate("/thank-you?" + pm.toString());
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  };

  // Navigation and state
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    Nome: "",
    Cognome: "",
    Email: "",
    N_telefono: "",
    Istituto: "",
    Mail_list: true,
    Periodo: -1,
  });
  const [books, setBooks] = useState<BookEntry[]>([
    {
      ISBN: "",
      Title: "",
      Author: "",
      Editor: "",
      Price_new: 0.0,
      Dec_conditions: "",
    },
  ]);
  const [isbnResults, setIsbnResults] = useState<Book[]>([]);
  const [titleResults, setTitleResults] = useState<Book[]>([]);
  const [isSearchingISBN, setIsSearchingISBN] = useState<boolean>(false);
  const [isSearchingTitle, setIsSearchingTitle] = useState<boolean>(false);
  const [activeISBNIndex, setActiveISBNIndex] = useState<number | null>(null);
  const [activeTitleIndex, setActiveTitleIndex] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [acceptRules, setAcceptRules] = useState<boolean>(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<number>(-1);
  const [adoptedBooks, setAdoptedBooks] = useState<Book[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Effects
  useEffect(() => {
    api.fetchSchools();
    api.fetchPeriods();
    api.fetchAdoptedBooks();
  }, []);

  // Functions
  const handlePersonalInfoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const allFieldsFilled =
      personalInfo.Istituto !== "-1" &&
      personalInfo.Periodo !== -1 &&
      Object.values(personalInfo).every((value) => value !== "") &&
      books.every((book) =>
        Object.entries(book).every(([key, value]) => {
          if (key === "Comment") return true;
          if (key === "Price_new") return value > 0.0;
          return value !== "" && value !== 0;
        })
      );

    console.log({ personalInfo, books });
    if (!allFieldsFilled || !acceptTerms || !acceptRules) {
      alert("Inserisci tutte le informazioni necessarie");
      return;
    }
    api.submitForm(personalInfo, books);
  };

  const handleBookChange = (updatedBook: BookEntry, index: number) => {
    const newBooks = [...books];
    newBooks[index] = updatedBook;
    setBooks(newBooks);
  };

  const addBook = () => {
    setBooks([
      ...books,
      {
        ISBN: "",
        Title: "",
        Author: "",
        Editor: "",
        Price_new: 0.0,
        Dec_conditions: "",
        Comment: "",
      },
    ]);
  };

  const removeBook = (index: number) => {
    if (books.length > 1) {
      setBooks(books.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title" style={{ textAlign: "center" }}>
          Vendi libri
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="submission-form">
        {/* Personal Info Section */}
        <div className="personal-info-section">
          <h2>Informazioni di contatto</h2>
          <div className="form-grid">
            {Object.entries(personalInfo).map(
              ([key, value]) =>
                key !== "Mail_list" &&
                key !== "Periodo" && (
                  <div key={key} className="form-field">
                    <label className="block text-sm font-medium mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {key === "Istituto" && "*"}
                    </label>
                    {key === "Istituto" ? (
                      <select
                        name={key}
                        value={value}
                        onChange={(e) => {
                          setPersonalInfo({
                            ...personalInfo,
                            [key]: e.target.value,
                          });
                          setSelectedSchool(Number(e.target.value));
                        }}
                        required
                      >
                        <option value="-1">Seleziona istituto</option>
                        {schools.map((school) => (
                          <option
                            key={school.School_Id}
                            value={school.School_Id}
                          >
                            {school.Name}
                          </option>
                        ))}
                        <option value="-2">Altro</option>
                      </select>
                    ) : (
                      <input
                        type={key === "Email" ? "email" : "text"}
                        name={key}
                        value={value}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    )}
                  </div>
                )
            )}
            <span style={{ fontSize: "0.8rem" }}>
              <br />
              *Se i libri provengono da più istituti, seleziona quello da cui
              proviene il maggior numero di libri
            </span>
          </div>
        </div>

        <p>
          Cerca i libri tramite codice ISBN o titolo, inserisci il prezzo di
          copertina e le condizioni, poi clicca su "Aggiungi libro" per
          inserirne un altro
        </p>

        {/* Books Section */}
        <div className="books-section">
          {books.map((book, index) => (
            <BookEntryComponent
              key={index}
              book={book}
              index={index}
              showComment={false}
              disabledFields={false}
              secondDisabledFields={true}
              onBookChange={handleBookChange}
              onRemove={books.length > 1 ? removeBook : undefined}
              isSearchingISBN={isSearchingISBN}
              isSearchingTitle={isSearchingTitle}
              isbnResults={isbnResults}
              titleResults={titleResults}
              activeISBNIndex={activeISBNIndex}
              activeTitleIndex={activeTitleIndex}
              booksToSearchAmong={adoptedBooks}
            />
          ))}

          <button type="button" onClick={addBook} className="add-book-button">
            Aggiungi un libro
          </button>
        </div>
        <div className="form-field">
          <p
            style={{ color: "red", paddingLeft: 0 }}
            className="custom-checkbox"
            onClick={() => setShowNotFound(true)}
          >
            <u>Non trovi il tuo libro nella lista?</u>
          </p>
          {showNotFound && (
            <div className="terms-and-conditions">
              <h2>Non trovi il tuo libro nella lista?</h2>
              <p>
                Probabilmente non è più in adozione per il prossimo anno e,
                quindi, non possiamo acquistarlo.
                <br />
                🔍 Controlla la lista dei libri del tuo istituto: Se pensi che
                si tratti di un errore, porta comunque il libro al Lokalino. Lo
                verificheremo insieme e valuteremo la situazione.
              </p>
              <button
                className="remove-book-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNotFound(false);
                }}
              >
                Chiudi
              </button>
            </div>
          )}
          {showNotFound && (
            <div
              className="screen"
              onClick={() => setShowNotFound(false)}
            ></div>
          )}
        </div>

        {/* Period Section */}
        <div className="form-field">
          <label className="block text-sm font-medium mb-1">
            Scegli il giorno in cui consegnerai i libri al lokalino. Per ridurre
            l'attesa, scegli un giorno con meno affluenza prevista. La scelta
            del periodo non è vincolante.
          </label>
          <select
            name="period"
            className="period-select"
            value={personalInfo.Periodo}
            onChange={(e) => {
              setPersonalInfo({
                ...personalInfo,
                Periodo: Number(e.target.value),
              });
              const selectedOption = e.target.options[e.target.selectedIndex];
              setSelectedPeriod(selectedOption.text);
            }}
            required
          >
            <option value="-1">Seleziona periodo</option>
            {periods.map((period) => (
              <option key={period.P_id} value={period.P_id}>
                {period.Description} ({period.Num_Providers} persone previste)
              </option>
            ))}
          </select>
          {/* Conditional info about selected period */}
          {personalInfo.Periodo !== -1 &&
            (() => {
              const thresh1 = 10;
              const thresh2 = 20;
              const selected = periods[personalInfo.Periodo - 1];
              if (!selected) return null;
              let color = "";
              if (selected.Num_Providers < thresh1) color = "green";
              else if (selected.Num_Providers < thresh2) color = "orange";
              else color = "red";
              return (
                <div style={{ margin: "1rem", textAlign: "center" }}>
                  <span style={{ color }}>
                    {selected.Num_Providers < thresh1 &&
                      "Giorno poco affollato (previste " +
                        selected.Num_Providers +
                        " persone), ottima scelta!"}
                    {selected.Num_Providers >= thresh1 &&
                      selected.Num_Providers < thresh2 &&
                      "Giorno mediamente affollato (previste " +
                        selected.Num_Providers +
                        " persone)."}
                    {selected.Num_Providers >= thresh2 &&
                      "Giorno molto affollato (previste " +
                        selected.Num_Providers +
                        " persone), valuta se puoi scegliere un altro periodo."}
                  </span>
                </div>
              );
            })()}
        </div>

        {/* Accept Terms + subscribe to newsletter (two flags) */}
        <div className="form-field">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              required
              onClick={() => setAcceptTerms(!acceptTerms)}
            />
            <span className="checkbox-style"></span>Ho letto e accetto {"  "}
            <button
              type="button"
              onClick={() => {
                setShowTerms(true);
              }}
              className="link-button term-link"
            >
              l'informativa sul trattamento dei dati personali
            </button>
          </label>
          {showTerms && (
            <div className="terms-and-conditions">
              <h2>Informazioni sul trattamento dei dati personali</h2>
              <p>
                <strong>INFORMAZIONI SUL TRATTAMENTO DEI DATI PERSONALI</strong>{" "}
                ai sensi dell'art. 13 del{" "}
                <a
                  href="http://www.altalex.com/documents/news/2018/03/05/regolamento-generale-sulla-protezione-dei-dati-gdpr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Regolamento UE 2016/679 (Regolamento generale sulla protezione
                  dei dati)
                </a>
                , di seguito indicato anche come "Regolamento".
                <br />
                <strong>Interessati</strong> (persone cui si riferiscono i dati
                personali): partecipanti al Mercatino dei Libri Usati del centro
                giovanile denominato "Lokalino: spazi per una cultura giovane",
                di seguito indicato anche come "Lokalino" o "Centro".
              </p>

              <ol
                style={{
                  textAlign: "left",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                <li>
                  <strong>
                    IDENTITÀ E DATI DI CONTATTO DEL TITOLARE DEL TRATTAMENTO
                  </strong>
                  <br />
                  Titolare del trattamento dei dati personali è GRANDANGOLO
                  SOCIETA' COOPERATIVA SOCIALE (Codice Fiscale e Partita IVA
                  00523750149), di seguito indicata anche come "Cooperativa",
                  con sede legale in Sondrio (SO), C.A.P. 23100, Via Don
                  Guanella, 19/b - Tel.: 0342/214033 - Fax: 0342/573216 - Email:
                  <a
                    href="mailto:info@grandangolo.coop"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    info@grandangolo.coop
                  </a>{" "}
                  - P.E.C.:
                  <a
                    href="mailto:grandangolo@pec.confcooperative.it"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    grandangolo@pec.confcooperative.it
                  </a>
                </li>

                <li>
                  <strong>
                    DATI DI CONTATTO DEL RESPONSABILE DELLA PROTEZIONE DEI DATI
                    (RPD)
                  </strong>
                  <br />
                  Responsabile della protezione dei dati personali è l'avv.
                  Laura Maestrone - Tel.: 0342/252005 - Email:
                  <a
                    href="mailto:lauramaestrone@fastwebnet.it"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lauramaestrone@fastwebnet.it
                  </a>
                  ; P.E.C.:
                  <a
                    href="mailto:laura.maestrone@sondrio.pecavvocati.it"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    laura.maestrone@sondrio.pecavvocati.it
                  </a>
                </li>

                <li>
                  <strong>
                    FINALITÀ DEL TRATTAMENTO CUI SONO DESTINATI I DATI PERSONALI
                  </strong>
                  <br />
                  Il trattamento dei dati personali è effettuato affinché
                  l'interessato possa accedere all'iniziativa del Mercatino dei
                  libri usati 2025 che verrà organizzata presso gli spazi del
                  Lokalino in Morbegno (SO), Via Strada Comunale di Campagna. Il
                  servizio sarà gestito dalla Cooperativa con il contributo del
                  Comune di Morbegno, della Comunità Montana Valtellina di
                  Morbegno e della Fondazione Enea Mattei.
                </li>

                <li>
                  <strong>DATI OGGETTO DI TRATTAMENTO</strong>
                  <br />
                  Oggetto del trattamento sono i dati necessari per espletare le
                  attività sopra indicate, come dati anagrafici (ad es.
                  nominativo, data e luogo di nascita e residenza/domicilio),
                  recapiti (ad es. numero di telefono fisso e/o mobile,
                  indirizzo di posta elettronica) dell'interessato. In caso di
                  partecipazione ad attività a pagamento, possono essere
                  trattati anche codici fiscali, partite IVA, coordinate
                  bancarie e IBAN.
                  <br />
                  Potrebbero essere trattati anche dati appartenenti a
                  particolari categorie (art. 9 par. 1 del citato Regolamento) e
                  più precisamente dati che rivelano l'origine razziale o etnica
                  dell'interessato, solo se desumibili dalla relativa
                  anagrafica.
                  <br />
                  Il trattamento non comporta alcun processo decisionale
                  automatizzato ed è improntato ai principi di correttezza,
                  liceità e trasparenza e di protezione dei dati; potrà essere
                  effettuato, in conformità a tali principi, sia tramite
                  strumenti elettronici e telematici, che tramite documenti
                  cartacei.
                </li>

                <li>
                  <strong>BASI GIURIDICHE DEL TRATTAMENTO</strong>
                  <br />
                  Ai sensi dell'art. 6, par. 1, lett. b), del Regolamento, il
                  trattamento è necessario per eseguire misure precontrattuali
                  richieste dall'interessato e per adempiere agli obblighi di
                  natura contrattuale relativi all'attività/alle attività a cui
                  l'interessato intende partecipare/partecipa.
                  <br />
                  La Cooperativa chiede inoltre che sia espresso
                  dall'interessato il consenso al trattamento dei suddetti dati
                  personali appartenenti a particolari categorie, ai sensi
                  dell'art. 9, par. 2, lett. a), del Regolamento.
                </li>

                <li>
                  <strong>DESTINATARI DEI DATI PERSONALI</strong>
                  <br />
                  All'interno della Cooperativa, è destinatario dei dati il
                  personale che opera presso il Mercatino dei libri usati.
                  <br />
                  Sono destinatari dei dati anche soggetti esterni alla
                  Cooperativa ossia soggetti che forniscono alla Cooperativa
                  servizi informatici, legali, fiscali. A ciascuna categoria di
                  destinatari sono comunicati i soli dati necessari per
                  l'espletamento delle relative funzioni/mansioni. I dati
                  personali non sono trasferiti verso Paesi terzi, né presso
                  organizzazioni internazionali.
                  <br />
                  Restano salve le ulteriori comunicazioni dovute ai sensi di
                  legge o su disposizione delle Autorità competenti.
                </li>

                <li>
                  <strong>COMUNICAZIONE DEI DATI PERSONALI</strong>
                  <br />
                  L'interessato non è obbligato a fornire i propri dati
                  personali, tuttavia, in mancanza di comunicazione di tali
                  dati, è impossibile appunto usufruire del servizio. Chi
                  rifiuta di sottoporsi al rilievo della temperatura non potrà
                  accedere al Centro e quindi partecipare al mercatino dei
                  libri.
                </li>

                <li>
                  <strong>PERIODO DI CONSERVAZIONE DEI DATI PERSONALI</strong>
                  <br />
                  I dati personali sono conservati per 24 mesi.
                  <br />I dati contenuti nelle eventuali fatture/ricevute e nei
                  documenti contabili sono conservati per 10 anni, ai sensi
                  dell'art. 2220 c.c. In entrambi i casi, il termine di
                  conservazione può essere superiore in presenza di eventuali
                  contenziosi, giudiziali e/o stragiudiziali, e decorrere
                  nuovamente dalla definizione degli stessi.
                </li>

                <li>
                  <strong>DIRITTI DELL'INTERESSATO</strong>
                  <br />
                  L'Interessato/a può rivolgersi alla Titolare del trattamento
                  ai recapiti indicati al punto n. 1 per esercitare i seguenti
                  diritti: di accedere ai dati personali (art. 15 del
                  Regolamento) e ottenere la rettifica (art. 16) o la
                  cancellazione degli stessi (alle condizioni previste dall'art.
                  17) o la limitazione del trattamento che lo riguarda (alle
                  condizioni previste dall'art. 18); inoltre, può opporsi al
                  trattamento (alle condizioni previste dall'art. 21).
                  L'interessato ha diritto alla portabilità dei dati trattati
                  con mezzi automatizzati (art. 20), ossia di ricevere in un
                  formato strutturato, di uso comune e leggibile da dispositivo
                  automatico, i dati personali che lo riguardano forniti al
                  titolare del trattamento e ha il diritto di trasmettere tali
                  dati a un altro titolare del trattamento senza impedimenti da
                  parte del titolare del trattamento cui li ha forniti; ha
                  altresì il diritto di revocare il consenso in qualsiasi
                  momento senza pregiudicare la liceità del trattamento basata
                  sul consenso prestato prima della revoca (art. 7), fermo
                  restando che la revoca del consenso comporta l'impossibilità
                  di proseguire il rapporto con la Cooperativa; il diritto di
                  proporre reclamo all'autorità di controllo Garante per la
                  protezione dei dati personali (art. 77).
                </li>
              </ol>
              <button
                className="remove-book-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(false);
                }}
              >
                Chiudi
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
              required
              onClick={() => setAcceptRules(!acceptRules)}
            />
            <span className="checkbox-style"></span>Ho letto e accetto il {"  "}
            <button
              type="button"
              onClick={() => {
                setShowRules(true);
              }}
              className="link-button term-link"
            >
              Regolamento MLU 2025
            </button>
          </label>
          {showRules && (
            <div className="terms-and-conditions">
              <h2>Regolamento MLU 2025</h2>
              <ol style={{ textAlign: "left", lineHeight: "1.6", fontSize: "0.9rem" }}>
                <li>
                  <strong>Cosa si può vendere?</strong> Tutti i libri di testo adottati nelle scuole superiori di
                  Morbegno, Sondrio, Colico e Chiavenna e nelle scuole medie della bassa Valtellina
                  (istituti di Ardenno, Talamona, Morbegno, Cosio Valtellino, Traona, Delebio -
                  Dubino), che siano ancora in uso nell'anno scolastico 2025-2026.
                </li>
                <li>
                  <strong>Cosa non si può vendere?</strong> Non saranno ammessi alla vendita: testi di natura non
                  didattica e libri che non saranno più in uso nell'anno scolastico 2025/2026. Per
                  essere venduti, i libri devono avere un codice ISBN corrispondente a quello dei testi
                  adottati per il prossimo anno scolastico. Il sistema informatizzato del Mercatino
                  dei Libri Usati 2025 verifica automaticamente se un libro è ancora in adozione
                  per l'anno scolastico 2025/2026 e quindi idoneo alla vendita. L'elenco aggiornato
                  è consultabile nelle schede pubblicate sui siti delle singole scuole.
                </li>
                <li>
                  <strong>Condizioni di partecipazione.</strong> Lo studente, o un familiare incaricato, è tenuto a
                  compilare l'apposita scheda di vendita online, effettuando la ricerca dei libri che
                  intende vendere tramite il titolo o il codice ISBN. Una volta selezionato il volume
                  desiderato, i campi relativi all'autore e all'editore verranno compilati
                  automaticamente dal sistema. Successivamente, sarà necessario inserire il prezzo
                  di copertina, così come indicato sul retro del libro, e specificare le condizioni in cui
                  si trova il volume. In caso di vendita andata a buon fine, al venditore spetterà un
                  importo pari al 50% del prezzo di vendita. Nel caso in cui il codice ISBN inserito
                  non corrisponda a nessun volume presente nel sistema, si invita a verificare le
                  adozioni scolastiche pubblicate sui siti ufficiali degli istituti. Qualora il libro
                  risultasse effettivamente presente nelle liste scolastiche, ma non rilevabile dal
                  sistema informatizzato, è possibile recarsi presso il Lokalino per sottoporre il
                  volume a una verifica diretta da parte degli operatori. In assenza di tale riscontro, i
                  libri saranno considerati NON idonei alla vendita.
                </li>
                <li>
                  <strong>Dati del venditore.</strong> Con l'invio della scheda di vendita online, il venditore si
                  considera a tutti gli effetti consapevole e accettante del regolamento del
                  Mercatino dei Libri Usati 2025. Inoltre, si impegna a ritirare eventuali libri
                  scolastici rimasti invenduti entro e non oltre venerdì 12 settembre 2025. Il
                  mancato ritiro entro tale data comporterà la rinuncia all'intero incasso derivante
                  dalle eventuali vendite effettuate.
                </li>
                <li>
                  <strong>Il servizio del mercatino.</strong> Il mercatino offre, per conto di ciascun venditore, i libri
                  depositati per la vendita al 50% del prezzo di copertina; grazie al contributo del
                  Comune di Morbegno, della Comunità Montana Valtellina di Morbegno e della
                  Fondazione Mattei, i clienti del servizio riceveranno l'intera somma del prezzo di
                  vendita (50% del prezzo di copertina).
                </li>
                <li>
                  L'incasso potrà essere ritirato nel periodo definito al successivo punto 9 del
                  presente regolamento.
                </li>
                <li>
                  Il modulo d'iscrizione può essere compilato sul sito grandangolo.coop o Lokalino
                  a partire da 23 giugno 2025.
                </li>
                <li>
                  I Libri, devono essere consegnati agli operatori del Mercatino, a partire dal 1
                  Luglio, entro e non oltre venerdì 18 Luglio negli orari di apertura del mercatino,
                  presso La sede del Lokalino, in Via Strada Comunale di Campagna (nei pressi
                  dello stadio comunale Merizzi). Oltre la data del 19 luglio 2024 non sarà più
                  possibile consegnare libri da mettere in vendita. Al momento della consegna sarà
                  assegnato un codice personale da apporre tramite delle piccole etichette su tutti i
                  testi. Firmando il modulo di iscrizione al Mercatino il venditore dichiara di accettare
                  il presente regolamento in ogni sua parte.
                </li>
                <li>
                  Gli utenti del servizio dovranno ritirare l'eventuale l'incasso e i libri rimasti
                  invenduti TASSATIVAMENTE nei giorni che vanno da Lunedì 8 a venerdì 12
                  settembre 2025. <strong>OLTRE QUESTA DATA L'INTERO INCASSO SARA'
                  TRATTENUTO E UTILIZZATO PER GLI SCOPI SOCIALI VALUTATI ED
                  INDIVIDUATI COI SOGGETTI SOVVENTORI</strong>
                </li>
              </ol>
              <button
                className="remove-book-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowRules(false);
                }}
              >
                Chiudi
              </button>
            </div>
          )}
          {showRules && (
            <div className="screen" onClick={() => setShowRules(false)}></div>
          )}
        </div>

        <div className="form-field">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              onChange={(e) =>
                setPersonalInfo({
                  ...personalInfo,
                  Mail_list: !e.target.checked,
                })
              }
            />
            <span className="checkbox-style"></span>
            NON voglio ricevere email con le novità del Lokalino
          </label>
        </div>

        <button
          type="submit"
          className="submit-button"
          onClick={handleSubmit}
          style={{ marginTop: "1rem" }}
        >
          Invia
        </button>
      </form>
    </div>
  );
};

export default BookSubmissionForm;
