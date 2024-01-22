import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import Poll from './Poll';

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      // Проверяем, существует ли уже такое сообщение в массиве
      const messageAlreadyExists = messages.some(
        m => m.message === arrivalMessage.message && m.timestamp === arrivalMessage.timestamp
      );

      if (!messageAlreadyExists) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, messages]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const parseChatArray = (message) => {
  //   const regex = /@chatArray\s#(.*?)#\s\$!(.*?)\$\s\$(.*?)\$\s\$(.*?)\$/;
  //   const match = message.message.match(regex);
  //
  //   if (match) {
  //     const question = match[1];
  //     const correctAnswer = match[2];
  //     const otherAnswers = [match[3], match[4]];
  //
  //     return {
  //       question,
  //       correctAnswer,
  //       otherAnswers,
  //     };
  //   } else {
  //     return null;
  //   }
  // };

  const renderMessage = (message) => {
    console.log("Обрабатываемое сообщение:", message);

    if (message && message.message && message.message.startsWith("@chatArray")) {
      const parts = message.message.split(" ");
      const question = parts[1];
      const options = parts.slice(2);
      console.log("Обнаружен опрос:", question, options);
      return <Poll question={question} options={options} />;
    }

    return message && message.message ? <div>{message.message}</div> : <div></div>;
  };


  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
  {messages.map((message) => {
    // const hasAtSymbol = message.message.includes('@chatArray');
    // const parsedChatArray = parseChatArray(message);

    return (
      <div key={uuidv4()}>
        <div ref={scrollRef} className={`message ${message.fromSelf ? 'sended' : 'recieved'}`}>
          <div className="content">
            <p>{message.message}</p>
            {
              messages.map((messageObject, index) => {
                if (typeof messageObject.message === 'string' && messageObject.message.startsWith("@chatArray")) {
                  const parts = messageObject.message.split(" ");
                  const question = parts[1];
                  const options = parts.slice(2);
                  return (
                    <div key={index}>
                      <Poll question={question} options={options} />
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="message">
                      {messageObject.message || "Сообщение не может быть отображено"}
                    </div>
                  );
                }
              })
            }

            {/*{hasAtSymbol && parseChatArray && (*/}
            {/*  <React.Fragment>*/}
            {/*    <p>Содержит символ "@"!</p>*/}
            {/*    <p>{parsedChatArray.question}</p>*/}
            {/*    <form action="#">*/}
            {/*      <fieldset>*/}
            {/*        <input type="radio" name="answer" className="Answer" value={parsedChatArray.correctAnswer} />*/}
            {/*        <label>{parsedChatArray.correctAnswer}</label>*/}
            {/*        {parsedChatArray.otherAnswers.map((answer, index) => (*/}
            {/*          <React.Fragment key={index}>*/}
            {/*            <input type="radio" name="answer" className="Answer" value={answer} />*/}
            {/*            <label>{answer}</label>*/}
            {/*          </React.Fragment>*/}
            {/*        ))}*/}
            {/*      </fieldset>*/}
            {/*    </form>*/}
            {/*  </React.Fragment>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    );
  })}
</div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
