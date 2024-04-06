import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function App() {
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, logout } =
    useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
    const res = getAccessTokenSilently();
    console.log(res);
  };

  useEffect(() => {
    async function token() {
      //const res=1
      const res = await getAccessTokenSilently();
      console.log(res);
      try {
        const options = { headers: { authorization: `Bearer ${res}` } };
        const authToken = await axios.get("http://localhost:8000/", options);
        console.log(authToken);
      } catch (error) {
        console.log(error);
      }
    }
    token();
  }, [isAuthenticated]);

  return (
    <>
      {console.log(isAuthenticated)}
      {isAuthenticated ? (
        <button onClick={() => logout()}>logout</button>
      ) : (
        <button onClick={handleLogin}>login</button>
      )}
    </>
  );
}

export default App;
