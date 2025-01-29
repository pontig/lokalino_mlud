import Book from "./Book";
import BookEntry from "./BookEntry";

export default interface BookEntryProps {
  book: BookEntry;
  index: number;
  showComment?: boolean;
  disabledFields?: boolean;
  onBookChange: (book: BookEntry, index: number) => void;
  onRemove?: (index: number) => void;
  isSearchingISBN?: boolean;
  isSearchingTitle?: boolean;
  isbnResults?: Book[];
  titleResults?: Book[];
  activeISBNIndex?: number | null;
  activeTitleIndex?: number | null;
}
