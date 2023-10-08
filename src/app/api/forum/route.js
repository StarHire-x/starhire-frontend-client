import { NextResponse } from "next/server";

export const createPost = async (newPost, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forum-posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newPost),
        cache: "no-store",
      }
    );
    const response = await res.json();
    console.log("FROM ROUTE.JS!!!");
    console.log(response);

    if (response.statusCode === 200) {
      return response;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log("There was a problem creating this forum post", error);
    throw error;
  }
};
