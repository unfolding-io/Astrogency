import { atom } from "nanostores";


export const showDialog = atom({
  id: null,
  show: false,
});

export const toastMessage = atom({
  message: "",
  description: "",
  date: "",
  type: ""
});

export const showFaq = atom(null);