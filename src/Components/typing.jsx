import React from "react";
import { Avatar } from "@mui/material";

export default function Typing(props) {
  return (
    <div className="message">
      <div className="message-top">
        {props.sender.pic.length > 0 ? (
          <>
            <img className="message-img" src={props.sender.pic} alt="" />
          </>
        ) : (
          <Avatar className="message-img" sx={{ height: 32, width: 32 }}>
            {" "}
            {props.sender.name && props.sender.name[0]}{" "}
          </Avatar>
        )}

        <span className="message-text">Typing...</span>
      </div>
    </div>
  );
}
