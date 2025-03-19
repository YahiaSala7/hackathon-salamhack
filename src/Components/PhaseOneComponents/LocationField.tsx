import React, { useRef, useCallback } from "react";
import { FormField, InputField } from "./FormComponents";
import { LocationSuggestion } from "./types";
import debounce from "lodash/debounce";
import { toast } from "react-hot-toast";

interface LocationFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  suggestions: LocationSuggestion[];
  showSuggestions: boolean;
  onSuggestionSelect: (suggestion: LocationSuggestion) => void;
  onShowSuggestionsChange: (show: boolean) => void;
  onSuggestionsChange: (suggestions: LocationSuggestion[]) => void;
}

const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-text/60">
    <path
      d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export const LocationField: React.FC<LocationFieldProps> = ({
  value,
  onChange,
  error,
  suggestions,
  showSuggestions,
  onSuggestionSelect,
  onShowSuggestionsChange,
  onSuggestionsChange,
}) => {
  const locationInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length < 3) {
        onSuggestionsChange([]);
        return;
      }

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      )
        .then((response) => response.json())
        .then((data) => {
          const filteredData = data.filter((item: LocationSuggestion) => {
            const address = item.address;
            return (
              (address.city ||
                address.town ||
                address.village ||
                address.state) &&
              address.country
            );
          });
          onSuggestionsChange(filteredData);
          onShowSuggestionsChange(true);
        })
        .catch((error) => {
          console.error("Error fetching locations:", error);
        });
    }, 300),
    [onSuggestionsChange, onShowSuggestionsChange]
  );

  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange(value);
      if (value) {
        debouncedSearch(value);
      } else {
        onSuggestionsChange([]);
      }
    },
    [onChange, debouncedSearch, onSuggestionsChange]
  );

  const handleLocationSelect = useCallback(
    (suggestion: LocationSuggestion) => {
      const address = suggestion.address;
      let displayName = "";

      if (address.city) {
        displayName = `${address.city}, ${address.state || address.country}`;
      } else if (address.town) {
        displayName = `${address.town}, ${address.state || address.country}`;
      } else if (address.village) {
        displayName = `${address.village}, ${address.state || address.country}`;
      } else if (address.state) {
        displayName = `${address.state}, ${address.country}`;
      } else {
        toast.error("Please select a specific city, governorate, or village");
        return;
      }

      onSuggestionSelect(suggestion);
      onChange(displayName);
      onShowSuggestionsChange(false);
      onSuggestionsChange([]);
    },
    [onSuggestionSelect, onChange, onShowSuggestionsChange, onSuggestionsChange]
  );

  return (
    <FormField label="Location" icon={<LocationIcon />}>
      <div className="relative">
        <input
          ref={locationInputRef}
          type="text"
          placeholder={error || "Enter your city, governorate, or village"}
          className={`w-full p-4 rounded-[4px] focus:outline-none ${
            error
              ? "bg-error/5 text-error placeholder-error/80 font-medium"
              : "bg-white placeholder:text-text/60"
          }`}
          value={value}
          onChange={handleLocationChange}
          onFocus={() => {
            if (value.length >= 3) {
              onShowSuggestionsChange(true);
            }
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-[4px] shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                className="px-4 py-3 cursor-pointer hover:bg-background"
                onClick={() => handleLocationSelect(suggestion)}>
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
};
