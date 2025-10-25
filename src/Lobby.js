import React from "react"

class Lobby extends React.Component {
    constructor(props) {
        super(props)
        this.joinLobby = this.joinLobby.bind(this)
    }
    joinLobby() {
        localStorage.setItem("_lobbyId", this.props.data._id)
        let accountId = localStorage.getItem("_id")
        fetch("http://localhost:3001/joinLobby", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                accountId: accountId,
                lobbyId: this.props.data._id
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
            if (data.success) {
                this.props.setLobbyId(this.props.data._id)
            }
        })
    }
    render() {
        return (
            <div>
                <h1>{this.props.data.ownerName}'s Lobby</h1>
                <button onClick={this.joinLobby}>Join Lobby</button>
            </div>
        )
    }
}

export default Lobby