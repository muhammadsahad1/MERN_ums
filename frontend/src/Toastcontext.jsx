import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Create a context for the toast provider
const ToastContext = createContext();

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);

// Custom provider component
export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster /> {/* Render the Toaster component from react-hot-toast */}
    </ToastContext.Provider>
  );
};
  