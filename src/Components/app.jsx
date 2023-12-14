import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Landing from "./landing";
import Signup from "./signup";
import Login from "./login";
import Messenger from "./messenger";
import Account from "./account";
import axios from "axios";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "userLoggedIn",
    "page",
  ]);

  const [user, setUser] = useState();
  const [wantsToLogin, setWantsToLogin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (cookies.userLoggedIn) {
      return true;
    } else {
      return false;
    }
  });
  const [isAccountClicked, setIsAccountClicked] = useState(() => {
    if (cookies.page === "account") {
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADRESS +
            "/get-user-details/" +
            cookies.userLoggedIn
        );
        setIsLoggedIn(true);
        setWantsToLogin(false);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, [cookies.userLoggedIn]);
  const handleLogout = () => {
    removeCookie("userLoggedIn");
    setIsLoggedIn(false);
  };
  const handleAddPic = async (e) => {
    try {
      const pic = e.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(pic[0]);

      reader.onload = async () => {
        const reqData = {
          id: cookies.userLoggedIn,
          pic: reader.result,
        };
        const res = await axios.post(
          process.env.REACT_APP_API_ADRESS + "/update-profile-pic",
          reqData
        );
        if (res.status === 200) {
          setCookie("userLoggedIn", res.data.user);
        }
      };
    } catch (error) {
      console.log(error);
    }
  };
  // handleLogout();
  return (
    <div className="whole-page">
      {isRegistered ? (
        wantsToLogin ? (
          <>
            <Login
              closeSignin={() => {
                setWantsToLogin(false);
              }}
              login={(user) => {
                setCookie("userLoggedIn", user._id);
              }}
            />
            <Landing
              changeIsRegistered={() => {
                setIsRegistered(false);
                setWantsToLogin(false);
              }}
              changeWantsToLogin={() => {
                setWantsToLogin(true);
                setIsRegistered(true);
              }}
            />
          </>
        ) : isLoggedIn ? (
          isAccountClicked ? (
            <>
              <Account
                goToMessages={() => {
                  setIsAccountClicked(false);
                  removeCookie("page");
                }}
                handleAddPic={handleAddPic}
                userLoggedIn={user}
              />
            </>
          ) : (
            user && (
              <>
                <Messenger
                  accountClicked={() => {
                    setIsAccountClicked(true);
                    setCookie("page", "account");
                  }}
                  userLoggedIn={user}
                  handleLogout={handleLogout}
                />
              </>
            )
          )
        ) : (
          <>
            <Landing
              changeIsRegistered={() => {
                setIsRegistered(false);
                setWantsToLogin(false);
              }}
              changeWantsToLogin={() => {
                setWantsToLogin(true);
                setIsRegistered(true);
              }}
            />
          </>
        )
      ) : (
        <>
          <Signup
            closeSignup={() => {
              setIsRegistered(true);
            }}
          />
          <Landing
            changeIsRegistered={() => {
              setIsRegistered(false);
              setWantsToLogin(false);
            }}
            changeWantsToLogin={() => {
              setWantsToLogin(true);
              setIsRegistered(true);
            }}
          />
        </>
      )}
    </div>
  );
};

export default App;
