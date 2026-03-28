import { React, useState, useEffect, useCallback } from "react";
import SignUpLogIn from "./SignUpLogIn";
import GameLobby from "./GameLobby";
import "./App.css";

/**
 * @typedef {{ _id: string, username: string, email: string, rankPoints: number, lobbyId?: string | null }} Account
 */

function App() {
  const [session, setSession] = useState(/** @type {Account | null} */ (null));

  const signUp = useCallback((usernameInput, passwordInput, emailInput) => {
    fetch("signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
        email: emailInput,
      }),
    });
  }, []);
  const logIn = useCallback((usernameInput, passwordInput) => {
    fetch("login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success && data.accountData) {
          localStorage.setItem("_id", data.accountData._id);
          setSession(data.accountData);
        }
      });
  }, []);
  const logOut = useCallback(() => {
    localStorage.removeItem("_id");
    localStorage.removeItem("_lobbyId");
    setSession(null);
  }, []);

  useEffect(() => {
    const accountId = localStorage.getItem("_id");
    fetch("session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setSession(data.account);
        }
      });
  }, []);

  const contentPage = session ? (
    <GameLobby logOut={logOut} session={session} />
  ) : (
    <SignUpLogIn signUp={signUp} logIn={logIn} />
  );
  return <div>{contentPage}</div>;
}

export default App;
