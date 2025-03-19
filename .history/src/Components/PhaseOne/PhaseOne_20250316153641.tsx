"use client";
import React, { useEffect, useRef } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormData } from "@/types/formData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHomeSubmission } from "@/hooks/useHomeSubmission";
import { Toaster } from "react-hot-toast";

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
      required_error: "Please select a location",
    })
    .min(1, "Please select your location")
    .refine((val) => val !== "", "Please select your location"),

  style: z
    .string({
      required_error: "Please select a style preference",
    })
    .min(1, "Please select your style preference")
    .refine((val) => val !== "", "Please select your style preference"),
});

// Add this type for location suggestions
type LocationSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

// Update CustomSelect component
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  isLocation = false,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLocation?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  // Debounced search function
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLocation && searchQuery.length > 2) {
      setIsLoading(true);
      timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchQuery
            )}&limit=5`
          );
          const data = await response.json();
          setLocationSuggestions(data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setLocationSuggestions([]);
    }
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isLocation]);

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-[4px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}>
        <span className="text-gray-600">
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <svg
          className={`w-4 h-4 transition-transform text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
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
          {isLocation ? (
            <>
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full p-2 border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <svg
                    className="w-5 h-5 animate-spin mx-auto"
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
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        onChange(suggestion.display_name);
                        setIsOpen(false);
                        setSearchQuery("");
                        setLocationSuggestions([]);
                      }}>
                      {suggestion.display_name}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50"
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
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {icon}
    </div>
    {children}
    {error && (
      <div className="mt-1.5 flex items-start gap-2 bg-red-50 p-2 rounded-[4px]">
        <svg
          className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm leading-tight text-red-600">{error}</p>
      </div>
    )}
  </div>
);

const InputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full p-3 bg-gray-50 rounded-[4px] focus:outline-none placeholder:text-gray-400"
  />
));

const CombinedField = ({
  prefix,
  prefixOptions,
  prefixValue,
  onPrefixChange,
  inputProps,
}: {
  prefix: "currency" | "unit";
  prefixOptions: { value: string; label: string }[];
  prefixValue: string;
  onPrefixChange: (value: string) => void;
  inputProps: any;
}) => (
  <div className="relative flex bg-gray-50 rounded-[4px]">
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
    <div className="w-px bg-gray-200" />
    <InputField
      {...inputProps}
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
    className="text-gray-500">
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

  // Set initial values when component mounts
  React.useEffect(() => {
    setValue("currency", "USD");
    setValue("areaUnit", "m²");
  }, [setValue]);

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

  const locationOptions = [
    { value: "", label: "Select Your Location" },
    { value: "Manhattan, NY", label: "Manhattan, NY" },
    { value: "Brooklyn, NY", label: "Brooklyn, NY" },
    { value: "Queens, NY", label: "Queens, NY" },
    { value: "Los Angeles, CA", label: "Los Angeles, CA" },
    { value: "San Francisco, CA", label: "San Francisco, CA" },
    { value: "Chicago, IL", label: "Chicago, IL" },
    { value: "Houston, TX", label: "Houston, TX" },
    { value: "Phoenix, AZ", label: "Phoenix, AZ" },
    { value: "Philadelphia, PA", label: "Philadelphia, PA" },
    { value: "San Antonio, TX", label: "San Antonio, TX" },
    { value: "San Diego, CA", label: "San Diego, CA" },
    { value: "Dallas, TX", label: "Dallas, TX" },
    { value: "San Jose, CA", label: "San Jose, CA" },
    { value: "Austin, TX", label: "Austin, TX" },
    { value: "Jacksonville, FL", label: "Jacksonville, FL" },
    { value: "Fort Worth, TX", label: "Fort Worth, TX" },
    { value: "Columbus, OH", label: "Columbus, OH" },
    { value: "Charlotte, NC", label: "Charlotte, NC" },
    { value: "Indianapolis, IN", label: "Indianapolis, IN" },
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
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl">Logo</h1>
          <Breadcrumb pageName="Planning" />
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-6 text-left lg:text-left sm:text-center">
            <h1 className="text-4xl lg:text-[56px] font-bold leading-tight text-slate-900">
              Define Your Dream Home Effortlessly.
            </h1>
            <p className="text-lg text-slate-600">
              Our AI-driven planner helps you design your home effortlessly by
              generating personalized furniture recommendations, budget
              allocations, and price comparisons—all in one place!
            </p>
            <p className="font-extrabold tracking-[3px] text-slate-500 text-sm">
              SUBMIT YOUR DATA AND GET STARTED
            </p>
          </div>

          <form
            onSubmit={onFormSubmit}
            className="w-full max-w-xl mx-auto space-y-4 lg:mx-0">
            <FormField label="Budget" error={errors.budget?.message}>
              <CombinedField
                prefix="currency"
                prefixOptions={currencyOptions}
                prefixValue={currency}
                onPrefixChange={(value) => {
                  setCurrency(value);
                  setValue("currency", value as "USD" | "EUR" | "GBP");
                }}
                inputProps={{
                  type: "number",
                  placeholder: "Enter Your Budget",
                  ...register("budget", { valueAsNumber: true }),
                }}
              />
            </FormField>

            <FormField label="Home Area" error={errors.area?.message}>
              <CombinedField
                prefix="unit"
                prefixOptions={areaUnitOptions}
                prefixValue={areaUnit}
                onPrefixChange={(value) => {
                  setAreaUnit(value);
                  setValue("areaUnit", value as "m²" | "ft²");
                }}
                inputProps={{
                  type: "number",
                  placeholder: "Enter Your Home Area",
                  ...register("area", { valueAsNumber: true }),
                }}
              />
            </FormField>

            <FormField label="Bedrooms" error={errors.bedrooms?.message}>
              <InputField
                type="number"
                placeholder="Enter Bedrooms Number"
                {...register("bedrooms", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Bathrooms" error={errors.bathrooms?.message}>
              <InputField
                type="number"
                placeholder="Enter Bathrooms Number"
                {...register("bathrooms", { valueAsNumber: true })}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Living Room">
                <InputField
                  type="number"
                  defaultValue={1}
                  {...register("livingRoom", { valueAsNumber: true })}
                />
              </FormField>

              <FormField label="Kitchen">
                <InputField
                  type="number"
                  defaultValue={1}
                  {...register("kitchen", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField label="Other Rooms" error={errors.otherRooms?.message}>
              <InputField
                placeholder="Enter Other Rooms Number(Office, Storage, etc.)"
                {...register("otherRooms")}
              />
            </FormField>

            <FormField
              label="Location"
              error={errors.location?.message}
              icon={<LocationIcon />}>
              <CustomSelect
                options={[]} // Empty array since we're using the API
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  setValue("location", value);
                  clearErrors("location");
                }}
                placeholder="Search for your location"
                isLocation={true}
              />
            </FormField>

            <FormField label="Style Preferences" error={errors.style?.message}>
              <CustomSelect
                options={styleOptions}
                value={style}
                onChange={(value) => {
                  setStyle(value);
                  setValue("style", value);
                  clearErrors("style");
                }}
                placeholder="Select Your Style Preferences"
              />
            </FormField>

            <button
              type="submit"
              disabled={isPending}
              className="w-full p-3 mt-2 text-white bg-blue-500 rounded-[4px] font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-[0_4px_10px_rgba(59,130,246,0.3)]">
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
