import React, { useEffect, useState } from "react";
import Person from "../types/Person";
import { Link, useNavigate } from "react-router-dom";

const MailingList: React.FC = () => {
  // API service
  const api = {
    baseUrl: "/be",

    async fetchMailingList(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/mailingList.php`);
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch providers");
      const data = (await response.json()) as Person[];
      setProviders(data);
    },
  };

  // Navigation and state
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Person[]>([]);

  // Effects
  useEffect(() => {
    api.fetchMailingList();
  }, []);

  return (
    <div className="bokstore-container form-container">
      <h1 style={{ textAlign: "center" }}>Iscritti alla mailing list</h1>
      <div className="search-container">
        <Link to="/backOffice" className="back-button">
          ← Torna alla Dashboard
        </Link>
        {/* <input
          type="text"
          placeholder="Search books..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}
      </div>
      <div className="content content-ml">
        {providers.map((provider) => (
          <button
            key={provider.Provider_Id}
            //   onClick={() => handleProviderSelect(provider)}
            className="choice mailing-list"
          >
            {provider.Name} {provider.Surname}
            <br />
            {provider.Email}
          </button>
        ))}
      </div>
      <div className="content content-ml no-gap">
        <h2>Lista più comoda per il copia-incolla</h2>
        {providers.map((provider) => (
          <p>{provider.Email}</p>
        ))}
      </div>
    </div>
  );
};

export default MailingList;
