import { NextResponse } from "next/server";

export const fetchTypeFormResponsesJobSeeker = async (accessToken, email) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/typeform/jobseeker/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const text = await response.text();
      const result = text ? JSON.parse(text) : false; // Parse JSON or use an empty object
      return result;
    } else {
      console.log(
        "Received an error response when fetching Corporate typeform response",
        response.status
      );
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log(
      "Encountered an unexpected problem when fetching Corporate typeform response",
      error.message
    );
    throw error;
  }
};

export const fetchTypeFormResponsesCorporate = async (accessToken, email) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/typeform/corporate/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const text = await response.text();
      const result = text ? JSON.parse(text) : false; // Parse JSON or use an empty object
      return result;
    } else {
      console.log(
        "Received an error response when fetching Corporate typeform response",
        response.status
      );
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log(
      "Encountered an unexpected problem when fetching Corporate typeform response",
      error.message
    );
    throw error;
  }
};

export const submitTypeFormResponsesCorporate = async (accessToken, body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/typeform/corporate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const result = response.json();
      return result;
    } else {
      console.log(
        "Received an error response when submitting Corporate typeform response",
        response.status
      );
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log(
      "Encountered an unexpected problem when submitting Corporate typeform response",
      error.message
    );
    throw error;
  }
};

export const submitTypeFormResponsesJobSeeker = async (accessToken, body) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/typeform/jobseeker`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const result = response.json();
      return result;
    } else {
      console.log(
        "Received an error response when submitting Corporate typeform response",
        response.status
      );
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log(
      "Encountered an unexpected problem when submitting Corporate typeform response",
      error.message
    );
    throw error;
  }
};