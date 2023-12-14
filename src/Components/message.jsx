import React from "react";
import { format } from "timeago.js";
import { Avatar } from "@mui/material";
import MsgOptions from "./msg-options";

export default function Message(props) {
  return (
    <div className={props.own ? "message own" : "message friend"}>
      {/* options to delete the message */}
      <div className="message-top">
        {!props.isReply && (
          <>
            <MsgOptions
              own={props.own}
              deleteMessage={() => {
                props.deleteMessage(props.message._id);
              }}
              reply={() => {
                props.reply(props.message);
              }}
            />
          </>
        )}
        {/* the message */}

        {props.own ? (
          <>
            {props.message.reply ? (
              <>
                {/* this renders the logged in user's messages that have a reply and their replies */}
                <div>
                  <Message
                    message={props.message.reply}
                    isReply={true}
                    // reply={handleIsReply}
                    userLoggedIn={props.userLoggedIn}
                    friend={props.friend}
                    own={true}
                  />
                  <div className="message-top">
                    <span
                      id="msg-with-reply"
                      className="message-text color-own"
                    >
                      {props.message.text}
                    </span>
                    {props.userLoggedIn.pic.length ? (
                      <img
                        className="message-img"
                        src={props.userLoggedIn.pic}
                        alt=""
                      />
                    ) : (
                      <Avatar sx={{ height: 32, width: 32 }}>
                        {" "}
                        {props.userLoggedIn.name[0]}{" "}
                      </Avatar>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* this renders the logged in users messages that dont have replies */}
                <div className="message-top">
                  <span
                    className={
                      props.isReply
                        ? "message-text mb-1 reply-text color-own reply-width"
                        : "message-text color-own"
                    }
                  >
                    {props.isReply
                      ? props.message.text.slice(0, 100)
                      : props.message.text}
                  </span>
                  {!props.isReply ? (
                    props.userLoggedIn.pic.length ? (
                      <img
                        className="message-img"
                        src={props.userLoggedIn.pic}
                        alt=""
                      />
                    ) : (
                      <Avatar sx={{ height: 32, width: 32 }}>
                        {" "}
                        {props.userLoggedIn.name[0]}{" "}
                      </Avatar>
                    )
                  ) : (
                    <>
                      <img
                        className="message-img reply-img"
                        src={props.userLoggedIn.pic}
                        alt=""
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {props.message.reply ? (
              <>
                {/* this renders the friend's messages that have replies */}
                <div>
                  <Message
                    message={props.message.reply}
                    isReply={true}
                    // reply={handleIsReply}
                    userLoggedIn={props.userLoggedIn}
                    friend={props.friend}
                    own={false}
                  />
                  <div className="message-top">
                    {props.friend.pic?.length ? (
                      <img
                        className="message-img"
                        src={props.friend.pic}
                        alt=""
                      />
                    ) : (
                      <Avatar
                        className="message-img"
                        sx={{ height: 32, width: 32 }}
                      >
                        {" "}
                        {props.friend.name && props.friend.name[0]}{" "}
                      </Avatar>
                    )}{" "}
                    <span className="message-text">{props.message.text}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* this renders the friend's messages that dont have replies */}
                <div className="message-top">
                  {!props.isReply ? (
                    props.friend.pic?.length ? (
                      <img
                        className="message-img"
                        src={props.friend.pic}
                        alt=""
                      />
                    ) : (
                      <Avatar
                        className="message-img"
                        sx={{ height: 32, width: 32 }}
                      >
                        {" "}
                        {props.friend.name && props.friend.name[0]}{" "}
                      </Avatar>
                    )
                  ) : (
                    <>
                      <img
                        className="message-img reply-img"
                        src={props.userLoggedIn?.pic}
                        alt=""
                      />
                    </>
                  )}
                  <span
                    className={
                      props.isReply
                        ? "message-text mb-1 reply-text"
                        : "message-text"
                    }
                  >
                    {props.isReply
                      ? props.message.text.slice(0, 100)
                      : props.message.text}
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {!props.isReply && props.message.createdAt && (
          <div
            className={props.own ? "message-bottom" : "message-bottom-friend"}
          >
            {format(props.message.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
}
