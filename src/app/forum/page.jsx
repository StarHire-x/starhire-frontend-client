"use client";

import { useState, useEffect } from "react";
import ForumCategoryMenu from "./components/ForumCategoryMenu/desktop/ForumCategoryMenu";
import ForumCreatePostButton from "./components/ForumCreatePostButton/ForumCreatePostButton";
import ForumGuidelinesCard from "./components/ForumGuidelines/ForumGuidelinesCard";
import ForumSearchBar from "./components/ForumSearchBar/ForumSearchBar";
// import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MediaQuery, { useMediaQuery } from "react-responsive";
import ForumDesktopView from "./views/desktop/ForumDesktopView";
import ForumMobileView from "./views/mobile/ForumMobileView";

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
  const [mounted, setMounted] = useState(false);
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <h2>Forum</h2>

      {mounted && (
        <>
          <MediaQuery minWidth={1225}>
            <ForumDesktopView
              forumCategoryTitle={forumCategoryTitle}
              setForumCategoryTitle={setForumCategoryTitle}
            />
          </MediaQuery>
          <MediaQuery minWidth={390} maxWidth={1224}>
            <ForumMobileView
              forumCategoryTitle={forumCategoryTitle}
              setForumCategoryTitle={setForumCategoryTitle}
            />
          </MediaQuery>
        </>
      )}

      {/* {isTabletOrMobile ? (
        <ForumMobileView
          forumCategoryTitle={forumCategoryTitle}
          setForumCategoryTitle={setForumCategoryTitle}
        />
       
      ) : (
         <ForumDesktopView
          forumCategoryTitle={forumCategoryTitle}
          setForumCategoryTitle={setForumCategoryTitle}
        />
      )} */}
    </>
  );
};

export default ForumPage;
