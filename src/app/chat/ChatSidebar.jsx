import {
  Sidebar,
  Search,
  ConversationList,
  Avatar,
  Conversation,
} from "@chatscope/chat-ui-kit-react";
import Image from "next/image";
import HumanIcon from "../../../public/icon.png";
import { useState } from "react";

const ChatSidebar = ({ userChats, selectCurrentChat, position, scrollable, sideBarStyle, searchBarStyle, conversationContentStyle, conversationAvatarStyle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Create a new array called filteredChats that include those userNames where it match the search query.
  const filteredChats = userChats.filter((value) => {
    const userName = value.recruiter.userName;
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Sidebar position={position} scrollable={scrollable} style={sideBarStyle}>
      <Search
        placeholder="Search..."
        value={searchQuery}
        onChange={(query) => setSearchQuery(query)}
        onClearClick={handleClearSearch}
        style={searchBarStyle}
      />
      <ConversationList>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <Conversation
              key={index}
              index={index}
              // name={chat.recruiter.userName}
              onClick={() => selectCurrentChat(chat.chatId)}
            >
              <Avatar style={conversationAvatarStyle}>
                {chat.recruiter && chat.recruiter.profilePictureUrl != "" ? (
                  <img src={chat.recruiter.profilePictureUrl} alt="user" />
                ) : (
                  <Image src={HumanIcon} alt="Profile Picture" />
                )}
              </Avatar>
              <Conversation.Content name={chat.recruiter.userName} style={conversationContentStyle}/>
            </Conversation>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-35%, -100%)",
            }}
          >
            <p>No Chat History</p>
          </div>
        )}
      </ConversationList>
    </Sidebar>
  );
};

export default ChatSidebar;
