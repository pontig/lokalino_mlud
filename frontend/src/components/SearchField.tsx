import React from 'react';
import  SearchFieldProps  from '../types/SearchFieldProps';

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  results,
  onSelect,
  isSearching,
  disabled = false,
  placeholder,
  type = "text",
  index
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
            {results.map((result: any) => (
              <button
                key={result.ISBN}
                onClick={() => onSelect(result, index)}
                className="isbn-result-item"
              >
                <div className="font-medium">{result.Title}</div>
                <div className="text-sm text-gray-600">
                  by {result.Author} • {result.Editor}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchField;