import { create } from "zustand";
import { UserFormStatus } from "@/types/recommendation";

interface FormStatusStore extends UserFormStatus {
  setSubmitted: (status: boolean, userId?: string) => void;
}

export const useFormStatus = create<FormStatusStore>((set) => ({
  isSubmitted: false,
  userId: undefined,
  setSubmitted: (status: boolean, userId?: string) =>
    set({ isSubmitted: status, userId }),
}));
