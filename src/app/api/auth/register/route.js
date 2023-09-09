import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const hashing = async (password) => {
  return await bcrypt.hash(password, 5);
};

export const registerUser = async (request) => {
  try {
    const res = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    alert(res);
    if (res.status === 201) {
      return res;
    } else if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
  } catch (err) {
    return new NextResponse("Failed to create user", { status: 500 });
  }
};