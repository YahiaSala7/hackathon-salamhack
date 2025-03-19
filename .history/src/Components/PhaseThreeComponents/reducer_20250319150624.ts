import { Category, FilterState } from "@/types/product";

export interface PhaseThreeState {
  currentPage: number;
  filters: FilterState;
  viewMode: "table" | "card";
  isMobile: boolean;
}

export type PhaseThreeAction =
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_FILTERS"; payload: Partial<FilterState> }
  | { type: "SET_VIEW_MODE"; payload: "table" | "card" }
  | { type: "SET_IS_MOBILE"; payload: boolean }
  | { type: "RESET_FILTERS" };

const initialState: PhaseThreeState = {
  currentPage: 1,
  filters: {
    priceRange: [0, 1000],
    categories: [] as Category[],
    rating: 0,
    storeProximity: 5,
    sortBy: "price",
  },
  viewMode: "table",
  isMobile: false,
};

export function phaseThreeReducer(
  state: PhaseThreeState,
  action: PhaseThreeAction
): PhaseThreeState {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_IS_MOBILE":
      return { ...state, isMobile: action.payload };
    case "RESET_FILTERS":
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
}
