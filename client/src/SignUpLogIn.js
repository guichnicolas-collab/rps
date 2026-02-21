import React from "react"

class SignUpLogIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            usernameInput: "",
            passwordInput: "",
            emailInput: ""
        }
    }
    render() {
        let boxStyle = {
            justifyItems: "center",
            display: "block"
        }
        let formStyle = {
        
        }
        let inputStyle = {
            margin: "10px",
            padding: "7px",
            width: "190px"
        }
        let checkStyle = {
            margin: "10px",
            cursor: "pointer"
        }
        let noteStyle = {
            fontSize: "12px"
        }
        let submitStyle = {
            padding: "10px",
            backgroundColor: "#3bdb9e",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        }
        return (
            <div>
                <h4>Please fill out the form below to create an account.</h4>
                <hr/>
                <form style={formStyle}>
                    <input style={inputStyle} type="text" placeholder="Username" value={this.state.usernameInput} onChange={(e) => {this.setState({usernameInput: e.target.value})}} required/>
                    <br/>
                    <input style={inputStyle} type="password" placeholder="Password" value={this.state.passwordInput} onChange={(e) => {this.setState({passwordInput: e.target.value})}} required/>
                    <br/>
                    <input style={inputStyle} type="email" placeholder="Email" value={this.state.emailInput} onChange={(e) => {this.setState({emailInput: e.target.value})}} required/>
                    <br/>
                    <p style={noteStyle}>By signing up, you have read and agreed to our <a href="#">Terms and Privacy</a>.</p>
                    <input style={submitStyle} type="submit" value="Sign Up" onClick={() => {this.props.signUp(this.state.usernameInput, this.state.passwordInput, this.state.emailInput)}}/>
                </form>
                <hr/>
                <h4>Already have an account? Log In</h4>
                <hr/>
                <div style={formStyle}>
                    <input style={inputStyle} type="text" placeholder="Username" value={this.usernameInput} onChange={(e) => {this.setState({usernameInput: e.target.value})}} required/>
                    <br/>
                    <input style={inputStyle} type="password" placeholder="Password" value={this.passwordInput} onChange={(e) => {this.setState({passwordInput: e.target.value})}} required/>
                    <br/>
                    <input style={submitStyle} type="submit" value="Log In" onClick={() => {this.props.logIn(this.state.usernameInput, this.state.passwordInput)}}/>
                </div>
            </div>
        )
    }
}

export default SignUpLogIn