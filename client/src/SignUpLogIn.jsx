import { React, useRef } from "react";

//         let boxStyle = {
//             justifyItems: "center",
//             display: "block"
//         }
//         let formStyle = {

//         }
//         let inputStyle = {
//             margin: "10px",
//             padding: "7px",
//             width: "190px"
//         }
//         let checkStyle = {
//             margin: "10px",
//             cursor: "pointer"
//         }
//         let noteStyle = {
//             fontSize: "12px"
//         }
//         let submitStyle = {
//             padding: "10px",
//             backgroundColor: "#3bdb9e",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer"
//         }

function SignUpLogIn(props) {
  const usernameInput = useRef("");
  const passwordInput = useRef("");
  const emailInput = useRef("");

  return (
    <div>
      <h4>Please fill out the form below to create an account.</h4>
      <hr />
      <div>
        <input
          type="text"
          placeholder="Username"
          ref={usernameInput}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          ref={passwordInput}
          required
        />
        <br />
        <input type="email" placeholder="Email" ref={emailInput} required />
        <br />
        <p>
          By signing up, you have read and agreed to our{" "}
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Privacy
          </a>
          .
        </p>
        <button
          onClick={() => {
            props.signUp(
              usernameInput.current.value,
              passwordInput.current.value,
              emailInput.current.value,
            );
          }}
        >
          Sign Up
        </button>
      </div>
      <hr />
      <h4>Already have an account? Log In</h4>
      <hr />
      <div>
        <input
          type="text"
          placeholder="Username"
          ref={usernameInput}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          ref={passwordInput}
          required
        />
        <br />
        {/* <input type="submit" value="Log In" /> */}

        <button
          onClick={() => {
            props.logIn(
              usernameInput.current.value,
              passwordInput.current.value,
            );
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default SignUpLogIn;
