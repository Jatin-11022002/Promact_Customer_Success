import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-34crl0ebsqxu7bk8.us.auth0.com"
      clientId="02cOKTc1n5QzhuDSSzt4Ab6Q8IrCLkVF"
      authorizationParams={{
        audience: "http://get-token-url/",
        redirect_uri: "http://localhost:5173/",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
