"use client";

import { useState } from "react";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info" | "warning" | "destructive" | undefined;
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now(), ...toast },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toast: addToast,
    removeToast,
    toasts,
  };
};
