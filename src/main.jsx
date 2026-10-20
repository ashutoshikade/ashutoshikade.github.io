// The entry point: index.html loads this file, and this file puts the React
// app into the <div id="root"> element on the page.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // StrictMode runs extra checks in development (it does nothing in production).
  <StrictMode>
    {/* BrowserRouter keeps track of the URL so <Routes> can show the matching page. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
