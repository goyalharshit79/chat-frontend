import React from "react";
import { Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Account(props) {
  return (
    <div className="account-container mx-auto">
      <ArrowBackIcon
        className="back-arrow"
        sx={{ height: 64, width: 32 }}
        onClick={props.goToMessages}
      />

      <input
        className="form-control visually-hidden"
        type="file"
        id="files"
        name="files"
        accept="image/*"
        onChange={props.handleAddPic}
      />
      <label htmlFor="files" className="mx-auto pic-update">
        {props.userLoggedIn?.pic.length ? (
          <>
            <img
              src={props.userLoggedIn.pic}
              className="img-placeholder"
              alt="DP here"
            />
          </>
        ) : (
          <>
            <Avatar className="img-placeholder" />
          </>
        )}
      </label>
      <div className="user-details">
        <p className="dets">Name : {props.userLoggedIn?.name}</p>
        <p className="dets ">Email : {props.userLoggedIn?.email}</p>
      </div>
    </div>
  );
}
