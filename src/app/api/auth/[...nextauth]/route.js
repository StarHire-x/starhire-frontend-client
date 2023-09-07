import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { notFound } from "next/navigation";
import bcrypt from "bcryptjs";

const handler = NextAuth({

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {

        try {
          const res = await fetch(
            `http://localhost:8080/users/?email=${credentials.email}`,
            {
              cache: "no-store",
            }
          );

          const responseBody = await res.json(); // Read the response body once
          console.log(responseBody)
          //console.log(res);

          if (responseBody.statusCode === 404) {
            router.push('/login'); // Replace '/error' with the path you want to redirect to
          }

          if (typeof credentials.password === 'string' && typeof responseBody.data.password) {

            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              responseBody.data.password
            );
            if (isPasswordCorrect) {
              return responseBody;
            } else {
              //throw new Error("Wrong Credentials!");
            }
          } else {
            //throw new Error("Invalid password in the response");
          }
         
        } catch (err) {
          //console.error(err); // Log the error
        }
      },
    }),
  ],
  pages: {
    error: "http://localhost:3000/login",
  },
});



/*
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
          console.log(responseBody);
    
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
*/

export { handler as GET, handler as POST };
