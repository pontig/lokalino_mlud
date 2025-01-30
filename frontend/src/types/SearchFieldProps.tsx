import Book from "./Book";

export default interface SearchFieldProps {
  value: string;
  onChange: (value: string, index: number) => void;
  results: Book[];
  onSelect: (book: Book) => void;
  isSearching: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  index: number;
}