"use client";
import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  MainContainer,
  Avatar,
  ChatContainer,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  MessageList,
  TypingIndicator,
  MessageSeparator,
  Message,
  MessageInput,
  EllipsisButton,
} from "@chatscope/chat-ui-kit-react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import { getAllUserChats } from "../api/auth/chat/route";

const Chat = () => {
  const currentUserId = 27; //jane user
  // should get from session
  // const session = useSession();
  // const router = useRouter();
  // if (session.status === "unauthenticated") {
  //   router?.push("/login");
  // }

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
    const chats = await getAllUserChats(currentUserId);
    setAllChats(chats);
  }

  const selectCurrentChat = async (index) => {
    if (index < allChats.length) {
      await getUserChats(); // not sure if this is a good implementation to handle clicking between chats
      setCurrentChat(allChats[index]);
    }
  };

  useEffect(() => {
    getUserChats();
  }, []);

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

  return (
    <MainContainer responsive>
      <ChatSidebar userChats={allChats} selectCurrentChat={selectCurrentChat} />

      <ChatContainer>
        <ConversationHeader>
          <ConversationHeader.Back />
          <Avatar src="" name={otherUser ? otherUser.userName : ""} />
          <ConversationHeader.Content
            userName={otherUser ? otherUser.userName : ""}
            info="Active 10 mins ago"
          />
          <ConversationHeader.Actions>
            <EllipsisButton orientation="vertical" />
          </ConversationHeader.Actions>
        </ConversationHeader>
        <ChatHeader />
        <MessageList
          typingIndicator={
            <TypingIndicator
              content={`${otherUser ? otherUser.userName : ""} is typing`}
            />
          }
        >
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
                <Avatar
                  src=""
                  name={
                    value.userId == currentUserId
                      ? currentUser.userName
                      : otherUser.userName
                  }
                />
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
    </MainContainer>
  );
};

export default Chat;
