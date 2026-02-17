import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./src/css/index.css";
import App from "./src/App.tsx";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      toastOptions={{
        style: {
          background: "#0F0F10",
          color: "#fff",
        },
      }}
    />
    <App />
  </StrictMode>,
);
