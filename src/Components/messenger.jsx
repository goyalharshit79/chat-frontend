import React, { useState, useEffect, useRef } from "react";
import Message from "./message";
import axios from "axios";
import AccountMenu from "./account-options";
import { Avatar } from "@mui/material";
import InputEmoji from "react-input-emoji";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import Typing from "./typing";
import InfiniteScroll from "react-infinite-scroller";

export default function Messenger(props) {
  const socketRef = useRef();
  const scrollRef = useRef();

  const [showTyping, setShowTyping] = useState(null);
  useEffect(() => {
    console.log("connecting to socket");
    socketRef.current = io("https://faithful-lopsided-mouth.glitch.me");
    socketRef.current.on("getMessage", (message) => {
      getMessages();
    });
    socketRef.current.on("deleteTheMessage", () => {
      getMessages();
    });
    socketRef.current.on("showTheTyping", (id) => {
      if (id.id === "") {
        setShowTyping(null);
      } else {
        setShowTyping(id.id);
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, []);
  const [isReply, setIsReply] = useState({});
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState("");
  const [text, setText] = useState("");
  const [page, setPage] = useState(2);
  const [max, setMax] = useState(1);
  // const [currentMessages, setCurrentMessages] = useState(0);
  // scrolling to the last message
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  //getting messages every sometime

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getMessagesFromScroll();
  //   }, 3000);
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);

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
      process.env.REACT_APP_API_ADRESS + "/get-messages/" + page
    );
    setMessages(res.data.messages);
    setPage(page + 1);
  };
  // const getMessagesFromScroll = async (fromScroll) => {
  //   if (max !== messages.length) {
  //     const res = await axios.get(
  //       process.env.REACT_APP_API_ADRESS + "/get-messages/" + page
  //     );
  //     if (res.data.messages.length > messages.length) {
  //       setMessages(res.data.messages);
  //     }
  //     if (fromScroll) {
  //       setPage(page + 1);
  //     }
  //     setMax(res.data.max);
  //   }
  // };

  useEffect(() => {
    getMessages();
  }, []);

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
      const data = new FormData(e.currentTarget);
      const reqData = {
        text: data.get("chatMessage"),
        read: false,
        reply: isReply,
        senderId: props.userLoggedIn?._id,
      };
      if (reqData.text !== "") {
        e.preventDefault();
        const res = await axios.post(
          process.env.REACT_APP_API_ADRESS + "/new-message",
          reqData
        );
        if (res.status === 200) {
          setIsReply({});
          document.getElementById("chatMessage").value = "";
          // getMessages();
          scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
          socketRef.current.emit("sendMessage", reqData);
          socketRef.current.emit("showTyping", { id: "" });
        }
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
      getMessages();
      if (res.status === 200) {
        socketRef.current.emit("deleteMessage");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowTyping = async (e) => {
    try {
      if (e.target.value === "") {
        socketRef.current.emit("showTyping", { id: "" });
      } else {
        socketRef.current.emit("showTyping", { id: props.userLoggedIn._id });
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
            <span className="conv-name ms-3 mt-2 fw-bold dets">
              {friend.name}
            </span>
          </div>
          <div className="chat-top" id="chat">
            <InfiniteScroll
              pageStart={1}
              loadMore={() => {
                getMessages();
              }}
              hasMore={max !== messages.length}
              loader={
                <div className="loader" key={0}>
                  Loading ...
                </div>
              }
              isReverse={true}
              useWindow={false}
            >
              {messages?.map((m) => {
                return (
                  m && (
                    <>
                      <div>
                        <Message
                          deleteMessage={deleteMessage}
                          message={m}
                          reply={handleIsReply}
                          userLoggedIn={props.userLoggedIn}
                          friend={friend}
                          own={
                            m?.senderId === props.userLoggedIn?._id
                              ? true
                              : false
                          }
                        />
                      </div>
                    </>
                  )
                );
              })}
            </InfiniteScroll>
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
            <textarea
              name="chatMessage"
              id="chatMessage"
              className="chat-message-input mx-2"
              onChange={(e) => {
                handleShowTyping(e);
              }}
            ></textarea>
            {/* <div className="chat-message-input mx-2">
              <InputEmoji
                value={text}
                onChange={(e) => {
                  handleShowTyping(e);
                }}
                cleanOnEnter
                onEnter={handleSendMessage}
                placeholder="Type a message"
              />
            </div> */}
            <button
              className="chat-message-send btn rounded-3 btn-outline-light"
              type="submit"
            >
              Send
            </button>
          </form>
        </>
      </div>
    </div>
  );
}
