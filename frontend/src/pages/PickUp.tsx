import React from "react";
import Provider from "../types/Provider";

const PickUp: React.FC = () => {
  const api = {
    baseUrl: "https://pontiggiaelia.altervista.org/be",

    async getProvidersFromWhichPickUp(): Promise<Provider[]> {
      try {
        const response = await fetch(`${this.baseUrl}/getProviders.php`);
        const data: Provider[] = (await response.json()) as Provider[];
        data.forEach((provider) => {
          provider.State = Number(provider.State);
        });
        const ret: Provider[] = data.filter((provider) => provider.State === 0);
        return ret;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  };

  const [providers, setProviders] = React.useState<Provider[]>([]);

  React.useEffect(() => {
    api.getProvidersFromWhichPickUp().then((data) => setProviders(data));
  }, []);

  return (
    <div className="cart-button-add">
      <h1>Providers from which you can pick up the order</h1>
      <ul>
        {providers.map((provider) => (
          <li key={provider.Provider_Id}>
            {provider.Name} - {provider.Surname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PickUp;
