import React, { useState } from "react";

export default function Landing(props) {
  //use states are defined here
  //   const [isLoggedIn, setIsLoggedin] = useState(False);
  //   const [isBadLogin, setIsBadLogin] = useState(False);

  return (
    <div className="cover-container w-100 h-100 p-3 d-flex text-center mx-auto flex-column">
      <header className="mb-auto"></header>

      <main className="px-3 landing-main mx-auto">
        <h1>Whipers...</h1>
        <p className="lead">
          This is for chatting and talking ig. Write somethign good here later.
        </p>

        <div className="row">
          <div className="col-2"></div>
          <button
            type="button"
            className="btn btn-outline-light col-3  px-2 rounded-3"
            onClick={() => {
              props.changeIsRegistered();
            }}
          >
            Sign Up
          </button>
          <div className="col-2"></div>
          <button
            type="button"
            className="btn btn-outline-light col-3 px-2 rounded-3"
            onClick={() => {
              props.changeWantsToLogin();
            }}
          >
            Log In
          </button>
          <div className="col-2"></div>
        </div>
      </main>

      <footer className="mt-auto text-white-50">
        <p>
          Made for <span className="text-white">Whispers</span>
        </p>
      </footer>
    </div>
  );
}
