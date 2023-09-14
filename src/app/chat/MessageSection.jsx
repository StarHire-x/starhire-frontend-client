import { Avatar, Message, MessageList, MessageSeparator } from "@chatscope/chat-ui-kit-react";
import Image from "next/image";

const MessageSection = ({}) => {
  return (
    <MessageList>
      <MessageSeparator content="Saturday, 30 November 2019" />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "single",
        }}
      >
        <Avatar>
            <Image src={HumanIcon} 
            alt="Profile Picture"
            name="Zoe"
            />
        </Avatar>
      </Message>
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Patrik",
          direction: "outgoing",
          position: "single",
        }}
        avatarSpacer
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "first",
        }}
        avatarSpacer
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "normal",
        }}
        avatarSpacer
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "normal",
        }}
        avatarSpacer
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "last",
        }}
      >
        <Avatar>
            <Image src={HumanIcon} 
            alt="Profile Picture"
            name="Zoe"
            />
        </Avatar>
      </Message>
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Patrik",
          direction: "outgoing",
          position: "first",
        }}
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Patrik",
          direction: "outgoing",
          position: "normal",
        }}
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Patrik",
          direction: "outgoing",
          position: "normal",
        }}
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Patrik",
          direction: "outgoing",
          position: "last",
        }}
      />

      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "first",
        }}
        avatarSpacer
      />
      <Message
        model={{
          message: "Hello my friend",
          sentTime: "15 mins ago",
          sender: "Zoe",
          direction: "incoming",
          position: "last",
        }}
      >
        <Avatar>
            <Image src={HumanIcon} 
            alt="Profile Picture"
            name="Zoe"
            />
        </Avatar>
      </Message>
    </MessageList>
  );
};

export default MessageSection;
