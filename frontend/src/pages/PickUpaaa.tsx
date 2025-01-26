import React from "react";
import Provider from "../types/Provider";
import AvailableBook from "../types/AvailableBook";

const PickUp: React.FC = () => {
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [chosenProviderId, setChosenProviderId] = React.useState<number | null>(
    null
  );
  const [booklist, setBooklist] = React.useState<AvailableBook[]>([]);

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

    async getBooksFromProvider(providerId: number): Promise<AvailableBook[]> {
      try {
        const response = await fetch(
          `${this.baseUrl}/getBooksByProvider.php?Procid=${providerId}`
        );
        const data: AvailableBook[] =
          (await response.json()) as AvailableBook[];
        setBooklist(data);
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  };

  React.useEffect(() => {
    api.getProvidersFromWhichPickUp().then((data) => setProviders(data));
  }, []);

  React.useEffect(() => {
    if (chosenProviderId !== null) {
      api.getBooksFromProvider(chosenProviderId);
    }
  }, [chosenProviderId]);

  if (chosenProviderId == null)
    return (
      <div className="bookstore-container">
        <h1>Providers from which you can pick up the order</h1>
        {providers.map((provider) => (
          <div className="choice" key={provider.Provider_Id}>
            <p>{provider.Name}</p>
            <p>{provider.Surname}</p>
          </div>
        ))}
      </div>
    );
  else {
    return (
      <div className="bookstore-container">
        <h1>Books available for pick up</h1>
        <div className="book">
          {booklist.map((book) => (
            <div className="book-entry">
              <div className="form-grid">
                <div className="form-field">
                  <label>ISBN</label>
                  <input
                    type="text"
                    value={book.ISBN}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].ISBN = e.target.value;
                      setBooklist(newBooks);
                    }}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={book.Title}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].Title = e.target.value;
                      setBooklist(newBooks);
                    }}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Author</label>
                  <input
                    type="text"
                    value={book.Author}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].Author = e.target.value;
                      setBooklist(newBooks);
                    }}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Editor</label>
                  <input
                    type="text"
                    value={book.Editor}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].Editor = e.target.value;
                      setBooklist(newBooks);
                    }}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Price</label>
                  <input
                    type="number"
                    value={book.Price_new}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].Price_new = Number(
                        e.target.value
                      );
                      setBooklist(newBooks);
                    }}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Condition</label>
                  <select
                    value={(book.Dec_conditions).toString()}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].Dec_conditions =
                        e.target.value;
                      setBooklist(newBooks);
                    }}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="form-field">
                  
                  <label>Editor</label>
                  <input
                    type="text"
                    value={book.Editor}
                    onChange={(e) => {
                      const newBooks = [...booklist];
                      newBooks[booklist.indexOf(book)].Editor = e.target.value;
                      setBooklist(newBooks);
                    }}
                    required
                  />
                </div>


              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default PickUp;
