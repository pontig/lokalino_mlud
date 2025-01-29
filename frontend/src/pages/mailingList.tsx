import React, { useEffect, useState } from "react";
import Person from "../types/Person";
import { Link } from "react-router-dom";

const MailingList: React.FC = () => {
  const [providers, setProviders] = useState<Person[]>([]);
  const api = {
    baseUrl: "/be",

    async fetchMailingList(): Promise<void> {
      const response = await fetch(`${this.baseUrl}/mailingList.php`);
      if (!response.ok) throw new Error("Failed to fetch providers");
      const data = (await response.json()) as Person[];
      setProviders(data);
    },
  };

  useEffect(() => {
    api.fetchMailingList();
  }, []);

  return (
    <div className="bokstore-container form-container">
      <h1 style={{ textAlign: "center" }}>Select a provider</h1>
      <div className="search-container">
        <Link to="/" className="back-button">
          ← Back to Main
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
        <h2>List to copy-paste more easily</h2>
        {providers.map((provider) => (
          <p>{provider.Email}</p>
        ))}
      </div>
    </div>
  );
};

export default MailingList;
