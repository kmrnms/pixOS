import React, { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  // alert = { type: "success"|"error"|"info", message: string }

  const showAlert = useCallback((message, type = "info", duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, duration);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert type={alert.type} message={alert.message} />}
    </AlertContext.Provider>
  );
}

function Alert({ type, message }) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-400",
  };

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg text-white
        ${colors[type] || colors.info}
        animate-fade-in-out
      `}
      role="alert"
    >
      {message}
    </div>
  );
}
