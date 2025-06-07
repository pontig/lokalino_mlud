import React from "react";
import SearchFieldProps from "../types/SearchFieldProps";
import Book from "../types/Book";

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  results,
  onSelect,
  isSearching,
  disabled = false,
  placeholder,
  type = "text",
  index,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (type === "text" || /^\d*$/.test(newValue)) {
            onChange(newValue, index);
          }
        }}
        className="w-full p-2 border rounded"
        placeholder={placeholder}
        required
        disabled={disabled}
      />

      {isSearching && (
        <div className="absolute w-full mt-1 text-sm text-gray-500">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="isbn-results">
            {results.map((result: Book) => (
              <button
                key={result.ISBN}
                onClick={() => onSelect(result)}
                className="isbn-result-item"
              >
                <div className="font-medium">{result.Title}</div>
                <div className="text-sm text-gray-600">
                  di {result.Author} • {result.Editor}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && value !== "" && !isSearching && (
        <div className="absolute w-full mt-1 text-sm text-red-500">
          Qui ci scrivo il messaggio ma non ho voglia di formattarlo.
        </div>
      )}
    </div>
  );
};

export default SearchField;
