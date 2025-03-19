import { LocationSuggestion } from "@/types/location";

export interface FormState {
  currency: string;
  areaUnit: string;
  location: string;
  style: string;
  occupants: string;
  suggestions: LocationSuggestion[];
  showSuggestions: boolean;
  showLoading: boolean;
  progress: number;
}

export type FormAction =
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "SET_AREA_UNIT"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_STYLE"; payload: string }
  | { type: "SET_OCCUPANTS"; payload: string }
  | { type: "SET_SUGGESTIONS"; payload: LocationSuggestion[] }
  | { type: "SET_SHOW_SUGGESTIONS"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "UPDATE_PROGRESS" };

export interface PhaseOneProps {
  onSubmit: (data: any) => void;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export interface CombinedFieldProps {
  prefix: "currency" | "unit";
  prefixOptions: { value: string; label: string }[];
  prefixValue: string;
  onPrefixChange: (value: string) => void;
  inputProps: any;
  error?: string;
}
