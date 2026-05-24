// BookSubmissionForm.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Book from "../types/Book";
import BookEntry from "../types/BookEntry";
import Header from "../components/Header";
import ProviderMicroLogo from "../components/Provider_MicroLogo";
import BookCard from "../components/BookCard";

interface PersonalInfo {
  name: string;
  surname: string;
  donor: number; // Percentage
}

interface Provider {
  Provider_Id: number;
  Name: string;
  Surname: string;
  Donor: number; // Percentage
}

// Mock providers for local development. Uncomment the `setProviders` call
// in the `useEffect` below to use these instead of calling the backend.
const MOCK_PROVIDERS: Provider[] = [
  { Provider_Id: 9101, Name: "Anna", Surname: "Verdi", Donor: 0 },
  { Provider_Id: 9102, Name: "Paolo", Surname: "Neri", Donor: .15 },
];

interface BookEntry_commented extends BookEntry {
  Comment: string;
  Sold_date?: string;
  PB_Id: number;
}

const Liquidate: React.FC = () => {
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
      const res = data.filter((provider: any) => provider.State === "1");
      setProviders(res);
      return
    },

    async submitForm(): Promise<void> {
      const requestBody = {
        Provider_Id: selectedProvider,
      };

      const response = await fetch(`${this.baseUrl}/liquidateProvider.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.status === 200) {
        console.log("Provider liquidated");
        setSelectedProvider(null);
        navigate("/backOffice");
      } else {
        console.log("Liquidation failed");
      }
    },

    async getBooksByProvider(providerId: number): Promise<{
      personalInfo: PersonalInfo;
      books: BookEntry_commented[];
      liquidation: number;
    }> {
      const response = await fetch(
        `${this.baseUrl}/getBooksByProvider.php?Provider_Id=${providerId}`
      );
      if (response.status === 401) {
        navigate("/login");
        return {
          personalInfo: { name: "", surname: "", donor: 0.0 },
          books: [],
          liquidation: 0,
        };
      }
      if (!response.ok) throw new Error("Failed to fetch provider books");
      const data = await response.json();

      return {
        personalInfo: {
          name: data.provider[0].Name || "",
          surname: data.provider[0].Surname || "",
          donor: data.provider[0].Donor || 0.0,
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

  // Navigation and state
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    surname: "",
    donor: 0.0
  });
  const [books, setBooks] = useState<BookEntry_commented[]>([
    {
      ISBN: "",
      Title: "",
      Author: "",
      Editor: "",
      Price_new: 0.0,
      Dec_conditions: "Buono",
      Comment: "",
      Sold_date: undefined,
      PB_Id: -1,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liquidation, setLiquidation] = useState<number>(0);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Effects
  useEffect(() => {
    api.fetchProviders();
    // For local mock during development: uncomment the following line
    // to use hardcoded providers instead of the backend fetch.
    // setProviders(MOCK_PROVIDERS);
  }, []);

  // Functions
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

  const filteredProviders = providers.filter((provider) =>
    `${provider.Name} ${provider.Surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!selectedProvider) {
    return (
      <div className="bokstore-container form-container">
        <Header title={"Seleziona un venditore"}
          hasSearchBox={true}
          value={searchQuery}
          onPassedChange={setSearchQuery}
          onLinkClick={async () => await navigate("/backOffice")}
        />
        <div className="content">

          {
            filteredProviders.length === 0 ? (
              <div className="empty-message">
                Nessun venditore trovato
              </div>) : (filteredProviders.map((provider) => (
                <button
                  key={provider.Provider_Id}
                  onClick={() => handleProviderSelect(provider)}
                  className="choice-with-logo"
                >
                  <ProviderMicroLogo providerId={provider.Provider_Id} name={provider.Name} surname={provider.Surname} inline={false} />
                </button>
              )))}
        </div>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    api.submitForm();
  };

  if (isLoading) {
    return <div>Loading form data...</div>;
  }

  return (
    <div className="form-container">
      <Header
        title={`Riepilogo per (ID#${selectedProvider.Provider_Id}) ${selectedProvider.Name} ${selectedProvider.Surname}`}
        hasSearchBox={false}
        onLinkClick={() => setSelectedProvider(null)}
      />

      <div className="search-container">
        <h2 style={{ textAlign: "center" }} className="form-title">
          Soldi ricavati dai suoi libri: €{liquidation.toFixed(2)}
        </h2>
        {(selectedProvider && Number(selectedProvider.Donor) !== 0) ? (
          <>
            {/* <p>{Number(selectedProvider.Donor)} {selectedProvider.Donor}</p> */}
            <p>ha deciso di ✨donare✨ il {Number(selectedProvider.Donor) * 100}% del suo ricavato
            quindi il totale dovutogli è €{(liquidation * (1 - Number(selectedProvider.Donor))).toFixed(2)}.<br />
            Preparare modulo per la donazione di €{(liquidation * Number(selectedProvider.Donor)).toFixed(2)}</p>
          </>
        ) : <></>}
      </div>

      <div className="content">
        <h2>Libri invenduti</h2>
        {books.map((book) => (
          <BookCard
            PB_Id={book.PB_Id}
            Title={book.Title}
            Author={book.Author}
            ISBN={book.ISBN}
            Editor={book.Editor}
            Dec_conditions={book.Dec_conditions}
            Comment={book.Comment}
            Price_new={book.Price_new}
          />
        ))}

        {books.length === 0 && (
          <div className="empty-message">✨Yay! ha venduto tutti i suoi libri✨</div>
        )}
      </div>
      <div className="search-container" style={{ gridTemplateColumns: "1fr" }}>
        {!confirming && (
          <button
            type="submit"
            className="submit-button"
            onClick={() => setConfirming(true)}
          >
            Contrassegna come liquidato
          </button>
        )}

        {confirming && (
          <div className="confirm">
            <div className="confirm-message">
              <p style={{ textAlign: "center" }}>
                Sicuro sicuro sicuro?? Va che non si torna indietro
              </p>
            </div>
            <div className="confirm-buttons">
              <button
                className="cart-button cart-button-remove confirm-button"
                onClick={() => setConfirming(false)}
              >
                Non coooosì sicuro
              </button>
              <button
                className="cart-button cart-button-add confirm-button"
                onClick={handleSubmit}
              >
                Sicuro è il mio secondo nome
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liquidate;
