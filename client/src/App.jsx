import React from "react";
import LandingPage from "./pages/LandingPage";
import GlobalStyle from "./styles/GlobalStyle";

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <LandingPage />
      </div>
    </>
  );
}

export default App;
