import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [message, setMessage] = useState({ type: "", message: "" });

    const Alert = (type, message) => {
        setMessage({ type, message });
    };

    const hideAlert = () => {
        setMessage({ type: "", message: "" });
    };

    return (
        <AlertContext.Provider value={{ Alert, hideAlert, message }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};