import { React, useRef } from "react";
import SignUpLogInCss from "./SignUpLogIn.module.css";

function SignUpLogIn(props) {
  const usernameInput = useRef("");
  const passwordInput = useRef("");
  const emailInput = useRef("");

  return (
    <div className={SignUpLogInCss.boxStyle}>
      <h4>Please fill out the form below to create an account.</h4>
      <hr />
      <div className={SignUpLogInCss.formStyle}>
        <input
          className={SignUpLogInCss.inputStyle}
          type="text"
          placeholder="Username"
          ref={usernameInput}
          required
        />
        <br />
        <input
          className={SignUpLogInCss.inputStyle}
          type="password"
          placeholder="Password"
          ref={passwordInput}
          required
        />
        <br />
        <input
          className={SignUpLogInCss.inputStyle}
          type="email"
          placeholder="Email"
          ref={emailInput}
          required
        />
        <br />
        <p className={SignUpLogInCss.noteStyle}>
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
          className={SignUpLogInCss.submitStyle}
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
      <div className={SignUpLogInCss.formStyle}>
        <input
          className={SignUpLogInCss.inputStyle}
          type="text"
          placeholder="Username"
          ref={usernameInput}
          required
        />
        <br />
        <input
          className={SignUpLogInCss.inputStyle}
          type="password"
          placeholder="Password"
          ref={passwordInput}
          required
        />
        <br />
        {/* <input type="submit" value="Log In" /> */}

        <button
          className={SignUpLogInCss.submitStyle}
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
