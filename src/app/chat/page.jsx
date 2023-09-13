"use client";
import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import io from "socket.io-client";
import {
  MainContainer,
  Avatar,
  ChatContainer,
  ConversationHeader,
  MessageList,
  MessageSeparator,
  Message,
  MessageInput,
  EllipsisButton,
} from "@chatscope/chat-ui-kit-react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import { getAllUserChats, getOneUserChat } from "../api/auth/chat/route";
import HumanIcon from "../../../public/icon.png";

const Chat = () => {
  // should get from session
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") {
    router?.push("/login");
  }

  const accessToken = session.status === "authenticated" && session.data && session.data.user.accessToken;
  const currentUserId = session.status === "authenticated" && session.data.user.userId; 


  const [messageInputValue, setMessageInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null); // user object
  const [allChats, setAllChats] = useState([]);

  // WebSocket functions
  const socket = io("http://localhost:8080");

  const sendMessage = (message) => {
    socket.emit("sendMessage", message);
  };

  const receiveMessage = (message) => {
    setChatMessages([...chatMessages, message]);
  };

  socket.on(currentChat ? currentChat.chatId : null, (message) => {
    receiveMessage(message);
  });

  const handleSendMessage = (content) => {
    sendMessage({
      userId: currentUserId,
      chatId: currentChat ? currentChat.chatId : null,
      message: content,
      isImportant: false,
    });
    setMessageInputValue("");
  };

  async function getUserChats() {
    const chats = await getAllUserChats(currentUserId, accessToken);
    setAllChats(chats);
  }

  const selectCurrentChat = async (index) => {
    if (index < allChats.length) {
      // get current chat id
      const currentChatId = allChats[index].chatId;
      const chatMessagesByCurrentChatId = await getOneUserChat(currentChatId, accessToken);
      setCurrentChat(chatMessagesByCurrentChatId);
    }
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
      setChatMessages(chatMessages);
    }

    if (currentChat) {
      setCurrentUser(currentChat.jobSeeker || currentChat.corporate);
      setOtherUser(currentChat.recruiter);
    }
  }, [currentChat]);

  const [selectedConversation, setSelectedConversation] = useState(null);


  return (
    <>
      <h2> Manage Chats</h2>
      <MainContainer responsive style={{ height: 500 }}>
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
                <EllipsisButton orientation="vertical" />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <ChatHeader />
            <MessageList>
              <MessageSeparator content="Saturday, 30 November 2019" />
              {chatMessages.length > 0 &&
                chatMessages.map((value, index) => (
                  <Message
                    index={index}
                    model={{
                      message: value.message,
                      sentTime: "15 mins ago",
                      sender:
                        value.userId == currentUserId
                          ? currentUser.userId
                          : otherUser.userId,
                      direction:
                        value.userId == currentUserId ? "outgoing" : "incoming",
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
                  </Message>
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
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 300,
              height: "100%",
            }}
          >
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </MainContainer>
    </>
  );
};

export default Chat;
