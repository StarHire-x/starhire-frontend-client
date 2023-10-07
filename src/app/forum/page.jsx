"use client";

import { useState, useEffect } from "react";
import ForumCategoryMenu from "./components/ForumCategoryMenu/ForumCategoryMenu";
import ForumCreatePostButton from "./components/ForumCreatePostButton/ForumCreatePostButton";
import ForumGuidelinesCard from "./components/ForumGuidelines/ForumGuidelinesCard";
import ForumSearchBar from "./components/ForumSearchBar/ForumSearchBar";
// import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import ForumDesktopView from "./views/desktop/ForumDesktopView";

const ForumPage = () => {
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") {
    router.push("/login");
  }

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const [forumCategoryTitle, setForumCategoryTitle] = useState("Recent Posts");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      <h2>Forum</h2>
      {!isTabletOrMobile ? (
        <ForumDesktopView
          forumCategoryTitle={forumCategoryTitle}
          setForumCategoryTitle={setForumCategoryTitle}
        />
      ) : (
        <p>Mobile view here, to be developed</p>
      )}
    </>
  );
};

export default ForumPage;
