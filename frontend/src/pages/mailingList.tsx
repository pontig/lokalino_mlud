import React, { useEffect, useState } from "react";
import Person from "../types/Person";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProviderMicroLogo from "../components/Provider_MicroLogo";

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
            <Header
        title={"Iscritti alla mailing list"}
        hasSearchBox={false}
        onLinkClick={async () => navigate("/backOffice")}
      />
      <div className="content content-ml no-gap">
        <h2>Lista più comoda per il copia-incolla</h2>
        {providers.map((provider) => provider.Email).join(", ")}
      </div>
      <div className="content content-ml">
        {providers.map((provider) => (
          <ProviderMicroLogo 
          providerId={provider.Provider_Id} 
          name={provider.Name + " " + provider.Surname} 
          surname={provider.Email} 
          inline={false} />
          // <button
          //   key={provider.Provider_Id}
          //   //   onClick={() => handleProviderSelect(provider)}
          //   className="choice mailing-list"
          // >
          //   {provider.Name} {provider.Surname}
          //   <br />
          //   {provider.Email}
          // </button>
        ))}
      </div>
    </div>
  );
};

export default MailingList;
