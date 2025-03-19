"use client";
import React from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormData } from "@/types/formData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const formSchema = z.object({
  currency: z.enum(["USD", "EUR", "GBP"]),
  budget: z.number().min(1000, "Budget must be at least 1000"),
  areaUnit: z.enum(["m²", "ft²"]),
  area: z.number().min(10, "Area must be at least 10"),
  bedrooms: z.number().min(1, "At least 1 bedroom is required"),
  bathrooms: z.number().min(1, "At least 1 bathroom is required"),
  livingRoom: z.number(),
  kitchen: z.number(),
  otherRooms: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  style: z.string().min(1, "Style preference is required"),
});

// Custom dropdown component
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

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
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
      className="flex-1 rounded-l-none bg-transparent"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [areaUnit, setAreaUnit] = useState("m²");
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      console.log("Form Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    { value: "NY", label: "New York" },
    { value: "CA", label: "California" },
  ];

  const styleOptions = [
    { value: "", label: "Select Your Style Preferences" },
    { value: "modern", label: "Modern" },
    { value: "classic", label: "Classic" },
  ];

  return (
    <div className="min-h-screen">
      <div className="px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl">Logo</h1>
          <Breadcrumb pageName="Planning" />
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="my-auto space-y-6">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                options={locationOptions}
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  setValue("location", value);
                }}
                placeholder="Select Your Location"
              />
            </FormField>

            <FormField label="Style Preferences" error={errors.style?.message}>
              <CustomSelect
                options={styleOptions}
                value={style}
                onChange={(value) => {
                  setStyle(value);
                  setValue("style", value);
                }}
                placeholder="Select Your Style Preferences"
              />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 mt-2 text-white bg-blue-500 rounded-[4px] font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-[0_4px_10px_rgba(59,130,246,0.3)]">
              {isSubmitting ? "Submitting..." : "submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PhaseOne;
