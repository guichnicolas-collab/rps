import { React, useState, useEffect, useCallback } from "react";
import Lobby from "../Lobby/Lobby";
import RPSGame from "../RPSGame/RPSGame";
import Leaderboard from "../Leaderboard/Leaderboard";
import GameLobbyCss from "./GameLobby.module.css";

function GameLobby(props) {
  const [lobbyId, setLobbyId] = useState(() =>
    localStorage.getItem("_lobbyId"),
  );
  const [lobbies, setLobbies] = useState([]);

  const getLobbies = useCallback(() => {
    fetch("getLobbies")
      .then((response) => response.json())
      .then((data) => {
        setLobbies(data.lobbies);
      });
  }, []);

  const checkLobby = useCallback(() => {
    fetch("getLobby", {
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
        if (!data.success) {
          setLobbyId(null);
          localStorage.removeItem("_lobbyId");
        }
      });
  }, []);

  const createLobby = useCallback(() => {
    const accountId = localStorage.getItem("_id");

    fetch("createLobby", {
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
        if (data.success) {
          setLobbyId(data.lobbyId);
          localStorage.setItem("_lobbyId", data.lobbyId);
        }
      });
  }, []);

  const leaveLobby = useCallback(() => {
    const accountId = localStorage.getItem("_id");

    fetch("leaveLobby", {
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
        if (data.success) {
          setLobbyId(null);
          localStorage.removeItem("_lobbyId");
        }
      });

    setLobbyId(null);
    localStorage.removeItem("_lobbyId");
  }, []);

  useEffect(() => {
    checkLobby();
    getLobbies();
    const lobbyCheck = setInterval(checkLobby, 3000);
    const lobbyList = setInterval(getLobbies, 3000);

    return () => {
      clearInterval(lobbyCheck);
      clearInterval(lobbyList);
    };
  }, [checkLobby, getLobbies]);

  const lobbyDisplay = lobbies.map((item) => {
    return <Lobby data={item} key={item._id} setLobbyId={setLobbyId} />;
  });

  let content = (
    <div className={GameLobbyCss.childStyle}>
      <button className={GameLobbyCss.buttonStyle} onClick={createLobby}>
        Create Lobby
      </button>
      <div className={GameLobbyCss.lobbyDisplayStyle}>{lobbyDisplay}</div>
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
      Logged in as: {props.session.username}
      <button className={GameLobbyCss.buttonStyle} onClick={props.logOut}>
        Log Out
      </button>
      <div className={GameLobbyCss.contentStyle}>
        {content}
        <div className={GameLobbyCss.leaderboardStyle}>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default GameLobby;
