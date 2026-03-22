import { React, useEffect, useState, useCallback } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  const updateLeaderboard = useCallback(() => {
    fetch("http://localhost:3001/getLeaderboard")
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
      <li key={i}>
        {item.name}: {item.rankPoints}
      </li>
    );
  });
  return (
    <div>
      <h1>Leaderboard</h1>
      <ol>{display}</ol>
    </div>
  );
}

export default Leaderboard;
