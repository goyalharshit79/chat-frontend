import React, { useState } from "react";
import axios from "axios";

export default function Signup(props) {
  const [showingPassword, setShowingPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  function handleSignup(event) {
    event.preventDefault();
    validate() ? doSignUp(event) : console.log("dont bro");
  }
  const doSignUp = async (event) => {
    try {
      const data = new FormData(event.currentTarget);
      const reqData = {
        name: data.get("floatingname"),
        password: data.get("floatingConfirmPassword"),
        email: data.get("floatingEmail"),
      };
      const res = await axios.post(
        process.env.REACT_APP_API_ADRESS + "/signup",
        reqData
      );
      props.closeSignup();
      if (res.status === 200) {
        console.log(res.data.msg);
      } else {
        console.log(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function validate() {
    const [emptyElements, filledElements] = isEmpty();
    invalid(emptyElements);
    notInvalid(filledElements);
    return passwordsMatch ? (emptyElements.length === 0 ? true : false) : false;
  }

  function isEmpty() {
    const empty = [];
    const filledElements = [];
    const inputs = document.getElementsByClassName("form-control");
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value === "") {
        empty.push(inputs[i].id);
      } else {
        filledElements.push(inputs[i].id);
      }
    }
    return [empty, filledElements];
  }

  function confirmPassword() {
    document.getElementById("floatingConfirmPassword").value ===
    document.getElementById("floatingPassword").value
      ? valid(["floatingConfirmPassword", "floatingPassword"])
      : invalid(["floatingConfirmPassword"]);
  }
  function valid(id) {
    id.forEach((element) => {
      document.getElementById(element).classList.add("is-valid");
      document.getElementById(element).classList.remove("is-invalid");
      if (element === "floatingConfirmPassword") {
        setPasswordsMatch(true);
      }
    });
  }
  function notInvalid(id) {
    id.forEach((element) => {
      if (element !== "floatingConfirmPassword") {
        document.getElementById(element).classList.remove("is-invalid");
      }
    });
  }
  function invalid(id) {
    id.forEach((element) => {
      document.getElementById(element).classList.add("is-invalid");
      document.getElementById(element).classList.remove("is-valid");
      if (element === "floatingConfirmPassword") {
        setPasswordsMatch(false);
      }
    });
  }

  function toggleShowPassword() {
    showingPassword ? stopShowingPassword() : showPassword();
  }
  function showPassword() {
    document.getElementById("floatingPassword").setAttribute("type", "text");
    document
      .getElementById("floatingConfirmPassword")
      .setAttribute("type", "text");
    setShowingPassword(true);
  }
  function stopShowingPassword() {
    document
      .getElementById("floatingPassword")
      .setAttribute("type", "password");
    document
      .getElementById("floatingConfirmPassword")
      .setAttribute("type", "password");
    setShowingPassword(false);
  }
  return (
    <div
      className="modal bg-transparent d-block pt-4"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-color rounded-4 shadow">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h2 className="fw-bold text-color-main mb-0 ">Sign Up</h2>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={props.closeSignup}
            ></button>
          </div>
          <div className="modal-body p-5 pt-0">
            <form id="signupForm" onSubmit={handleSignup}>
              <div className="row">
                <div className="col-md-6 form-floating mb-3 left-padding">
                  <input
                    className="form-control w-100 rounded-3 my-input"
                    id="floatingEmail"
                    name="floatingEmail"
                    placeholder="Email"
                    type="email"
                  />
                  <label htmlFor="floatingEmail" className="mx-3">
                    Email
                  </label>
                </div>
                <div className="col-md-6 form-floating mb-3 left-padding">
                  <input
                    type="text"
                    className="form-control rounded-3 my-input"
                    id="floatingname"
                    name="floatingname"
                    placeholder="Name"
                  />
                  <label htmlFor="floatingname" className="mx-3">
                    Name
                  </label>
                </div>

                <div className="form-floating mb-3 left-padding">
                  <input
                    type="password"
                    className="form-control rounded-3 my-input"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPassword" className="mx-3">
                    Password
                  </label>
                </div>
                <div className="form-floating mb-3 left-padding">
                  <input
                    type="password"
                    className="form-control rounded-3 my-input"
                    id="floatingConfirmPassword"
                    name="floatingConfirmPassword"
                    placeholder="Confirm Password"
                    onChange={confirmPassword}
                  />
                  <label htmlFor="floatingConfirmPassword" className="mx-3">
                    Confirm Password
                  </label>
                </div>
                <div className="form-floating mb-3 left-padding">
                  <input
                    className="form-check-input my-input"
                    type="checkbox"
                    id="show-password"
                    onClick={toggleShowPassword}
                  />
                  <label
                    htmlFor="show-password"
                    className="p-0 show-password mx-5"
                  >
                    Show Password
                  </label>
                </div>

                <button
                  className="btn btn-lg my-btn rounded-5 btn-color-1"
                  type="submit"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
