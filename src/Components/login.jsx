import React, { useState } from "react";
import axios from "axios";

export default function Login(props) {
  const [isSmthngWrong, setIsSmthngWrong] = useState("");
  const [good, setGood] = useState("");

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const reqData = {
        email: data.get("email"),
        password: data.get("password"),
      };
      const res = await axios.post(
        process.env.REACT_APP_API_ADRESS + "/login",
        reqData
      );
      if (res.status === 201) {
        setIsSmthngWrong(res.data.msg);
        setGood("");
      } else {
        setIsSmthngWrong("");
        setGood(res.data.msg);
        props.login(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="modal bg-transparent d-block py-5"
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-color rounded-4 shadow">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h2 className="fw-bold mb-0 text-color-main">Log In</h2>
            <button
              type="button"
              className="btn-close close"
              aria-label="Close"
              onClick={props.closeSignin}
            ></button>
          </div>
          <div className="modal-body p-5 pt-0">
            <form onSubmit={handleLogin} method="post">
              <div className="form-floating mb-3">
                <input
                  className="form-control rounded-3 my-input"
                  id="floatingInput"
                  name="email"
                  placeholder="email"
                  required
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3 my-input"
                  id="floatingPassword"
                  name="password"
                  placeholder="Password"
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
              <button
                className=" w-100 btn btn-lg rounded-5 my-btn"
                type="submit"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
      {isSmthngWrong.length ? (
        <div class="alert alert-danger my-alert" role="alert">
          {isSmthngWrong}
        </div>
      ) : (
        <></>
      )}
      {good.length && (
        <div class="alert alert-success my-alert" role="alert">
          {good}
        </div>
      )}
    </div>
  );
}
