"use client"
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getUserByUserId } from "@/app/api/auth/user/route";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const session = useSession();
  const [userData, setUserData] = useState(null);

 let roleRef, sessionTokenRef, userIdRef;

 if (session && session.data && session.data.user) {
   userIdRef = session.data.user.userId;
   roleRef = session.data.user.role;
   sessionTokenRef = session.data.user.accessToken;
 }

  const fetchUserData = useCallback(() => {
    getUserByUserId(userIdRef, roleRef, sessionTokenRef)
      .then((user) => {
        setUserData(user.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [userIdRef, roleRef, sessionTokenRef]);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchUserData();
    }
  }, [session.status, fetchUserData]);

  return (
    <UserContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
