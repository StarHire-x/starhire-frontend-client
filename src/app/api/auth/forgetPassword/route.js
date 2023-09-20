//import nodemailer from "nodemailer";

const fetchUserData = async (email, role) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/find?email=${email}&role=${role}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const responseBody = await response.json();

  if (responseBody.statusCode === 404) {
    throw new Error(responseBody.message || "An error occurred");
  }
  return responseBody;
};

export const forgetPassword = async (email, role) => {
  try {
    const userData = await fetchUserData(email, role);

    const token = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("passwordResetToken", token);

    const passwordResetExpire = Date.now() + 3600000;
    localStorage.setItem("passwordResetExpire", passwordResetExpire.toString());

    localStorage.setItem("resetEmail", userData.email);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userId", userData.userId);

    const input = {
      tokenId: token,
      emailAddress: userData.email,
      role: userData.role,
    };

    return await sendEmail(input);
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

//work in progress
export const sendEmail = async (request) => {
  try {
    // const { tokenId, expiry, emailReset, role } = request;
    console.log(request);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/email/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
      }
    );
  } catch (err) {
    return new Error("Error in DB");
  }
};
