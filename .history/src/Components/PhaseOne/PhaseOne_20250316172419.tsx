"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/formData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHomeSubmission } from "@/hooks/useHomeSubmission";
import { Toaster } from "react-hot-toast";
import debounce from "lodash/debounce";
import { toast } from "react-hot-toast";

// Add this type for location suggestions
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

// Form validation schema
const formSchema = z.object({
  currency: z.enum(["USD", "EUR", "GBP"], {
    errorMap: () => ({ message: "Please select a currency" }),
  }),
  budget: z
    .number({
      required_error: "Budget is required",
      invalid_type_error: "Please enter a valid number",
    })
    .min(1000, "Budget must be at least 1,000")
    .max(1000000000, "Budget cannot exceed 1 billion")
    .refine((val) => val > 0, "Budget must be a positive number"),

  areaUnit: z.enum(["m²", "ft²"], {
    errorMap: () => ({ message: "Please select an area unit" }),
  }),
  area: z
    .number({
      required_error: "Home area is required",
      invalid_type_error: "Please enter a valid number",
    })
    .min(10, "Home area must be at least 10 square meters/feet")
    .max(100000, "Home area seems too large. Please check your input")
    .refine((val) => val > 0, "Area must be a positive number"),

  bedrooms: z
    .number({
      required_error: "Number of bedrooms is required",
      invalid_type_error: "Please enter a valid number",
    })
    .min(1, "At least 1 bedroom is required")
    .max(50, "Number of bedrooms seems too high. Please check your input")
    .int("Please enter a whole number")
    .refine((val) => val > 0, "Number of bedrooms must be positive"),

  bathrooms: z
    .number({
      required_error: "Number of bathrooms is required",
      invalid_type_error: "Please enter a valid number",
    })
    .min(1, "At least 1 bathroom is required")
    .max(50, "Number of bathrooms seems too high. Please check your input")
    .int("Please enter a whole number")
    .refine((val) => val > 0, "Number of bathrooms must be positive"),

  livingRoom: z
    .number({
      required_error: "Number of living rooms is required",
      invalid_type_error: "Please enter a valid number",
    })
    .min(0, "Number of living rooms cannot be negative")
    .max(10, "Number of living rooms seems too high. Please check your input")
    .int("Please enter a whole number"),

  kitchen: z
    .number({
      required_error: "Number of kitchens is required",
      invalid_type_error: "Please enter a valid number",
    })
    .min(0, "Number of kitchens cannot be negative")
    .max(10, "Number of kitchens seems too high. Please check your input")
    .int("Please enter a whole number"),

  otherRooms: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val && val.length <= 100),
      "Description is too long. Please keep it under 100 characters"
    ),

  location: z
    .string({
      required_error: "Please select your city, governorate, or village",
    })
    .min(1, "Please select your city, governorate, or village")
    .refine(
      (val) => val !== "",
      "Please select your city, governorate, or village"
    )
    .refine((val) => {
      // Check if the location contains a comma (indicating city/state format)
      return val.includes(",");
    }, "Please select a specific city, governorate, or village, not just a country"),

  style: z
    .string({
      required_error: "Please select a style preference",
    })
    .min(1, "Please select your style preference")
    .refine((val) => val !== "", "Please select your style preference"),
});

// Custom dropdown component
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  error,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center justify-between w-full p-4 rounded-[4px] cursor-pointer ${
          error ? "bg-error/10" : "bg-background"
        }`}
        onClick={() => setIsOpen(!isOpen)}>
        <span className={error ? "text-error" : "text-text"}>
          {selectedOption?.label || error || placeholder || "Select..."}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            error ? "text-error" : "text-text/60"
          } ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-[4px] shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-3 cursor-pointer hover:bg-background"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable form field components
const FormField = ({
  label,
  error,
  children,
  icon,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <label className="text-sm font-medium text-heading">{label}</label>
      {icon}
    </div>
    {children}
  </div>
);

const InputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ error, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full p-4 bg-background rounded-[4px] focus:outline-none ${
      error ? "text-error placeholder-error/60" : "placeholder:text-text/60"
    }`}
    placeholder={error || props.placeholder}
  />
));

const CombinedField = ({
  prefix,
  prefixOptions,
  prefixValue,
  onPrefixChange,
  inputProps,
  error,
}: {
  prefix: "currency" | "unit";
  prefixOptions: { value: string; label: string }[];
  prefixValue: string;
  onPrefixChange: (value: string) => void;
  inputProps: any;
  error?: string;
}) => (
  <div className="relative flex bg-background rounded-[4px]">
    <div
      className="relative"
      style={{ width: prefix === "currency" ? "80px" : "60px" }}>
      <CustomSelect
        options={prefixOptions}
        value={prefixValue}
        onChange={onPrefixChange}
        className="rounded-r-none"
      />
    </div>
    <div className="w-px bg-text/20" />
    <InputField
      {...inputProps}
      error={error}
      className="flex-1 bg-transparent rounded-l-none"
    />
  </div>
);

// LocationIcon component
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

function PhaseOne() {
  const [currency, setCurrency] = useState("USD");
  const [areaUnit, setAreaUnit] = useState("m²");
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const { mutate: submitHome, isPending } = useHomeSubmission();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      currency: "USD",
      areaUnit: "m²",
      livingRoom: 1,
      kitchen: 1,
    },
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      )
        .then((response) => response.json())
        .then((data) => {
          // Filter suggestions to only include cities, towns, villages, and states
          const filteredData = data.filter((item: LocationSuggestion) => {
            const address = item.address;
            // Ensure we have a city, town, village, or state, and not just a country
            return (
              (address.city ||
                address.town ||
                address.village ||
                address.state) &&
              address.country
            );
          });
          setSuggestions(filteredData);
          setShowSuggestions(true);
        })
        .catch((error) => {
          console.error("Error fetching locations:", error);
        });
    }, 300),
    []
  );

  // Optimize location input handler
  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocation(value);
      setValue("location", value);
      if (value) {
        clearErrors("location");
        debouncedSearch(value);
      } else {
        setSuggestions([]);
      }
    },
    [setValue, clearErrors, debouncedSearch]
  );

  // Optimize location selection handler
  const handleLocationSelect = useCallback(
    (suggestion: LocationSuggestion) => {
      const address = suggestion.address;
      let displayName = "";

      // Ensure we have a specific location before setting the value
      if (address.city) {
        displayName = `${address.city}, ${address.state || address.country}`;
      } else if (address.town) {
        displayName = `${address.town}, ${address.state || address.country}`;
      } else if (address.village) {
        displayName = `${address.village}, ${address.state || address.country}`;
      } else if (address.state) {
        displayName = `${address.state}, ${address.country}`;
      } else {
        // If no specific location is found, show an error
        toast.error("Please select a specific city, governorate, or village");
        return;
      }

      setLocation(displayName);
      setValue("location", displayName);
      setShowSuggestions(false);
      setSuggestions([]);
      clearErrors("location");
    },
    [setValue, clearErrors]
  );

  // Optimize style selection handler
  const handleStyleChange = useCallback(
    (value: string) => {
      setStyle(value);
      setValue("style", value);
      clearErrors("style");
    },
    [setValue, clearErrors]
  );

  // Optimize currency change handler
  const handleCurrencyChange = useCallback(
    (value: string) => {
      setCurrency(value);
      setValue("currency", value as "USD" | "EUR" | "GBP");
    },
    [setValue]
  );

  // Optimize area unit change handler
  const handleAreaUnitChange = useCallback(
    (value: string) => {
      setAreaUnit(value);
      setValue("areaUnit", value as "m²" | "ft²");
    },
    [setValue]
  );

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);
    try {
      submitHome(data, {
        onSuccess: () => {
          console.log("Submission successful");
          reset();
          setCurrency("USD");
          setAreaUnit("m²");
          setLocation("");
          setStyle("");
        },
        onError: (error) => {
          console.error("Submission error:", error);
        },
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  // Add this to check form state
  const onFormSubmit = handleSubmit(
    (data) => {
      console.log("Form validation passed, calling onSubmit");
      onSubmit(data);
    },
    (errors) => {
      console.log("Form validation failed:", errors);
    }
  );

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
  ];

  const areaUnitOptions = [
    { value: "m²", label: "m²" },
    { value: "ft²", label: "ft²" },
  ];

  const styleOptions = [
    { value: "", label: "Select Your Style Preferences" },
    { value: "modern", label: "Modern" },
    { value: "classic", label: "Classic" },
  ];

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <div className="px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl text-heading">Logo</h1>
          <Breadcrumb pageName="Planning" />
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-6 text-left lg:text-left sm:text-center m-auto">
            <h1 className="text-4xl lg:text-[56px] font-bold leading-tight text-heading">
              Define Your Dream Home Effortlessly.
            </h1>
            <p className="text-lg text-text font-heading">
              Our AI-driven planner helps you design your home effortlessly by
              generating personalized furniture recommendations, budget
              allocations, and price comparisons—all in one place!
            </p>
            <p className="font-extrabold tracking-[3px] text-text/60 text-sm">
              SUBMIT YOUR DATA AND GET STARTED
            </p>
          </div>

          <form
            onSubmit={onFormSubmit}
            className="w-full max-w-xl mx-auto space-y-4 lg:mx-0">
            <FormField label="Budget">
              <CombinedField
                prefix="currency"
                prefixOptions={currencyOptions}
                prefixValue={currency}
                onPrefixChange={handleCurrencyChange}
                error={errors.budget?.message}
                inputProps={{
                  type: "number",
                  placeholder: "Enter Your Budget",
                  ...register("budget", { valueAsNumber: true }),
                }}
              />
            </FormField>

            <FormField label="Home Area">
              <CombinedField
                prefix="unit"
                prefixOptions={areaUnitOptions}
                prefixValue={areaUnit}
                onPrefixChange={handleAreaUnitChange}
                error={errors.area?.message}
                inputProps={{
                  type: "number",
                  placeholder: "Enter Your Home Area",
                  ...register("area", { valueAsNumber: true }),
                }}
              />
            </FormField>

            <FormField label="Bedrooms">
              <InputField
                type="number"
                placeholder="Enter Bedrooms Number"
                error={errors.bedrooms?.message}
                {...register("bedrooms", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Bathrooms">
              <InputField
                type="number"
                placeholder="Enter Bathrooms Number"
                error={errors.bathrooms?.message}
                {...register("bathrooms", { valueAsNumber: true })}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Living Room">
                <InputField
                  type="number"
                  defaultValue={1}
                  error={errors.livingRoom?.message}
                  {...register("livingRoom", { valueAsNumber: true })}
                />
              </FormField>

              <FormField label="Kitchen">
                <InputField
                  type="number"
                  defaultValue={1}
                  error={errors.kitchen?.message}
                  {...register("kitchen", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField label="Other Rooms">
              <InputField
                placeholder="Enter Other Rooms Number(Office, Storage, etc.)"
                error={errors.otherRooms?.message}
                {...register("otherRooms")}
              />
            </FormField>

            <FormField label="Location" icon={<LocationIcon />}>
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder={
                    errors.location?.message ||
                    "Enter your city, governorate, or village"
                  }
                  className={`w-full p-4 bg-background rounded-[4px] focus:outline-none ${
                    errors.location
                      ? "text-error placeholder-error/60"
                      : "placeholder:text-text/60"
                  }`}
                  value={location}
                  onChange={handleLocationChange}
                  onFocus={() => {
                    if (location.length >= 3) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-[4px] shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => {
                      const address = suggestion.address;
                      let displayName = "";

                      if (address.city) {
                        displayName = `${address.city}, ${
                          address.state || address.country
                        }`;
                      } else if (address.town) {
                        displayName = `${address.town}, ${
                          address.state || address.country
                        }`;
                      } else if (address.village) {
                        displayName = `${address.village}, ${
                          address.state || address.country
                        }`;
                      } else if (address.state) {
                        displayName = `${address.state}, ${address.country}`;
                      } else {
                        return null; // Skip if no specific location is found
                      }

                      return (
                        <div
                          key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                          className="px-4 py-3 cursor-pointer hover:bg-background"
                          onClick={() => handleLocationSelect(suggestion)}>
                          {displayName}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </FormField>

            <FormField label="Style Preferences">
              <CustomSelect
                options={styleOptions}
                value={style}
                onChange={handleStyleChange}
                placeholder="Select Your Style Preferences"
                error={errors.style?.message}
              />
            </FormField>

            <button
              type="submit"
              disabled={isPending}
              className="w-full p-4 mt-2 text-white bg-button rounded-[4px] font-medium hover:bg-button/90 disabled:bg-button/50 disabled:cursor-not-allowed transition-colors shadow-[0_4px_10px_rgba(56,120,255,0.3)]">
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PhaseOne;
