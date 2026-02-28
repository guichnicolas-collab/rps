import { React, useState, useEffect } from "react";
import SignUpLogIn from "./SignUpLogIn";
import GameLobby from "./GameLobby";
import "./App.css";

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       session: false,
//     };
//     this.signUp = this.signUp.bind(this);
//     this.logIn = this.logIn.bind(this);
//     this.logOut = this.logOut.bind(this);
//   }
//   componentDidMount() {
//     let accountId = localStorage.getItem("_id");
//     fetch("http://localhost:3001/session", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         accountId: accountId,
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success) {
//           this.setState({ session: true });
//         }
//       });
//   }

//   signUp(usernameInput, passwordInput, emailInput) {
//     fetch("http://localhost:3001/signUp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: usernameInput,
//         password: passwordInput,
//         email: emailInput,
//       }),
//     });
//   }
//   logIn(usernameInput, passwordInput) {
//     fetch("http://localhost:3001/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: usernameInput,
//         password: passwordInput,
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success) {
//           this.setState({ session: true });
//           console.log(data.accountData);
//           localStorage.setItem("_id", data.accountData._id);
//         }
//       });
//   }
//   logOut() {
//     localStorage.removeItem("_id");
//     localStorage.removeItem("_lobbyId");
//     this.setState({ session: false });
//   }
//   render() {
//     let contentPage = <SignUpLogIn signUp={this.signUp} logIn={this.logIn} />;
//     if (this.state.session) {
//       contentPage = <GameLobby logOut={this.logOut} />;
//     }
//     return <div>{contentPage}</div>;
//   }
// }

function App() {
  const [session, setSession] = useState(false);

  function signUp(usernameInput, passwordInput, emailInput) {
    fetch("http://localhost:3001/signUp", {
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
  }
  function logIn(usernameInput, passwordInput) {
    fetch("http://localhost:3001/login", {
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
        if (data.success) {
          setSession(true);
          localStorage.setItem("_id", data.accountData._id);
        }
      });
  }
  function logOut() {
    localStorage.removeItem("_id");
    localStorage.removeItem("_lobbyId");
    setSession(false);
  }

  useEffect(() => {
    const accountId = localStorage.getItem("_id");
    fetch("http://localhost:3001/session", {
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
        console.log(data);
        if (data.success) {
          setSession(true);
        }
      });
  }, []);

  const contentPage = session ? (
    <GameLobby logOut={logOut} />
  ) : (
    <SignUpLogIn signUp={signUp} logIn={logIn} />
  );
  return <div>{contentPage}</div>;
}

export default App;
