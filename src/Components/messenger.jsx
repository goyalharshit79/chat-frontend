import React, { useState, useEffect, useRef } from "react";
import Message from "./message";
import axios from "axios";
import AccountMenu from "./account-options";
import { Avatar } from "@mui/material";
import InputEmoji from "react-input-emoji";
import CloseIcon from "@mui/icons-material/Close";
// import { io } from "socket.io-client";
import Typing from "./typing";

export default function Messenger(props) {
  // const socketRef = useRef();
  const scrollRef = useRef();

  const [showTyping, setShowTyping] = useState(null);
  // useEffect(() => {
  //   socketRef.current = io("https://65.2.29.56:3000");
  //   socketRef.current.on("getMessage", (message) => {
  //     getMessages();
  //   });
  //   socketRef.current.on("deleteTheMessage", () => {
  //     getMessages();
  //   });
  //   socketRef.current.on("showTheTyping", (id) => {
  //     if (id.id === "") {
  //       setShowTyping(null);
  //     } else {
  //       setShowTyping(id.id);
  //     }
  //   });
  // }, []);
  const [isReply, setIsReply] = useState({});
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState("");
  const [text, setText] = useState("");

  // scrolling to the last message
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  });

  //getting messages every sometime
  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 5000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  //for settng height
  useEffect(() => {
    const curr = document.getElementById("curr");
    const posInfoCurr = curr.getBoundingClientRect();

    const sendBox = document.getElementById("send-box");
    const posInfoSendBox = sendBox.getBoundingClientRect();

    const body = document.body;
    const html = document.documentElement;

    const bodyHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    const toSet = bodyHeight - (posInfoCurr.height + posInfoSendBox.height);
    // document
    //   .getElementByClassName("chat-container")
    //   .setAttribute("style", "height:100%");
    // console.log(toSet);
    document
      .getElementById("chat")
      .setAttribute("style", "height:" + toSet + "px");
    // console.log(bodyHeight, posInfoCurr.height, posInfoSendBox.height);
  }, []);

  //for getting messages
  const getMessages = async () => {
    const res = await axios.get(
      process.env.REACT_APP_API_ADRESS + "/get-messages"
    );
    setMessages(res.data);
  };
  useEffect(() => {
    getMessages();
  }, []);

  // useEffect(() => {
  //   const getId = async () => {
  //     try {
  //       const res = await axios.get(
  //         process.env.REACT_APP_API_ADRESS +
  //           "/get-userid/" +
  //           props.userLoggedIn?.email
  //       );
  //       setUserLoggedId(res.data.id);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getId();
  // }, [props.userLoggedIn]);

  //for getting friend

  useEffect(() => {
    const getFriend = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADRESS +
            "/get-friend/" +
            props.userLoggedIn?._id
        );
        setFriend(res.data.friend);
      } catch (error) {
        // console.log(error);
      }
    };
    getFriend();
  }, [props.userLoggedIn]);

  //for sending messges
  const handleSendMessage = async (e) => {
    try {
      if (e.target?.id === "send-box") {
        e.preventDefault();
      }
      const reqData = {
        text: text,
        read: false,
        reply: isReply,
        senderId: props.userLoggedIn?._id,
      };
      const res = await axios.post(
        process.env.REACT_APP_API_ADRESS + "/new-message",
        reqData
      );
      if (res.status === 200) {
        setIsReply({});
        setText("");
        getMessages();
        // socketRef.current.emit("sendMessage", reqData);
        // socketRef.current.emit("showTyping", { id: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_ADRESS + "/delete-message/" + id
      );
      if (res.status === 200) {
        getMessages();
        // socketRef.current.emit("deleteMessage");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowTyping = async (e) => {
    try {
      setText(e);
      if (e === "") {
        // console.log("first");
        // socketRef.current.emit("showTyping", { id: "" });
      } else {
        // console.log("sec");
        // socketRef.current.emit("showTyping", { id: props.userLoggedIn._id });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //for setting replies
  const handleIsReply = async (r) => {
    try {
      setIsReply(r);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chats-container">
      <div className="chats-wrapper">
        <>
          <div className="current-contact" id="curr">
            <AccountMenu
              openAccountPage={props.accountClicked}
              handleLogout={props.handleLogout}
              userLoggedIn={props.userLoggedIn}
            />
            {friend.pic?.length ? (
              <>
                <img
                  src={friend.pic}
                  className="ms-4 mt-2 profile-img"
                  alt=""
                />
              </>
            ) : (
              <>
                <Avatar className="ms-4 mt-2">
                  {" "}
                  {friend.name && friend.name[0]}{" "}
                </Avatar>
              </>
            )}
            <span className="conv-name ms-3 mt-2 fw-bold">{friend.name}</span>
          </div>
          <div className="chat-top" id="chat">
            {messages?.map((m) => {
              return (
                m && (
                  <>
                    <div ref={scrollRef}>
                      <Message
                        deleteMessage={deleteMessage}
                        message={m}
                        reply={handleIsReply}
                        userLoggedIn={props.userLoggedIn}
                        friend={friend}
                        own={
                          m?.senderId === props.userLoggedIn?._id ? true : false
                        }
                      />
                    </div>
                  </>
                )
              );
            })}
            {showTyping ? (
              showTyping !== props.userLoggedIn._id && (
                <div ref={scrollRef}>
                  <Typing sender={friend} />
                </div>
              )
            ) : (
              <></>
            )}
          </div>
          <form
            className="chat-bottom"
            id="send-box"
            onSubmit={handleSendMessage}
          >
            {isReply.text ? (
              <>
                <p className="replying">
                  <span className="replying-to">Replying to: </span>
                  {isReply.text.length > 50
                    ? isReply.text.slice(0, 50) + "..."
                    : isReply.text}
                  <CloseIcon
                    className="ms-2"
                    onClick={() => {
                      setIsReply("");
                    }}
                  />
                </p>
              </>
            ) : (
              <></>
            )}
            {/* <textarea
              name="chatMessage"
              id="chatMessage"
              className="chat-message-input mx-2"
              // onChange={handleShowTyping}
            ></textarea> */}
            <div className="chat-message-input">
              <InputEmoji
                value={text}
                onChange={(e) => {
                  handleShowTyping(e);
                }}
                cleanOnEnter
                onEnter={handleSendMessage}
                placeholder="Type a message"
              />
            </div>
            <button className="chat-message-send btn rounded-3 btn-outline-light">
              Send
            </button>
          </form>
        </>
      </div>
    </div>
  );
}
