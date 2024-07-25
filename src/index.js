import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AlertProvider } from "./CustomHooks/useAlert";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AlertProvider>
    <App />
</AlertProvider>);
