import { React, useEffect, useState, useCallback } from "react";
import LeaderboardCss from "./Leaderboard.module.css";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  const updateLeaderboard = useCallback(() => {
    fetch("getLeaderboard")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data.topAccounts);
      });
  }, []);
  useEffect(() => {
    updateLeaderboard();
    const leaderboardInterval = setInterval(updateLeaderboard, 2000);

    return () => {
      clearInterval(leaderboardInterval);
    };
  }, [updateLeaderboard]);
  const display = users.map((item, i) => {
    return (
      <li className={LeaderboardCss.listItemStyle} key={i}>
        {item.name}: {item.rankPoints}
      </li>
    );
  });
  return (
    <div className={LeaderboardCss.contentStyle}>
      <h1 className={LeaderboardCss.titleStyle}>Leaderboard</h1>
      <ol>{display}</ol>
    </div>
  );
}

export default Leaderboard;
