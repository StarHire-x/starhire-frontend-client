"use client";
import React, { useRef } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  AttachmentButton,
  InfoButton,
  SendButton,
} from "@chatscope/chat-ui-kit-react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import HumanIcon from "../../../public/icon.png";

import { getAllUserChats, getOneUserChat } from "../api/chat/route";
import { uploadFile } from "../api/upload/route";

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

  const fileInputRef = useRef(null);
  const [messageInputValue, setMessageInputValue] = useState("");
  const [chatMessagesByDate, setChatMessagesByDate] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null); // user object
  const [allChats, setAllChats] = useState([]);
  const [attachedFile, setAttachedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isImportant, setIsImportant] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true); // must show sidebar by default
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [searchBarStyle, setSearchBarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});

  // ============================= Socket.io Related Codes =============================
  useEffect(() => {
    // WebSocket functions
    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    setSocket(socket);

    // Clean-up logic when the component unmounts (if needed)
    return () => {
      // Close the socket or remove event listeners, if necessary
      socket.close(); // Close the socket when the component unmounts
    };
  }, []); // The empty dependency array [] means this effect runs once after the initial render

  const sendMessage = (message) => {
    socket?.emit("sendMessage", message);
  };

  socket?.on(currentChat ? currentChat.chatId : null, (message) => {
    receiveMessage(message);
  });
  // ============================= Socket.io Related Codes =============================

  // ============================= Date Related Codes =============================
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

  const formatRawDate = (rawDate) => {
    const formattedDate = moment(rawDate).format("h:mm A");
    return formattedDate;
  };
  // ============================= Date Related Codes =============================

  // ============================= Message Related Codes =============================
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

  const handleSendMessage = async () => {
    setLoading(true);
    // get fileURL here
    let fileURL = "";
    if (attachedFile) {
      try {
        fileURL = await uploadFile(attachedFile, accessToken);
      } catch (error) {
        console.error("There was an error uploading the file", error);
      }
    }
    sendMessage({
      userId: currentUserId,
      chatId: currentChat ? currentChat.chatId : null,
      message: messageInputValue,
      isImportant: isImportant,
      timestamp: new Date(),
      fileURL: fileURL ? fileURL.url : "",
    });
    setMessageInputValue("");
    setAttachedFile(null);
    setLoading(false);
  };
  // ============================= Message Related Codes =============================

  // ============================= Attachment Related Codes =============================
  const handleAttachClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    setAttachedFile(selectedFile);
  };
  // ============================= Attachment Related Codes =============================

  // ============================= Get Chats Related Codes =============================
  async function getUserChats(currentUserId, accessToken) {
    console.log(currentUserId);
    const chats = await getAllUserChats(currentUserId, accessToken);
    setAllChats(chats);
  }

  const selectCurrentChat = async (chatId) => {
    socket.off(currentChat?.chatId);
    socket.on(chatId, (message) => {
      receiveMessage(message);
    });

    handleConversationClick();

    const chatMessagesByCurrentChatId = await getOneUserChat(
      chatId,
      accessToken
    );
    setCurrentChat(chatMessagesByCurrentChatId);
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      getUserChats(currentUserId, accessToken);
    }
  }, [session.status, currentUserId, accessToken]);

  useEffect(() => {
    if (currentChat) {
      const chatMessages = currentChat.chatMessages;
      chatMessages.sort(
        (message1, message2) => message1.timestamp > message2.timestamp
      );
      setChatMessagesByDate(splitMessagesByDate(chatMessages));
    }

    if (currentChat) {
      setOtherUser(currentChat.recruiter);
      setCurrentUser(currentChat.jobSeeker || currentChat.corporate);
    }
  }, [currentChat]);

  // ============================= Get Chats Related Codes =============================

  // ============================= Others Codes =============================
  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  const handleConversationClick = useCallback(() => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [sidebarVisible, setSidebarVisible]);

  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%",
        paddingRight: "3%",
      });

      setSearchBarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%",
      });

      setConversationContentStyle({
        display: "flex",
      });
      setConversationAvatarStyle({
        marginRight: "1em",
      });
      setChatContainerStyle({
        display: "none",
      });
    } else {
      setSidebarStyle({});
      setSearchBarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [
    sidebarVisible,
    setSidebarVisible,
    setConversationContentStyle,
    setConversationAvatarStyle,
    setSidebarStyle,
    setChatContainerStyle,
    setSearchBarStyle,
  ]);

  // ============================= Others Codes =============================

  if (session.status === "authenticated") {
    return (
      <div style={{ height: "75vh", position: "relative" }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <MainContainer
          responsive
          style={{
            borderRadius: "10px",
            boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
            paddingTop: "10px"
          }}
        >
          <ChatSidebar
            userChats={allChats}
            selectCurrentChat={selectCurrentChat}
            position="left"
            scrollable={false}
            sideBarStyle={sidebarStyle}
            searchBarStyle={searchBarStyle}
            conversationContentStyle={conversationContentStyle}
            conversationAvatarStyle={conversationAvatarStyle}
          />
          {currentChat && (
            <ChatContainer style={chatContainerStyle}>
              <ConversationHeader>
                <ConversationHeader.Back onClick={handleBackClick} />
                <Avatar>
                  {otherUser && otherUser.profilePictureUrl != "" ? (
                    <img src={otherUser.profilePictureUrl} alt="user" />
                  ) : (
                    <Image src={HumanIcon} alt="Profile Picture" />
                  )}
                </Avatar>
                <ConversationHeader.Content
                  userName={otherUser ? otherUser.userName : ""}
                />
                <ConversationHeader.Actions></ConversationHeader.Actions>
              </ConversationHeader>
              <ChatHeader />
              <MessageList loadingMore={loading} loadingMorePosition="bottom">
                {chatMessagesByDate.length > 0 &&
                  chatMessagesByDate.map((chatMessages, index) => (
                    <>
                      <MessageSeparator
                        key={index}
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
                          key={index}
                          index={index}
                          model={{
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
                            {value.userId == currentUserId ? (
                              currentUser &&
                              currentUser.profilePictureUrl != "" ? (
                                <img
                                  src={currentUser.profilePictureUrl}
                                  alt="user"
                                />
                              ) : (
                                <Image src={HumanIcon} alt="Profile Picture" />
                              )
                            ) : otherUser &&
                              otherUser.profilePictureUrl != "" ? (
                              <img
                                src={otherUser.profilePictureUrl}
                                alt="user"
                              />
                            ) : (
                              <Image src={HumanIcon} alt="Profile Picture" />
                            )}
                          </Avatar>
                          <Message.CustomContent>
                            {value.isImportant ? (
                              <>
                                <b>*Notification Sent*</b>
                                <br />
                              </>
                            ) : (
                              <></>
                            )}
                            {value.fileURL != "" ? (
                              <>
                                <b style={{ color: "#00008B" }}>
                                  <a href={`${value.fileURL}`} target="_blank">
                                    Download Attachment
                                  </a>
                                </b>
                                <br />
                              </>
                            ) : (
                              <></>
                            )}
                            {value.message}
                          </Message.CustomContent>
                          <Message.Footer>
                            {formatRawDate(value.timestamp)}
                          </Message.Footer>
                        </Message>
                      ))}
                    </>
                  ))}
              </MessageList>
              <div
                as={MessageInput}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTop: "1px dashed #d1dbe4",
                }}
              >
                <AttachmentButton
                  style={{
                    fontSize: "1.2em",
                    paddingLeft: "0.5em",
                    paddingRight: "0.2em",
                  }}
                  onClick={handleAttachClick}
                />
                <MessageInput
                  placeholder={
                    attachedFile
                      ? `File attached: ${attachedFile.name}`
                      : "Type message here"
                  }
                  onChange={(innerHtml, textContent, innerText) =>
                    setMessageInputValue(innerText)
                  }
                  value={messageInputValue}
                  sendButton={false}
                  attachButton={false}
                  onSend={handleSendMessage}
                  style={{
                    flexGrow: 1,
                    borderTop: 0,
                    flexShrink: "initial",
                    caretColor: "#000000",
                  }}
                />
                {isImportant ? (
                  <InfoButton
                    onClick={() => setIsImportant(false)}
                    border
                    style={{
                      fontSize: "1.2em",
                      paddingLeft: "0.2em",
                      paddingRight: "0.2em",
                    }}
                  />
                ) : (
                  <InfoButton
                    onClick={() => setIsImportant(true)}
                    style={{
                      fontSize: "1.2em",
                      paddingLeft: "0.2em",
                      paddingRight: "0.2em",
                    }}
                  />
                )}
                <SendButton
                  onClick={handleSendMessage}
                  disabled={messageInputValue.length === 0}
                  style={{
                    fontSize: "1.2em",
                    marginLeft: 0,
                    paddingLeft: "0.2em",
                    paddingRight: "1em",
                  }}
                />
              </div>
            </ChatContainer>
          )}
        </MainContainer>
      </div>
    );
  }
};

export default Chat;
