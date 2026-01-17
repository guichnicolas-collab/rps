import React from "react"

class Leaderboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
        this.updateLeaderboard = this.updateLeaderboard.bind(this)
    }
    updateLeaderboard() {
        fetch("http://localhost:3001/getLeaderboard").then(
            response => {
            return response.json()
        }).then( data => {
            this.setState({
                users: data.topAccounts
            })
        })
    }
    componentDidMount() {
        this.updateLeaderboard()
        setInterval(this.updateLeaderboard, 7000)
    }

    render() {
        let display = this.state.users.map((item) => {
            return <li>{item.name}: {item.rankPoints}</li>
        })
        return(
            <div>
                <h1>Leaderboard</h1>
                <ol>
                    {display}
                </ol>
            </div>
        )
    }
}

export default Leaderboard