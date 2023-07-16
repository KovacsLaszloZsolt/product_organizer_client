import { create } from 'zustand';
import { IntFilters } from '../types/common';
import { IntToastMessage } from '../types/toastMessage';

interface ProductsState {
  toastMessage: null | IntToastMessage;
  setToastMessage: (message: null | IntToastMessage) => void;
  filters: IntFilters;
  setFilters: (filters: IntFilters) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  isToolbarOpen: boolean;
  setIsToolbarOpen: (isToolbarOpen: boolean) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  toastMessage: null,
  setToastMessage: (toastMessage): void => {
    set({ toastMessage });
  },
  filters: {},
  setFilters: (filters): void => {
    set({ filters });
  },
  searchValue: '',
  setSearchValue: (searchValue): void => set({ searchValue }),
  isToolbarOpen: false,
  setIsToolbarOpen: (isToolbarOpen): void => set({ isToolbarOpen })
}));
