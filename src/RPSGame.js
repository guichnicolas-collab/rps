import React from "react"
import rock from "./assets/Rock.jpeg"
import paper from "./assets/Paper.jpeg"
import scissors from "./assets/Scissors.jpeg"

//the game session for when you've joined a lobby and playing rock paper scissors
//show name of players in this lobbu
//write a leave lobby button
//note: think about whay props this component needs

class RPSGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ownerName: "",
            opponentName: "",
            gameMessage: ""
        }
        this.computerGamePlay = this.computerGamePlay.bind(this)
    }
    componentDidMount() {
        fetch("http://localhost:3001/getLobby", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                lobbyId: this.props.lobbyId
            })
            }).then(
                response => {
                    return response.json()
            }
            ).then(
                data => {
                    console.log(data)
                    this.setState({ownerName: data.lobby.ownerName, opponentName: data.lobby.opponentName})
                }
            )
    }
    computerGamePlay(object) {
        // r > s, s > p, p > r 
        let computerObject = Math.floor(Math.random() * 3)
        if (object == computerObject) {
            this.setState({gameMessage: "It's a tie!"})
        } else if (object == 0 && computerObject == 1) {
            this.setState({gameMessage: "Computer Choice: Paper.  Computer wins!"})
        } else if (object == 0 && computerObject == 2) {
            this.setState({gameMessage: "Computer Choice: Scissors.  You win!"})
        } else if (object == 1 && computerObject == 0) {
            this.setState({gameMessage: "Computer Choice: Rock.  You win!"})
        } else if (object == 1 && computerObject == 2) {
            this.setState({gameMessage: "Computer Choice: Scissors.  Computer wins!"})
        } else if (object == 2 && computerObject == 0) {
            this.setState({gameMessage: "Computer Choice: Rock.  Computer wins!"})
        } else if (object == 2 && computerObject == 1) {
            this.setState({gameMessage: "Computer Choice: Paper.  You win!"})
        }
    }
    render() {
        return (
            <div>
                <h1>{this.state.ownerName}'s Lobby</h1>
                <h1>Opponent: {this.state.opponentName}</h1>
                <button onClick={this.props.leaveLobby}>Leave Lobby</button>
                <img src={rock} alt="Rock" width="200" height="200" onClick={() => this.computerGamePlay(0)}/>
                <img src={paper} alt="Paper" width="200" height="200" onClick={() => this.computerGamePlay(1)}/>
                <img src={scissors} alt="Scissors" width="200" height="200" onClick={() => this.computerGamePlay(2)}/>
                <h5>{this.state.gameMessage}</h5>
            </div>
        )
    }
}

export default RPSGame