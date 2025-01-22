import Book from "./Book";

interface AvailableBook extends Book {
  PB_Id: number;
  Dec_conditions: String;
  ProviderName: String;
  ProviderSurname: String;
  Comment?: String;
}

export default AvailableBook;
