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
} from "./PhaseOneComponents/FormComponents";
import { LocationField } from "./PhaseOneComponents/LocationField";
import { formReducer, initialState } from "./PhaseOneComponents/reducer";
import {
  currencyOptions,
  areaUnitOptions,
  styleOptions,
  occupantsOptions,
} from "./PhaseOneComponents/constants";

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
    console.log("Form submitted with data:", data);
    try {
      submitHome(data, {
        onSuccess: () => {
          console.log("Submission successful");
          dispatch({ type: "SET_LOADING", payload: true });

          const progressInterval = setInterval(() => {
            dispatch({ type: "UPDATE_PROGRESS" });
            if (state.progress >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                router.push("/phase-two");
              }, 500);
            }
          }, 500);
        },
        onError: (error) => {
          console.error("Submission error:", error);
        },
      });
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
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
                  }`}
                  {...register("livingRoom", { valueAsNumber: true })}
                />
              </FormField>

              <FormField label="Kitchen">
                <input
                  type="number"
                  defaultValue={1}
                  className={`w-full p-3 rounded-[4px] focus:outline-none ${
                    errors.kitchen
                      ? "bg-error/5 text-error placeholder-error/80 font-medium"
                      : "bg-white placeholder:text-text/60"
                  }`}
                  {...register("kitchen", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField label="Other Rooms">
              <input
                placeholder="Enter Other Rooms Number(Office, Storage, etc.)"
                className={`w-full p-3 rounded-[4px] focus:outline-none ${
                  errors.otherRooms
                    ? "bg-error/5 text-error placeholder-error/80 font-medium"
                    : "bg-white placeholder:text-text/60"
                }`}
                {...register("otherRooms")}
              />
            </FormField>

            <FormField label="Occupants">
              <CustomSelect
                options={occupantsOptions}
                value={state.occupants}
                onChange={(value) => {
                  dispatch({ type: "SET_OCCUPANTS", payload: value });
                  setValue("occupants", value);
                  clearErrors("occupants");
                }}
                placeholder="Select Your Occupancy Type"
                error={errors.occupants?.message}
              />
            </FormField>

            <LocationField
              value={state.location}
              onChange={(value) => {
                dispatch({ type: "SET_LOCATION", payload: value });
                setValue("location", value);
                if (value) {
                  clearErrors("location");
                }
              }}
              error={errors.location?.message}
              suggestions={state.suggestions}
              showSuggestions={state.showSuggestions}
              onSuggestionSelect={(suggestion) => {
                dispatch({
                  type: "SET_LOCATION",
                  payload: suggestion.display_name,
                });
                setValue("location", suggestion.display_name);
                clearErrors("location");
              }}
              onShowSuggestionsChange={(show) =>
                dispatch({ type: "SET_SHOW_SUGGESTIONS", payload: show })
              }
              onSuggestionsChange={(suggestions) =>
                dispatch({ type: "SET_SUGGESTIONS", payload: suggestions })
              }
            />

            <FormField label="Style Preferences">
              <CustomSelect
                options={styleOptions}
                value={state.style}
                onChange={(value) => {
                  dispatch({ type: "SET_STYLE", payload: value });
                  setValue("style", value);
                  clearErrors("style");
                }}
                placeholder="Select Your Style Preferences"
                error={errors.style?.message}
              />
            </FormField>

            <button
              type="submit"
              disabled={isPending}
              className="w-full p-4 mt-2 text-xl text-white bg-button rounded-[10px] font-bold hover:bg-button/90 disabled:bg-button/50 cursor-pointer transition-colors shadow-[0_0_54px_rgba(56,120,255,0.3)]">
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
};

export default PhaseOne;
