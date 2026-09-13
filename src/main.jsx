import React from "react";
import { createRoot } from "react-dom/client";
import { completeLoginIfNeeded } from "./auth/spotify";
import { loadToken } from "./auth/session";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root"));

async function boot() {
  let token = loadToken();
  let bootError = null;

  try {
    token = (await completeLoginIfNeeded()) || token;
  } catch (error) {
    bootError = error.message;
  }

  root.render(
    <React.StrictMode>
      <App initialToken={token} bootError={bootError} />
    </React.StrictMode>
  );
}

boot();
