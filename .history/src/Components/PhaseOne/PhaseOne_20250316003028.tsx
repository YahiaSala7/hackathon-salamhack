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
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{label}</label>
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
    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      // Add your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl">Logo</h1>
          <Breadcrumb pageName="Planning" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-heading">
              Define Your Dream Home Effortlessly.
            </h1>
            <p className="text-lg font-bold text-text">
              Our AI-driven planner helps you design your home effortlessly by
              generating personalized furniture recommendations, budget
              allocations, and price comparisons—all in one place!
            </p>
            <p className="font-extrabold tracking-[3px] text-text">
              SUBMIT YOUR DATA AND GET STARTED
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-lg">
            <FormField label="Budget" error={errors.budget?.message}>
              <div className="flex gap-2">
                <SelectField
                  {...register("currency")}
                  options={currencyOptions}
                  className="w-1/4"
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
                  className="w-1/4"
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

            <FormField
              label="Other Rooms (Optional)"
              error={errors.otherRooms?.message}>
              <InputField
                placeholder="Enter Other Rooms"
                {...register("otherRooms")}
              />
            </FormField>

            <FormField label="Location" error={errors.location?.message}>
              <SelectField
                {...register("location")}
                options={locationOptions}
              />
            </FormField>

            <FormField label="Style Preferences" error={errors.style?.message}>
              <SelectField {...register("style")} options={styleOptions} />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 text-white bg-blue-600 rounded shadow hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors mt-6">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PhaseOne;
