import Book from "./Book";

export default interface SearchFieldProps {
  value: string;
  onChange: (value: string, index: number) => void;
  results: Book[];
  onSelect: (result: Book, index: number) => void;
  isSearching: boolean;
  placeholder?: string;
  type?: string;
  index: number;
}