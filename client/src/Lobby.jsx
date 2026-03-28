function Lobby(props) {
  function joinLobby() {
    localStorage.setItem("_lobbyId", props.data._id);
    const accountId = localStorage.getItem("_id");
    fetch("joinLobby", {
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
        if (data.success) {
          props.setLobbyId(props.data._id);
        }
      });
  }
  return (
    <div>
      <h1>{props.data.ownerName}'s Lobby</h1>
      <button onClick={joinLobby}>Join Lobby</button>
    </div>
  );
}

export default Lobby;
