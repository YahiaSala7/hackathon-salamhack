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
  otherRooms: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  style: z.string().min(1, "Style preference is required"),
});

// Reusable form field components
const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  options,
  ...props
}: {
  options: { value: string; label: string }[];
  [key: string]: any;
}) => (
  <select
    {...props}
    className="w-full p-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-gray-300">
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const InputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full p-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-gray-300"
  />
));

function PhaseOne() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <div className="min-h-screen bg-[#F8F9FE]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl">Logo</h1>
          <Breadcrumb pageName="Planning" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-[56px] font-bold leading-tight text-[#0F1C35]">
              Define Your Dream Home Effortlessly.
            </h1>
            <p className="text-lg text-[#6B7280]">
              Our AI-driven planner helps you design your home effortlessly by
              generating personalized furniture recommendations, budget
              allocations, and price comparisons—all in one place!
            </p>
            <p className="font-extrabold tracking-[3px] text-[#6B7280] text-sm">
              SUBMIT YOUR DATA AND GET STARTED
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Budget" error={errors.budget?.message}>
              <div className="flex gap-2">
                <SelectField
                  {...register("currency")}
                  options={currencyOptions}
                  className="w-24 bg-white"
                />
                <InputField
                  type="number"
                  placeholder="Enter Your Budget"
                  {...register("budget", { valueAsNumber: true })}
                />
              </div>
            </FormField>

            <FormField label="Home Area" error={errors.area?.message}>
              <div className="flex gap-2">
                <SelectField
                  {...register("areaUnit")}
                  options={areaUnitOptions}
                  className="w-24 bg-white"
                />
                <InputField
                  type="number"
                  placeholder="Enter Your Home Area"
                  {...register("area", { valueAsNumber: true })}
                />
              </div>
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

            <div className="grid grid-cols-2 gap-6">
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

            <FormField label="Location" error={errors.location?.message}>
              <div className="relative">
                <SelectField
                  {...register("location")}
                  options={locationOptions}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z"
                      stroke="#1C274C"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z"
                      stroke="#1C274C"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </FormField>

            <FormField label="Style Preferences" error={errors.style?.message}>
              <SelectField {...register("style")} options={styleOptions} />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 text-white bg-[#4F7EF7] rounded-lg font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? "Submitting..." : "submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PhaseOne;
