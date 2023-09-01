import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { notFound } from "next/navigation";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        console.log(credentials.email);
        try {
          const res = await fetch(
            `http://localhost:8080/users/?email=${credentials.email}`,
            {
              cache: "no-store",
            }
          );
    
          if (!res.ok) {
            return notFound();
          }
    
          const responseBody = await res.json(); // Read the response body once
    
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            responseBody.password
          );
    
          if (isPasswordCorrect) {
            return responseBody;
          } else {
            throw new Error("Wrong Credentials!");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    error: "/login",
  },
});

export { handler as GET, handler as POST };
