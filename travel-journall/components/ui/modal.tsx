import React from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-5xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl z-50 hover:opacity-70"
        >
          <X size={28} />
        </button>

        {children}
      </div>
    </div>
  );
};
