"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from "./Navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import NavItem from "../navItem/NavItem";
import HumanIcon from "../../../public/icon.png";
import { UserContext } from "@/context/UserContext";
import { getUserByUserId } from "@/app/api/auth/user/route";

const MENU_LIST_AUTHENTICATED_JOB_SEEKER = [
  { text: "Home", href: "/" },
  { text: "Job Listings", href: "/jobListing" },
  { text: "Forum", href: "/forum" },
  { text: "Events", href: "/events" },
  { text: "Contact", href: "/contact" },
  { text: "Chat", href: "/chat" },
];

/*
const MENU_LIST_AUTHENTICATED_CORPORATE = [
  { text: "Home", href: "/" },
  { text: "Job Listing Management", href: "/jobListingManagement" },
  { text: "Forum", href: "/forum" },
  { text: "Events", href: "/events" },
  { text: "Contact", href: "/contact" },
  { text: "Chat", href: "/chat" },
];
*/

const MENU_LIST_AUTHENTICATED_CORPORATE = [
  { text: "Home", href: "/" },
  {
    text: "Job Listing Management",
    href: "#", // Use # as the href for dropdown
    subMenu: [
      { text: "Create Job Listing", href: "/jobListingManagement" },
      { text: "Edit Job Listing", href: "/jobListingManagement" },
      { text: "View all my Job Listing", href: "/jobListingManagement/viewAllMyJobListings" },
      // Add more sub-menu items as needed
    ],
  },
  { text: "Forum", href: "/forum" },
  { text: "Events", href: "/events" },
  { text: "Contact", href: "/contact" },
  { text: "Chat", href: "/chat" },
];

const MENU_LIST_UNAUTHENTICATED = [
  { text: "Home", href: "/" },
  { text: "About", href: "/about" },
];

const Navbar = () => {
  const session = useSession();

  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  // const [imageUrl, setImageUrl] = useState(null);
  // const [userName, setUserName] = useState(null);
  let roleRef, sessionTokenRef, userIdRef;

  // utilising use context to get the latest information
  const { userData } = useContext(UserContext);
  const [showSubMenu, setShowSubMenu] = useState(false);

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          StarHire
        </Link>
        <DarkModeToggle />
        <div
          onClick={() => setNavActive(!navActive)}
          className={styles.nav__menu_bar}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div
          className={`${navActive ? styles.active : ""} ${
            styles.nav__menu_list
          }`}
        >
          {session.status == "authenticated" &&
            session.data.user.role === "Job_Seeker" &&
            MENU_LIST_AUTHENTICATED_JOB_SEEKER.map((menu, idx) => (
              <div
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
              >
                <NavItem active={activeIdx === idx} {...menu} />
              </div>
            ))}

          {session.status == "authenticated" &&
            session.data.user.role === "Corporate" &&
            MENU_LIST_AUTHENTICATED_CORPORATE.map((menu, idx) => (
              <div
                key={menu.text}
                onMouseEnter={() => setShowSubMenu(true)} // Show sub-menu on hover
                onMouseLeave={() => setShowSubMenu(false)} // Hide sub-menu on mouse leave
              >
                <Link href={menu.href}>
                  {" "}
                  {/* Use Link for the main menu item */}
                  <a>
                    <NavItem
                      active={activeIdx === idx}
                      text={menu.text}
                      href={menu.href}
                    />
                  </a>
                </Link>

                {menu.subMenu && showSubMenu && (
                  <div className={styles.submenu}>
                    {menu.subMenu.map((subMenuItem, subIdx) => (
                      <Link href={subMenuItem.href} key={subIdx}>
                        {" "}
                        {/* Use Link for sub-menu items */}
                        <a>{subMenuItem.text}</a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {session.status == "unauthenticated" &&
            MENU_LIST_UNAUTHENTICATED.map((menu, idx) => (
              <div
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
              >
                <NavItem active={activeIdx === idx} {...menu} />
              </div>
            ))}
          {session.status === "authenticated" && (
            <>
              <div className={styles.imageContainer}>
                {userData?.profilePictureUrl ? (
                  <Link href="/accountManagement">
                    <img
                      src={userData?.profilePictureUrl}
                      alt="User Profile"
                      className={styles.avatar}
                    />
                  </Link>
                ) : (
                  <Link href="/accountManagement">
                    <Image
                      src={HumanIcon}
                      alt="Profile Picture"
                      className={styles.avatar}
                    />
                  </Link>
                )}
                <h6>{userData?.userName}</h6>
              </div>
              <button className={styles.logout} onClick={signOut}>
                Logout
              </button>
            </>
          )}
          {session.status === "unauthenticated" && (
            <button
              className={styles.login}
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
