import React, { useState } from "react";
import {
  FormFieldProps,
  CustomSelectProps,
  InputFieldProps,
  CombinedFieldProps,
} from "./types";

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  icon,
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <label className="text-sm font-medium text-heading">{label}</label>
      {icon}
    </div>
    {children}
  </div>
);

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ error, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full p-3 rounded-[4px] focus:outline-none ${
        error
          ? "bg-error/5 text-error placeholder-error/80 font-medium"
          : "bg-white placeholder:text-text/60"
      }`}
      placeholder={error || props.placeholder}
    />
  )
);

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center justify-between w-full p-4 rounded-[4px] cursor-pointer ${
          error ? "bg-error/5" : "bg-white"
        }`}
        onClick={() => setIsOpen(!isOpen)}>
        <span className={error ? "text-error font-medium" : "text-text"}>
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

export const CombinedField: React.FC<CombinedFieldProps> = ({
  prefix,
  prefixOptions,
  prefixValue,
  onPrefixChange,
  inputProps,
  error,
}) => (
  <div className="relative flex rounded-[4px]">
    <div
      className="relative"
      style={{ width: prefix === "currency" ? "80px" : "60px" }}>
      <CustomSelect
        options={prefixOptions}
        value={prefixValue}
        onChange={onPrefixChange}
        className="rounded-r-none"
        error={error}
      />
    </div>
    <div className={`w-px ${error ? "bg-error/30" : "bg-text/20"}`} />
    <InputField
      {...inputProps}
      error={error}
      className="flex-1 bg-transparent rounded-l-none"
    />
  </div>
);
