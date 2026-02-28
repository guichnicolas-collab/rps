import React, { useEffect, useState } from "react";

// class Lobby extends React.Component {
//   constructor(props) {
//     super(props);
//     this.joinLobby = this.joinLobby.bind(this);
//   }
//   joinLobby() {
//     localStorage.setItem("_lobbyId", this.props.data._id);
//     const accountId = localStorage.getItem("_id");
//     fetch("http://localhost:3001/joinLobby", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         accountId: accountId,
//         lobbyId: this.props.data._id,
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.success) {
//           this.props.setLobbyId(this.props.data._id);
//         }
//       });
//   }
//   render() {
//     return (
//       <div>
//         <h1>{this.props.data.ownerName}'s Lobby</h1>
//         <button onClick={this.joinLobby}>Join Lobby</button>
//       </div>
//     );
//   }
// }

function Lobby(props) {
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (props.data.ownerName !== "" && props.data.opponentName !== "") {
      setFull(true);
    } else {
      setFull(false);
    }
  }, [props.data.ownerName, props.data.opponentName]);

  function joinLobby() {
    localStorage.setItem("_lobbyId", props.data._id);
    const accountId = localStorage.getItem("_id");
    fetch("http://localhost:3001/joinLobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountId,
        lobbyId: props.data._id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          props.setLobbyId(props.data._id);
        }
      });
  }
  const contentPage = full ? (
    <h2>full</h2>
  ) : (
    <button onClick={joinLobby}>Join Lobby</button>
  );
  return (
    <div>
      <h1>{props.data.ownerName}'s Lobby</h1>
      {contentPage}
    </div>
  );
}

export default Lobby;
