import { Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";

const SignIn = ({ onSignIn, loadUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user._id) {
          loadUser(user);
          onSignIn();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <article className=" br4 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 shadow-5 center">
      <main className="pa4 black-80 ">
        <form className="measure" onSubmit={handleSignIn}>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f2 fw6 ph0 mh0 center">Sign In</legend>
            <div className="mt3 ">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                className="pa2 input-reset bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={handleEmailChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className=" pa2 input-reset bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={handlePasswordChange}
              />
            </div>
          </fieldset>
          <div className="center">
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Sign in"
            />
          </div>
          <div className="lh-copy mt3 center">
            <Link to="/register" className="f6 link dim black db">
              Register
            </Link>
          </div>
        </form>
      </main>
    </article>
  );
};

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
};

export default SignIn;
