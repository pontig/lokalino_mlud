import Book from "./Book";

export default interface AvailableBook extends Book {
  PB_Id: number;
  Provider_Id: number;
  Dec_conditions: String;
  ProviderName: String;
  ProviderSurname: String;
  Comment?: String;
}

