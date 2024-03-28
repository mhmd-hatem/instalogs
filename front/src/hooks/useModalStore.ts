import { create } from "zustand";
type ModalStore = {
  isOpen: boolean;
  event: TEvent | null;
  setEvent: (event: TEvent | null) => void;
  setIsOpen: (isOpen: boolean) => void;
};

const useModal = create<ModalStore>()((set) => ({
  isOpen: false,
  event: null,
  setEvent: (event) => set({ event }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useModal;
