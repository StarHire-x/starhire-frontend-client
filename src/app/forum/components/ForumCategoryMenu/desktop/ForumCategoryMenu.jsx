"use client";
import { Menu } from "primereact/menu";
const ForumCategoryMenu = ({setForumCategoryTitle}) => {
  const forumCategories = [
    {
      label: "My Posts",
      command: () => {
        setForumCategoryTitle("My Posts");
      },
    },
    {
      label: "Events",
      command: () => {
        setForumCategoryTitle("Events");
      },
    },
    {
      label: "Career",
      command: () => {
        setForumCategoryTitle("Career");
      },
    },
    {
      label: "Miscellaneous",
      command: () => {
        setForumCategoryTitle("Miscellaneous");
      },
    },
    {
      label: "Confession",
      command: () => {
        setForumCategoryTitle("Confession");
      },
    },
  ];

  return (
    <>
      <Menu model={forumCategories} />
    </>
  );
};

export default ForumCategoryMenu;
