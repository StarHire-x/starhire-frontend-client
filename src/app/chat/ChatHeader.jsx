import {
  ConversationHeader,
  EllipsisButton,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import Image from 'next/image'
import HumanIcon from "../../../public/icon.png";

const ChatHeader = () => {
  return (
    <ConversationHeader>
      <ConversationHeader.Back />
      <Avatar>
        <Image src={HumanIcon} 
        alt="Profile Picture"
        name="Zoe"
        />
      </Avatar>
      <ConversationHeader.Content userName="Zoe"/>
      <ConversationHeader.Actions>
        <EllipsisButton orientation="vertical" />
      </ConversationHeader.Actions>
    </ConversationHeader>
  );
};

export default ChatHeader;
