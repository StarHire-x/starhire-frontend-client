import { NextResponse } from "next/server";

export const fetchTypeFormResponses = async (accessToken) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/typeform`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    const result = await response.json();
    if (result.statusCode === 200) {
      return result.data;
    } else {
      return NextResponse.json(
        { error: response.message },
        { status: response.statusCode }
      );
    }
  } catch (error) {
    console.log(
      "Encountered an unexpected problem when fetching typeform response",
      error.message
    );
  }
};
