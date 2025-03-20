"use client";
import React, { useCallback, FC } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/formData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHomeSubmission } from "@/hooks/useHomeSubmission";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import {
  FormField,
  CustomSelect,
  CombinedField,
} from "../PhaseOneComponents/FormComponents";
import { LocationField } from "../PhaseOneComponents/LocationField";
import { formReducer, initialState } from "../PhaseOneComponents/reducer";
import {
  currencyOptions,
  areaUnitOptions,
  styleOptions,
  occupantsOptions,
} from "../PhaseOneComponents/constants";

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
  occupants: z
    .string({
      required_error: "Please select your occupancy type",
    })
    .min(1, "Please select your occupancy type"),
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
      return val.includes(",");
    }, "Please select a specific city, governorate, or village, not just a country"),
  style: z
    .string({
      required_error: "Please select a style preference",
    })
    .min(1, "Please select your style preference")
    .refine((val) => val !== "", "Please select your style preference"),
});

interface PhaseOneProps {
  onSubmit: (data: FormData) => void;
}

const PhaseOne: FC<PhaseOneProps> = ({ onSubmit }) => {
  const router = useRouter();
  const { mutate: submitHome, isPending } = useHomeSubmission();
  const [state, dispatch] = useReducer(formReducer, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  const handleFormSubmit = async (data: FormData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_PROGRESS", payload: 0 });

      // Call the parent's onSubmit function with the form data
      onSubmit(data);

      // Update progress to 100% immediately
      dispatch({ type: "SET_PROGRESS", payload: 100 });

      // Wait a moment to show completion
      setTimeout(() => {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_PROGRESS", payload: 0 });
        // Scroll to the next section
        const nextSection = document.getElementById("phase-two");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 1000);
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_PROGRESS", payload: 0 });
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const onFormSubmit = handleSubmit(
    (data) => {
      console.log("Form validation passed, calling handleFormSubmit");
      handleFormSubmit(data);
    },
    (errors) => {
      console.log("Form validation failed:", errors);
    }
  );

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {state.showLoading && <LoadingOverlay progress={state.progress} />}
      <div className="px-4 py-6 m-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl text-heading">Logo</h1>
          <Breadcrumb pageName="Planning" />
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-6 text-center lg:text-left m-auto">
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
            className="w-full max-w-xl mx-auto space-y-4">
            <FormField label="Budget">
              <CombinedField
                prefix="currency"
                prefixOptions={currencyOptions}
                prefixValue={state.currency}
                onPrefixChange={(value) => {
                  dispatch({ type: "SET_CURRENCY", payload: value });
                  setValue("currency", value as "USD" | "EUR" | "GBP");
                }}
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
                prefixValue={state.areaUnit}
                onPrefixChange={(value) => {
                  dispatch({ type: "SET_AREA_UNIT", payload: value });
                  setValue("areaUnit", value as "m²" | "ft²");
                }}
                error={errors.area?.message}
                inputProps={{
                  type: "number",
                  placeholder: "Enter Your Home Area",
                  ...register("area", { valueAsNumber: true }),
                }}
              />
            </FormField>

            <FormField label="Bedrooms">
              <input
                type="number"
                placeholder="Enter Bedrooms Number"
                className={`w-full p-3 rounded-[4px] focus:outline-none ${
                  errors.bedrooms
                    ? "bg-error/5 text-error placeholder-error/80 font-medium"
                    : "bg-white placeholder:text-text/60"
                }`}
                {...register("bedrooms", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Bathrooms">
              <input
                type="number"
                placeholder="Enter Bathrooms Number"
                className={`w-full p-3 rounded-[4px] focus:outline-none ${
                  errors.bathrooms
                    ? "bg-error/5 text-error placeholder-error/80 font-medium"
                    : "bg-white placeholder:text-text/60"
                }`}
                {...register("bathrooms", { valueAsNumber: true })}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Living Room">
                <input
                  type="number"
                  defaultValue={1}
                  className={`w-full p-3 rounded-[4px] focus:outline-none ${
                    errors.livingRoom
                      ? "bg-error/5 text-error placeholder-error/80 font-medium"
                      : "bg-white placeholder:text-text/60"
                  }`