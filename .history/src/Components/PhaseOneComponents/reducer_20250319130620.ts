import { FormState, FormAction } from "./types";

export const initialState: FormState = {
  currency: "USD",
  areaUnit: "m²",
  location: "",
  style: "",
  occupants: "",
  suggestions: [],
  showSuggestions: false,
  showLoading: false,
  progress: 0,
};

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "SET_AREA_UNIT":
      return { ...state, areaUnit: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_STYLE":
      return { ...state, style: action.payload };
    case "SET_OCCUPANTS":
      return { ...state, occupants: action.payload };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };
    case "SET_SHOW_SUGGESTIONS":
      return { ...state, showSuggestions: action.payload };
    case "SET_LOADING":
      return { ...state, showLoading: action.payload };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "UPDATE_PROGRESS":
      return {
        ...state,
        progress: state.progress >= 100 ? 100 : state.progress + 10,
      };
    default:
      return state;
  }
}
