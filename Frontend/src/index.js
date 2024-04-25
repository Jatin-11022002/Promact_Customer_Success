import React from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM for rendering
import App from "src/App"; // Import the App component
import { AuthProvider } from "src/context/Auth-Provider"; // Import AuthProvider for authentication context
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import BrowserRouter and Route components for routing
import { Auth0Provider } from "@auth0/auth0-react"; // Import Auth0Provider for Auth0 authentication
import "./styling/index.css";
// Create a new React root with ReactDOM.createRoot method, targeting the element with id "root"
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component into the root
root.render(
  <BrowserRouter>
    {/* Auth0Provider for handling authentication */}
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      audience={process.env.REACT_APP_AUDIENCE}
      authorizationParams={{
        redirect_uri: process.env.REACT_APP_FRONTEND_URL,
      }}
    >
      {/* AuthProvider for managing authentication context */}
      <AuthProvider>
        {/* Routes for defining application routes */}
        <Routes>
          {/* Route for all paths, rendering the App component */}
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </Auth0Provider>
  </BrowserRouter>
);
