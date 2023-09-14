export const getAllUserChats = async (userId, accessToken) => {
  try {
    const res = await fetch(`http://localhost:8080/chat/user-chats/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return await res.json();
  } catch (error) {
    console.log("There was a problem fetching the chats", error);
    throw error;
  }
};

export const getOneUserChat = async (chatId, accessToken) => {
  try {
    const res = await fetch(`http://localhost:8080/chat/${chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(errorData.message);
    }
    return await res.json();
  } catch (error) {
    console.log("SEHHH: ");
    console.log("There was a problem fetching chat messages for this chat", error);
    throw error;
  }
};
