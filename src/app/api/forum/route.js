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

    if (response.statusCode === 201) {
      return response;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log("There was a problem creating this forum post", error);
    throw error;
  }
};

export const getAllForumCategories = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forum-categories`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return await res.json();
    
  } catch (error) {
    console.log('There was a problem fetching the forum categories', error);
    throw error;
  }
};

export const getAllForumPostsByForumCategory = async (forumCategoryId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forum-posts/forum-category/${forumCategoryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return await res.json();
    
  } catch (error) {
    console.log('There was a problem fetching the forum categories', error);
    throw error;
  }
};

export const getAllForumPostsByJobSeeker = async (jobSeekerId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forum-posts/jobSeeker/${jobSeekerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return await res.json();
    
  } catch (error) {
    console.log('There was a problem fetching the forum categories', error);
    throw error;
  }
};

export const getAllSortedForumPosts = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/forum-posts`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return await res.json();
    
  } catch (error) {
    console.log('There was a problem fetching the forum posts', error);
    throw error;
  }
};

