export const getAllUserChats = async (userId) => {
  try {
    const res = await fetch(`http://localhost:8080/chat/user-chats/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
