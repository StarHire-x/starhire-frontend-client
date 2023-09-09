//import nodemailer from "nodemailer";

export const forgetPassword = async (request) => {
  try {
    const { email, role } = request;
    console.log(request)
    const res = await fetch(
      `http://localhost:8080/users?email=${email}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return new Error("User is not found");
    }
    const responseBody = await res.json();
    console.log(responseBody);

    const token = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("passwordResetToken", token);
    const passwordResetExpire = Date.now() + 3600000;
    localStorage.setItem("passwordResetToken", passwordResetExpire);
    const resetEmail = responseBody.email

    return { tokenId: token, expiry: passwordResetExpire, emailReset: resetEmail, role: responseBody.role };
  } catch (err) {
    return new Error("Error in DB");
  }
};

//work in progress
export const sendEmail = async (request) => {
  try {
    // const { tokenId, expiry, emailReset, role } = request;
    console.log(request);
    const res = await fetch(
      "http://localhost:8080/email/reset",
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