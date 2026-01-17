import React from "react"
import rock from "./assets/Rock.jpeg"
import paper from "./assets/Paper.jpeg"
import scissors from "./assets/Scissors.jpeg"

// zoom link: https://us05web.zoom.us/j/6992957106?pwd=aWFFTUFuQUxKaEh0eWxCck9lZWtSQT09#success

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
        this.gamePlay = this.gamePlay.bind(this)
        this.updateLobby = this.updateLobby.bind(this)
        this.checkBothPlayed = this.checkBothPlayed.bind(this)
        this.canPlay = this.canPlay.bind(this)
        this.myInterval = null
        this.playedInterval = null
        this.canPlayInterval = null
    }
    componentDidMount() {
        this.myInterval = setInterval(this.updateLobby, 6000)
        this.playedInterval = setInterval(this.checkBothPlayed, 4500)
        this.canPlayInterval = setInterval(this.canPlay, 5000)
    }
    componentWillUnmount() {
        console.log("component unmounting")
        clearInterval(this.myInterval)
        clearInterval(this.playedInterval)
        clearInterval(this.canPlayInterval)
    }
    updateLobby() {
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
    updateRank(points) {
        fetch("http://localhost:3001/updateRankPoints", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                accountId: localStorage.getItem("_id"),
                points: points
            })
            }).then(
                response => {
                    return response.json()
            }
            ).then(
                data => {
                    
                }
            )
    }
    gamePlay(object) {
        if (this.state.opponentName === "") {
            // r > s, s > p, p > r 
            // r = 0
            // p = 1
            // s = 2
            let computerObject = Math.floor(Math.random() * 3)
            if (object === computerObject) {
                this.setState({gameMessage: "It's a tie!"})
            } else if (object === 0 && computerObject === 1) {
                this.setState({gameMessage: "Computer Choice: Paper.  Computer wins!"})
                this.updateRank(-1)
            } else if (object === 0 && computerObject === 2) {
                this.setState({gameMessage: "Computer Choice: Scissors.  You win!"})
                this.updateRank(1)
            } else if (object === 1 && computerObject === 0) {
                this.setState({gameMessage: "Computer Choice: Rock.  You win!"})
                this.updateRank(1)
            } else if (object === 1 && computerObject === 2) {
                this.setState({gameMessage: "Computer Choice: Scissors.  Computer wins!"})
                this.updateRank(-1)
            } else if (object === 2 && computerObject === 0) {
                this.setState({gameMessage: "Computer Choice: Rock.  Computer wins!"})
                this.updateRank(-1)
            } else if (object === 2 && computerObject === 1) {
                this.setState({gameMessage: "Computer Choice: Paper.  You win!"})
                this.updateRank(1)
            }
        } else {
            let objects = ["rock", "paper", "scissors"]
            fetch("http://localhost:3001/makeMove", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    accountId: localStorage.getItem("_id"),
                    lobbyId: localStorage.getItem("_lobbyId"),
                    move: objects[object]
                })
                }).then(
                    response => {
                        return response.json()
                }
                ).then(
                    data => {
                        if (data.success) {
                            
                        }
                    }
                )
        }
    }
    async checkBothPlayed() {
        await fetch("http://localhost:3001/checkBothPlayed", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                lobbyId: localStorage.getItem("_lobbyId")
            })
            }).then(
                response => {
                    return response.json()
            }
            ).then(
                async data => {
                    if (data.success) {
                        await fetch("http://localhost:3001/checkMove", {
                            method: "POST",
                            headers: {
                                'Content-Type': "application/json"
                            },
                            body: JSON.stringify({
                                lobbyId: localStorage.getItem("_lobbyId")
                            })
                            }).then(
                                response => {
                                    return response.json()
                            }
                            ).then(
                                async data => {
                                    this.setState({gameMessage: data.message})
                                    await fetch("http://localhost:3001/receivedResult", {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': "application/json"
                                    },
                                    body: JSON.stringify({
                                        accountId: localStorage.getItem("_id"),
                                        lobbyId: localStorage.getItem("_lobbyId")
                                    })
                                    }).then(
                                        response => {
                                            return response.json()
                                    })
                                }
                            )
                    }
                }
            )
    }
    canPlay() {
        fetch("http://localhost:3001/canMove", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                accountId: localStorage.getItem("_id"),
                lobbyId: localStorage.getItem("_lobbyId")
            })
            }).then(
                response => {
                    return response.json()
            }).then(
                data => {
                    this.setState({gameMessage: data.canMove ? "You can make another move!" : ""})
                }
            )
    }
    render() {
        return (
            <div>
                <h1>{this.state.ownerName}'s Lobby</h1>
                <h1>Opponent: {this.state.opponentName}</h1>
                <button onClick={() => {this.props.leaveLobby()}}>Leave Lobby</button>
                <img src={rock} alt="Rock" width="200" height="200" onClick={() => this.gamePlay(0)}/>
                <img src={paper} alt="Paper" width="200" height="200" onClick={() => this.gamePlay(1)}/>
                <img src={scissors} alt="Scissors" width="200" height="200" onClick={() => this.gamePlay(2)}/>
                <h5>{this.state.gameMessage}</h5>
            </div>
        )
    }
}

export default RPSGame