import { React, useState, useEffect } from "react";
import Lobby from "./Lobby";
import RPSGame from "./RPSGame";
import Leaderboard from "./Leaderboard";

// class GameLobby extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lobbyId: null,
//       lobbies: [],
//     };
//     this.createLobby = this.createLobby.bind(this);
//     this.leaveLobby = this.leaveLobby.bind(this);
//     this.setLobbyId = this.setLobbyId.bind(this);
//     this.getLobbies = this.getLobbies.bind(this);
//     this.checkLobby = this.checkLobby.bind(this);
//   }
//   componentDidMount() {
//     this.setState({ lobbyId: localStorage.getItem("_lobbyId") });
//     setInterval(this.checkLobby, 3000);
//     setInterval(this.getLobbies, 3000);
//   }
//   getLobbies() {
//     fetch("http://localhost:3001/getLobbies")
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         this.setState({ lobbies: data.lobbies });
//       });
//   }
//   // TODO: when you get kicked out, there is another interval error
//   checkLobby() {
//     fetch("http://localhost:3001/getLobby", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         lobbyId: localStorage.getItem("_lobbyId"),
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (!data.success) {
//           this.setState({ lobbyId: null });
//           localStorage.removeItem("_lobbyId");
//         }
//       });
//   }
//   createLobby() {
//     let accountId = localStorage.getItem("_id");
//     fetch("http://localhost:3001/createLobby", {
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
//           this.setState({ lobbyId: data.lobbyId });
//           localStorage.setItem("_lobbyId", data.lobbyId);
//         }
//       });
//   }
//   setLobbyId(lobbyId) {
//     this.setState({ lobbyId: lobbyId });
//   }
//   leaveLobby() {
//     let accountId = localStorage.getItem("_id");
//     fetch("http://localhost:3001/leaveLobby", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         playerId: accountId,
//         lobbyId: localStorage.getItem("_lobbyId"),
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success) {
//           this.setState({ lobbyId: null });
//           localStorage.removeItem("_lobbyId");
//         }
//       });
//     this.setState({ lobbyId: null });
//     localStorage.removeItem("_lobbyId");
//   }
//   render() {
//     let lobbyDisplay = this.state.lobbies.map((item) => {
//       return <Lobby data={item} key={item._id} setLobbyId={this.setLobbyId} />;
//     });
//     let content = (
//       <div>
//         <button onClick={this.createLobby}>Create Lobby</button>
//         {lobbyDisplay}
//       </div>
//     );
//     if (this.state.lobbyId != null) {
//       content = (
//         <div>
//           <RPSGame leaveLobby={this.leaveLobby} lobbyId={this.state.lobbyId} />
//         </div>
//       );
//     }
//     return (
//       <div>
//         <button onClick={this.props.logOut}>Log Out</button>
//         {content}
//         <Leaderboard />
//       </div>
//     );
//   }
// }

function GameLobby(props) {
  const [lobbyId, setLobbyId] = useState(null);
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    setLobbyId(localStorage.getItem("_lobbyId"));

    const lobbyCheck = setInterval(checkLobby, 3000);
    const lobbyList = setInterval(getLobbies, 3000);

    return () => {
      clearInterval(lobbyCheck);
      clearInterval(lobbyList);
    };
  }, []);

  function getLobbies() {
    fetch("http://localhost:3001/getLobbies")
      .then((response) => response.json())
      .then((data) => {
        setLobbies(data.lobbies);
      });
  }

  function checkLobby() {
    fetch("http://localhost:3001/getLobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: localStorage.getItem("_lobbyId"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (!data.success) {
          setLobbyId(null);
          localStorage.removeItem("_lobbyId");
        }
      });
  }

  function createLobby() {
    const accountId = localStorage.getItem("_id");

    fetch("http://localhost:3001/createLobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.success) {
          setLobbyId(data.lobbyId);
          localStorage.setItem("_lobbyId", data.lobbyId);
        }
      });
  }

  function leaveLobby() {
    let accountId = localStorage.getItem("_id");

    fetch("http://localhost:3001/leaveLobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: accountId,
        lobbyId: localStorage.getItem("_lobbyId"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.success) {
          setLobbyId(null);
          localStorage.removeItem("_lobbyId");
        }
      });

    setLobbyId(null);
    localStorage.removeItem("_lobbyId");
  }

  const lobbyDisplay = lobbies.map((item) => {
    return <Lobby data={item} key={item._id} setLobbyId={setLobbyId} />;
  });

  let content = (
    <div>
      <button onClick={createLobby}>Create Lobby</button>
      {lobbyDisplay}
    </div>
  );

  if (lobbyId !== null) {
    content = (
      <div>
        <RPSGame leaveLobby={leaveLobby} lobbyId={lobbyId} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={props.logOut}>Log Out</button>
      {content}
      <Leaderboard />
    </div>
  );
}

export default GameLobby;
