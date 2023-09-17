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

const ChatSidebar = ({ userChats, selectCurrentChat }) => {
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
    <Sidebar position="left" scrollable={false}>
      <Search
        placeholder="Search..."
        value={searchQuery}
        onChange={(query) => setSearchQuery(query)}
        onClearClick={handleClearSearch}
      />
      <ConversationList>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <Conversation
              key={index}
              index={index}
              name={chat.recruiter.userName}
              onClick={() => selectCurrentChat(chat.chatId)}
            >
              <Avatar>
                {chat.recruiter && chat.recruiter.profilePictureUrl != "" ? (
                  <img src={chat.recruiter.profilePictureUrl} alt="user" />
                ) : (
                  <Image src={HumanIcon} />
                )}
              </Avatar>
            </Conversation>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "40%",
              left: "30%",
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
