"use client";
import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import io from "socket.io-client";
import moment from "moment";
import {
  MainContainer,
  Avatar,
  ChatContainer,
  ConversationHeader,
  MessageList,
  MessageSeparator,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import HumanIcon from "../../../public/icon.png";

import { getAllUserChats, getOneUserChat } from "../api/auth/chat/route";

const Chat = () => {
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") {
    router?.push("/login");
  }
  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;
    
  const currentUserId =
    session.status === "authenticated" && session.data.user.userId;

  const [messageInputValue, setMessageInputValue] = useState("");
  const [chatMessagesByDate, setChatMessagesByDate] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null); // user object
  const [allChats, setAllChats] = useState([]);

  // WebSocket functions
  const socket = io("http://localhost:8080");

  // returns list of lists
  const getDateStringByTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-SG");
  };
  const splitMessagesByDate = (chatMessages) => {
    let dateMessageMap = {};

    for (let message of chatMessages) {
      if (!message.timestamp) {
        continue;
      }
      const date = getDateStringByTimestamp(message.timestamp);
      if (dateMessageMap[date] === undefined) {
        dateMessageMap[date] = [message];
      } else {
        dateMessageMap[date].push(message);
      }
    }
    return Object.values(dateMessageMap);
  };

  const sendMessage = (message) => {
    socket.emit("sendMessage", message);
  };

  socket.on(currentChat ? currentChat.chatId : null, (message) => {
    receiveMessage(message);
  });

  const formatRawDate= (rawDate) => {
    const formattedDate = moment(rawDate).format("MMMM D, YYYY, h:mm A")
    return formattedDate;
  }

  const receiveMessage = (message) => {
    if (!message.timestamp) {
      return;
    }
    if (chatMessagesByDate.length > 0) {
      if (
        getDateStringByTimestamp(
          chatMessagesByDate.slice(-1)[0][0].timestamp
        ) == getDateStringByTimestamp(message.timestamp)
      ) {
        let newChatMessagesByDate = chatMessagesByDate;
        const lastElement = [
          ...newChatMessagesByDate[newChatMessagesByDate.length - 1],
          message,
        ];
        setChatMessagesByDate([
          ...newChatMessagesByDate.slice(0, -1),
          lastElement,
        ]);
      } else {
        setChatMessagesByDate([...chatMessagesByDate, [message]]);
      }
    } else {
      setChatMessagesByDate([[message]]);
    }
  };

  const handleSendMessage = (content) => {
    sendMessage({
      userId: currentUserId,
      chatId: currentChat ? currentChat.chatId : null,
      message: content,
      isImportant: false,
      timestamp: new Date(),
    });
    setMessageInputValue("");
  };

  async function getUserChats() {
    const chats = await getAllUserChats(currentUserId, accessToken);
    setAllChats(chats);
  }

  const selectCurrentChat = async (chat) => {
      const currentChatId = chat.chatId;
      const chatMessagesByCurrentChatId = await getOneUserChat(
        currentChatId,
        accessToken
      );
      setCurrentChat(chatMessagesByCurrentChatId);
  };

  useEffect(() => {
    getUserChats();
  }, [accessToken]);

  useEffect(() => {
    if (currentChat) {
      const chatMessages = currentChat.chatMessages;
      chatMessages.sort(
        (message1, message2) => message1.timestamp > message2.timestamp
      );
      setChatMessagesByDate(splitMessagesByDate(chatMessages));
    }

    if (currentChat) {
      setCurrentUser(currentChat.jobSeeker || currentChat.corporate);
      setOtherUser(currentChat.recruiter);
    }
  }, [currentChat]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  if (session.status === "authenticated") {
    return (
      <>
        <MainContainer responsive style={{  height: "75vh" }}>
          <ChatSidebar
            userChats={allChats}
            selectCurrentChat={(index) => {
              selectCurrentChat(index);
              setSelectedConversation(index);
            }}
          />
          {selectedConversation !== null ? (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back />
                <Avatar>
                  <Image
                    src={HumanIcon}
                    alt="Profile Picture"
                    name={otherUser ? otherUser.userName : ""}
                  />
                </Avatar>
                <ConversationHeader.Content
                  userName={otherUser ? otherUser.userName : ""}
                />
                <ConversationHeader.Actions>
                </ConversationHeader.Actions>
              </ConversationHeader>
              <ChatHeader />
              <MessageList>
                {chatMessagesByDate.length > 0 &&
                  chatMessagesByDate.map((chatMessages, index) => (
                    <>
                      <MessageSeparator
                        content={
                          chatMessages.length > 0
                            ? `${getDateStringByTimestamp(
                                chatMessages[0].timestamp
                              )}`
                            : ""
                        }
                      />
                      {chatMessages.map((value, index) => (
                        <Message
                          index={index}
                          model={{
                            message: value.message,
                            sentTime: value.timestamp,
                            sender:
                              value.userId == currentUserId
                                ? currentUser.userId
                                : otherUser.userId,
                            direction:
                              value.userId == currentUserId
                                ? "outgoing"
                                : "incoming",
                            position: "single",
                          }}
                        >
                          <Avatar>
                            <Image
                              src={HumanIcon}
                              alt="Profile Picture"
                              name={
                                value.userId == currentUserId
                                  ? currentUser.userName
                                  : otherUser.userName
                              }
                            />
                          </Avatar>
                          <Message.Footer>
                            {formatRawDate(value.timestamp)}
                          </Message.Footer>
                        </Message>
                      ))}
                    </>
                  ))}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                value={messageInputValue}
                onChange={(val) => setMessageInputValue(val)}
                onSend={(textContent) => handleSendMessage(textContent)}
              />
            </ChatContainer>
          ) : (
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            >
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </MainContainer>
      </>
    );
  }
};

export default Chat;
