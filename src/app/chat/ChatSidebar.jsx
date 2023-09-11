import {
  Sidebar,
  Search,
  ConversationList,
  Avatar,
  Conversation,
} from "@chatscope/chat-ui-kit-react";

const ChatSidebar = ({ userChats, selectCurrentChat }) => {
  return (
    <Sidebar position="left" scrollable={false}>
      <Search placeholder="Search..." />
      <ConversationList>
        {userChats.length > 0 ? (
          userChats.map((value, index) => (
            <Conversation
              index={index}
              name={
                value.recruiter.userName
                  // ? value.jobSeeker.userName
                  // : value.corporate.userName
              }
              lastSenderName={
                value.recruiter.userName
                  // ? value.jobSeeker.userName
                  // : value.corporate.userName
              }
              info={
                value.chatMessages
                  ? value.chatMessages.length > 0
                    ? value.chatMessages.slice(-1)[0].message
                    : ""
                  : ""
              }
              onClick={() => selectCurrentChat(index)}
            >
              <Avatar
                src=""
                name={
                  value.recruiter.userName
                  // ? value.jobSeeker.userName
                  // : value.corporate.userName
                }
                status="available"
              />
            </Conversation>
          ))
        ) : (
          <h2>No chat history</h2>
        )}
      </ConversationList>
    </Sidebar>
  );
};

export default ChatSidebar;
