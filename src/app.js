import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Page } from "./page";
import { SpotifyAPIProvider } from "@c-shell/spotify-api-hook";

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  return (
    <BrowserRouter>
      <SpotifyAPIProvider clientId={clientId}>
        <Page />
      </SpotifyAPIProvider>
    </BrowserRouter>
  );
}

export default App;
