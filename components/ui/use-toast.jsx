import React, { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant, ...props }) => {
    const id = Math.random().toString(36).substring(2, 9);
    return {
      id,
      dismiss: () => {},
      update: () => {},
    };
  };

  return {
    toasts,
    toast,
    dismiss: () => {},
  };
}

export const toast = ({ title, description, variant, ...props }) => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    dismiss: () => {},
    update: () => {},
  };
};

export default useToast;
