import React, { useState, useEffect, useCallback } from "react";
import rock from "./assets/Rock.jpeg";
import paper from "./assets/Paper.jpeg";
import scissors from "./assets/Scissors.jpeg";

// zoom link: https://us05web.zoom.us/j/6992957106?pwd=aWFFTUFuQUxKaEh0eWxCck9lZWtSQT09#success

// function to delay code execution
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function RPSGame(props) {
  const [ownerName, setOwnerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [gameMessage, setGameMessage] = useState("");

  const updateLobby = useCallback(async () => {
    const response = await fetch("http://localhost:3001/getLobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: props.lobbyId,
      }),
    });
    const data = await response.json();
    if (data.lobby) {
      setOwnerName(data.lobby.ownerName);
      setOpponentName(data.lobby.opponentName);
    }
  }, [props.lobbyId]);

  async function updateRank(points) {
    const response = await fetch("http://localhost:3001/updateRankPoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: localStorage.getItem("_id"),
        points: points,
      }),
    });
    await response.json();
  }

  async function gamePlay(object) {
    if (opponentName === "") {
      const computerObject = Math.floor(Math.random() * 3);

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
      const objects = ["rock", "paper", "scissors"];

      const response = await fetch("http://localhost:3001/makeMove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: localStorage.getItem("_id"),
          lobbyId: localStorage.getItem("_lobbyId"),
          move: objects[object],
        }),
      });
      await response.json();
    }
  }

  const checkBothPlayed = useCallback(async () => {
    const res = await fetch("http://localhost:3001/checkBothPlayed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: localStorage.getItem("_lobbyId"),
      }),
    });
    if (res.status === 404) {
      localStorage.removeItem("_lobbyId");
      alert("Owner left game. Returning to main page.");
      window.location.reload();
      return;
    }
    const data = await res.json();

    if (!data.success) {
      return;
    }
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
  }, []);

  const canPlay = useCallback(async () => {
    const response = await fetch("http://localhost:3001/canMove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: localStorage.getItem("_id"),
        lobbyId: localStorage.getItem("_lobbyId"),
      }),
    });
    const data = await response.json();
    setGameMessage(data.canMove ? "You can make another move!" : "");
  }, []);

  useEffect(() => {
    const lobbyInterval = setInterval(updateLobby, 3000);
    const playedInterval = setInterval(checkBothPlayed, 2500);
    const canPlayInterval = setInterval(canPlay, 3100);

    return () => {
      clearInterval(lobbyInterval);
      clearInterval(playedInterval);
      clearInterval(canPlayInterval);
    };
  }, [updateLobby, checkBothPlayed, canPlay]);

  return (
    <div>
      <h1>{ownerName}&apos;s Lobby</h1>
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
