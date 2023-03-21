/* eslint-disable no-unused-vars */
import { create } from "zustand";
import produce from "immer";

interface IState {
  pagesEndCursors: string[];
  setPagesEndCursors: (_endCursors: string[]) => void;
  loading: boolean;
  setLoading: (_loading: boolean) => void;
}

export const useStore = create<IState>((set) => ({
  pagesEndCursors: [""],
  setPagesEndCursors: (endCursors: string[]) =>
    set(
      produce((state) => {
        state.pagesEndCursors = endCursors;
      })
    ),
  loading: true,
  setLoading: (loading: boolean) =>
    set(
      produce((state) => {
        state.loading = loading;
      })
    ),
}));
