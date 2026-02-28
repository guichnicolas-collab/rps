import React, { useState, useEffect } from "react";
import rock from "./assets/Rock.jpeg";
import paper from "./assets/Paper.jpeg";
import scissors from "./assets/Scissors.jpeg";

// zoom link: https://us05web.zoom.us/j/6992957106?pwd=aWFFTUFuQUxKaEh0eWxCck9lZWtSQT09#success
// main issues:
// when you logout, your lobby should get deleated because if you log back in, then you can't get into your own lobby

// class RPSGame extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ownerName: "",
//       opponentName: "",
//       gameMessage: "",
//     };
//     this.gamePlay = this.gamePlay.bind(this);
//     this.updateLobby = this.updateLobby.bind(this);
//     this.checkBothPlayed = this.checkBothPlayed.bind(this);
//     this.canPlay = this.canPlay.bind(this);
//     this.myInterval = null;
//     this.playedInterval = null;
//     this.canPlayInterval = null;
//   }
//   componentDidMount() {
//     this.myInterval = setInterval(this.updateLobby, 3000);
//     this.playedInterval = setInterval(this.checkBothPlayed, 2500);
//     this.canPlayInterval = setInterval(this.canPlay, 3100);
//   }
//   componentWillUnmount() {
//     console.log("component unmounting");
//     clearInterval(this.myInterval);
//     clearInterval(this.playedInterval);
//     clearInterval(this.canPlayInterval);
//   }
//   updateLobby() {
//     fetch("http://localhost:3001/getLobby", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         lobbyId: this.props.lobbyId,
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         this.setState({
//           ownerName: data.lobby.ownerName,
//           opponentName: data.lobby.opponentName,
//         });
//       });
//   }
//   updateRank(points) {
//     fetch("http://localhost:3001/updateRankPoints", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         accountId: localStorage.getItem("_id"),
//         points: points,
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {});
//   }
//   gamePlay(object) {
//     if (this.state.opponentName === "") {
//       // r > s, s > p, p > r
//       // r = 0
//       // p = 1
//       // s = 2
//       let computerObject = Math.floor(Math.random() * 3);
//       if (object === computerObject) {
//         this.setState({ gameMessage: "It's a tie!" });
//       } else if (object === 0 && computerObject === 1) {
//         this.setState({
//           gameMessage: "Computer Choice: Paper.  Computer wins!",
//         });
//         this.updateRank(-1);
//       } else if (object === 0 && computerObject === 2) {
//         this.setState({ gameMessage: "Computer Choice: Scissors.  You win!" });
//         this.updateRank(1);
//       } else if (object === 1 && computerObject === 0) {
//         this.setState({ gameMessage: "Computer Choice: Rock.  You win!" });
//         this.updateRank(1);
//       } else if (object === 1 && computerObject === 2) {
//         this.setState({
//           gameMessage: "Computer Choice: Scissors.  Computer wins!",
//         });
//         this.updateRank(-1);
//       } else if (object === 2 && computerObject === 0) {
//         this.setState({
//           gameMessage: "Computer Choice: Rock.  Computer wins!",
//         });
//         this.updateRank(-1);
//       } else if (object === 2 && computerObject === 1) {
//         this.setState({ gameMessage: "Computer Choice: Paper.  You win!" });
//         this.updateRank(1);
//       }
//     } else {
//       let objects = ["rock", "paper", "scissors"];
//       fetch("http://localhost:3001/makeMove", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           accountId: localStorage.getItem("_id"),
//           lobbyId: localStorage.getItem("_lobbyId"),
//           move: objects[object],
//         }),
//       })
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           if (data.success) {
//           }
//         });
//     }
//   }
//   async checkBothPlayed() {
//     await fetch("http://localhost:3001/checkBothPlayed", {
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
//       .then(async (data) => {
//         if (data.success) {
//           await fetch("http://localhost:3001/checkMove", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               accountId: localStorage.getItem("_id"),
//               lobbyId: localStorage.getItem("_lobbyId"),
//             }),
//           })
//             .then((response) => {
//               return response.json();
//             })
//             .then(async (data) => {
//               this.setState({ gameMessage: data.message });
//               await fetch("http://localhost:3001/receivedResult", {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   accountId: localStorage.getItem("_id"),
//                   lobbyId: localStorage.getItem("_lobbyId"),
//                 }),
//               }).then((response) => {
//                 return response.json();
//               });
//             });
//         }
//       });
//   }
//   canPlay() {
//     fetch("http://localhost:3001/canMove", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         accountId: localStorage.getItem("_id"),
//         lobbyId: localStorage.getItem("_lobbyId"),
//       }),
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         this.setState({
//           gameMessage: data.canMove ? "You can make another move!" : "",
//         });
//       });
//   }
//   render() {
//     return (
//       <div>
//         <h1>{this.state.ownerName}'s Lobby</h1>
//         <h1>Opponent: {this.state.opponentName}</h1>
//         <button
//           onClick={() => {
//             this.props.leaveLobby();
//           }}
//         >
//           Leave Lobby
//         </button>
//         <img
//           src={rock}
//           alt="Rock"
//           width="200"
//           height="200"
//           onClick={() => this.gamePlay(0)}
//         />
//         <img
//           src={paper}
//           alt="Paper"
//           width="200"
//           height="200"
//           onClick={() => this.gamePlay(1)}
//         />
//         <img
//           src={scissors}
//           alt="Scissors"
//           width="200"
//           height="200"
//           onClick={() => this.gamePlay(2)}
//         />
//         <h5>{this.state.gameMessage}</h5>
//       </div>
//     );
//   }
// }

// function to delay code execution
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function RPSGame(props) {
  const [ownerName, setOwnerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [gameMessage, setGameMessage] = useState("");

  useEffect(() => {
    const lobbyInterval = setInterval(updateLobby, 3000);
    const playedInterval = setInterval(checkBothPlayed, 2500);
    const canPlayInterval = setInterval(canPlay, 3100);

    return () => {
      console.log("component unmounting");
      clearInterval(lobbyInterval);
      clearInterval(playedInterval);
      clearInterval(canPlayInterval);
    };
  }, []);

  function updateLobby() {
    fetch("http://localhost:3001/getLobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: props.lobbyId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setOwnerName(data.lobby.ownerName);
        setOpponentName(data.lobby.opponentName);
      });
  }

  function updateRank(points) {
    fetch("http://localhost:3001/updateRankPoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: localStorage.getItem("_id"),
        points: points,
      }),
    }).then((response) => response.json());
  }

  function gamePlay(object) {
    if (opponentName === "") {
      let computerObject = Math.floor(Math.random() * 3);

      if (object === computerObject) {
        setGameMessage("It's a tie!");
      } else if (object === 0 && computerObject === 1) {
        setGameMessage("Computer Choice: Paper.  Computer wins!");
        updateRank(-1);
      } else if (object === 0 && computerObject === 2) {
        setGameMessage("Computer Choice: Scissors.  You win!");
        updateRank(1);
      } else if (object === 1 && computerObject === 0) {
        setGameMessage("Computer Choice: Rock.  You win!");
        updateRank(1);
      } else if (object === 1 && computerObject === 2) {
        setGameMessage("Computer Choice: Scissors.  Computer wins!");
        updateRank(-1);
      } else if (object === 2 && computerObject === 0) {
        setGameMessage("Computer Choice: Rock.  Computer wins!");
        updateRank(-1);
      } else if (object === 2 && computerObject === 1) {
        setGameMessage("Computer Choice: Paper.  You win!");
        updateRank(1);
      }
    } else {
      let objects = ["rock", "paper", "scissors"];

      fetch("http://localhost:3001/makeMove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: localStorage.getItem("_id"),
          lobbyId: localStorage.getItem("_lobbyId"),
          move: objects[object],
        }),
      })
        .then((response) => response.json())
        .then((data) => {});
    }
  }

  async function checkBothPlayed() {
    const res = await fetch("http://localhost:3001/checkBothPlayed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: localStorage.getItem("_lobbyId"),
      }),
    });

    const data = await res.json();

    if (data.success) {
      const moveRes = await fetch("http://localhost:3001/checkMove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: localStorage.getItem("_id"),
          lobbyId: localStorage.getItem("_lobbyId"),
        }),
      });

      const moveData = await moveRes.json();
      setGameMessage(moveData.message);
      await sleep(1000);

      await fetch("http://localhost:3001/receivedResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: localStorage.getItem("_id"),
          lobbyId: localStorage.getItem("_lobbyId"),
        }),
      });
    }
  }

  function canPlay() {
    fetch("http://localhost:3001/canMove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: localStorage.getItem("_id"),
        lobbyId: localStorage.getItem("_lobbyId"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGameMessage(data.canMove ? "You can make another move!" : "");
      });
  }

  return (
    <div>
      <h1>{ownerName}'s Lobby</h1>
      <h1>Opponent: {opponentName}</h1>

      <button onClick={props.leaveLobby}>Leave Lobby</button>

      <img
        src={rock}
        alt="Rock"
        width="200"
        height="200"
        onClick={() => gamePlay(0)}
      />
      <img
        src={paper}
        alt="Paper"
        width="200"
        height="200"
        onClick={() => gamePlay(1)}
      />
      <img
        src={scissors}
        alt="Scissors"
        width="200"
        height="200"
        onClick={() => gamePlay(2)}
      />

      <h5>{gameMessage}</h5>
    </div>
  );
}

export default RPSGame;
