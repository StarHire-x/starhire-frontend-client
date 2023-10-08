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

  // this mockForumCategories will act like the retrieved categories from DB for now
  const mockForumCategories = [
    {
      label: "Events",
    },
    {
      label: "Career",
    },
    {
      label: "Miscellaneous",
    },
    {
      label: "Confession",
    },
  ];

  const myPostMenu = {label: "My Posts"};
  mockForumCategories?.unshift(myPostMenu); // show 'My Posts' menu as first option

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <>
          <MediaQuery minWidth={1225}>
            <ForumDesktopView
              forumCategoryTitle={forumCategoryTitle}
              setForumCategoryTitle={setForumCategoryTitle}
              userIdRef={userIdRef}
              accessToken={accessToken}
              forumCategories={mockForumCategories}
            />
          </MediaQuery>
          <MediaQuery maxWidth={1224}>
            <ForumMobileView
              forumCategoryTitle={forumCategoryTitle}
              setForumCategoryTitle={setForumCategoryTitle}
              forumCategories={mockForumCategories}
            />
          </MediaQuery>
        </>
      )}
    </>
  );
};

export default ForumPage;
