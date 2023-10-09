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
import Enums from "@/common/enums/enums";
import { getAllForumCategories } from "../api/forum/route";

const ForumPage = () => {
  const session = useSession();
  const router = useRouter();

  const currentUserRole =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

  if (session.status === "unauthenticated" || currentUserRole !== Enums.JOBSEEKER) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllForumCategories(accessToken);
        console.log("HERE!!");
        console.log(response);
      } catch (error) {
        console.error("Error fetching forum categories:", error);
      }
    };

    fetchData();
  }, [accessToken]);

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
              userIdRef={userIdRef}
              accessToken={accessToken}
              forumCategories={mockForumCategories}
            />
          </MediaQuery>
        </>
      )}
    </>
  );
};

export default ForumPage;
