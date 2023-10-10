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
import {
  getAllForumCategories,
  getAllForumPostsByJobSeeker,
  getAllSortedForumPosts,
} from "../api/forum/route";
import { getAllForumPostsByForumCategory } from "@/app/api/forum/route";

const ForumPage = () => {
  const session = useSession();
  const router = useRouter();

  const currentUserRole =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

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
  const [forumCategories, setForumCategories] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          const response = await getAllForumCategories(accessToken);
          const myPostMenu = { forumCategoryTitle: "My Posts" };
          response.unshift(myPostMenu); // show 'My Posts' menu as first option
          setForumCategories(response);
        } catch (error) {
          console.error("Error fetching forum categories:", error);
        }
      };
      fetchData();
    }
  }, [accessToken]);

  const forumCategoryTitleToId = {};
  forumCategories.forEach((category) => {
    forumCategoryTitleToId[category.forumCategoryTitle] =
      category.forumCategoryId;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (
        forumCategoryTitle !== "My Posts" &&
        forumCategoryTitle !== "Recent Posts" &&
        accessToken
      ) {
        //don't fetch "My Posts" & "Recents Posts" here. It will be a different API method. Don't remove this line else will have console log error.
        const forumCategoryId = forumCategoryTitleToId[forumCategoryTitle];
        const response = await getAllForumPostsByForumCategory(
          forumCategoryId,
          accessToken
        );
        setForumPosts(response);
      } else if (forumCategoryTitle === "My Posts" && accessToken) {
        const response = await getAllForumPostsByJobSeeker(
          userIdRef,
          accessToken
        );
        setForumPosts(response);
      } else if (forumCategoryTitle === "Recent Posts" && accessToken) {
        const response = await getAllSortedForumPosts(accessToken);
        setForumPosts(response);
      }
    };
    fetchData();
  }, [userIdRef, accessToken, forumCategoryTitle, refreshData]);


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
              forumCategories={forumCategories}
              forumPosts={forumPosts}
              setRefreshData={setRefreshData}
              onSearchQueryChange={handleSearchQueryChange}
              searchQuery={searchQuery}
            />
          </MediaQuery>
          <MediaQuery maxWidth={1224}>
            <ForumMobileView
              forumCategoryTitle={forumCategoryTitle}
              setForumCategoryTitle={setForumCategoryTitle}
              userIdRef={userIdRef}
              accessToken={accessToken}
              forumCategories={forumCategories}
              forumPosts={forumPosts}
              setRefreshData={setRefreshData}
              onSearchQueryChange={handleSearchQueryChange}
              searchQuery={searchQuery}
            />
          </MediaQuery>
        </>
      )}
    </>
  );
};

export default ForumPage;
