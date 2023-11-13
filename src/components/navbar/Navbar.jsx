"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from "./Navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import NavItem from "../navItem/NavItem";
import HumanIcon from "../../../public/icon.png";
import { UserContext } from "@/context/UserContext";
import { getCorporateByUserID } from "@/app/api/payment/route";
import Enums from "@/common/enums/enums";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "primereact/button";
import { useRouter } from "next/router";

const MENU_LIST_AUTHENTICATED_JOB_SEEKER = [
  { text: "Home", href: "/" },
  { text: "Dashboard", href: "/dashboard" },
  { text: "Jobs", href: "/jobListing" },
  { text: "Applications", href: "/jobApplication" },
  { text: "Forum", href: "/forum" },
  { text: "Events", href: "/event" },
  { text: "Chat", href: "/chat" },
];

const MENU_LIST_AUTHENTICATED_CORPORATE = [
  { text: "Home", href: "/" },
  { text: "Dashboard", href: "/dashboard" },
  {
    text: "Job Management",
    href: "#", // Use # as the href for dropdown
    subMenu: [
      { text: "Create Job Listing", href: "/jobListingManagement" },
      { text: "Edit Job Listing", href: "/jobListingManagement" },
      {
        text: "View My Job Listings",
        href: "/jobListingManagement/viewAllMyJobListings",
      },
      // Add more sub-menu items as needed
    ],
  },
  { text: "Event Management", href: "/eventManagement" },
  { text: "Invoices", href: "/invoices" },
  { text: "Contact", href: "/contact" },
  { text: "Chat", href: "/chat" },
];

const MENU_LIST_UNAUTHENTICATED = [
  { text: "Home", href: "/" },
  { text: "Login/ Sign Up", href: "/login" },
];

const Navbar = () => {
  const session = useSession();

  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  let roleRef, sessionTokenRef, userIdRef;

  // utilising use context to get the latest information
  const { userData } = useContext(UserContext);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [corporate, setCorporate] = useState(null);
  const [status, setStatus] = useState(null);

  const themeContext = useContext(ThemeContext);
  const { toggle, mode } = themeContext;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  const handleSignOut = async (event) => {
    event.preventDefault();
    await signOut({ redirect: false });
    window.location.replace("/");
  };

  useEffect(() => {
    if (roleRef === "Corporate") {
      getCorporateByUserID(userIdRef, sessionTokenRef)
        .then((data) => {
          setCorporate(data);
          setStatus(data.corporatePromotionStatus); // Set the status when data is received
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [userIdRef, sessionTokenRef]);

  return (
    <header className={styles.header}>
      {navActive && <div className={styles.overlay}></div>}{" "}
      {/* Add the overlay element */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/StarHire_black.png"
            alt="StarHire"
            width={200}
            height={100}
          />
        </Link>
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
            styles.nav__menu_list_light
          }`}
        >
          {session.status == "authenticated" &&
            session.data.user.role === Enums.JOBSEEKER &&
            MENU_LIST_AUTHENTICATED_JOB_SEEKER.map((menu, idx) => (
              <div
                className={styles.menuItem}
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
              >
                <NavItem
                  active={activeIdx === idx}
                  text={menu.text}
                  href={menu.href}
                />
              </div>
            ))}

          {session.status == "authenticated" &&
            session.data.user.role === Enums.CORPORATE &&
            MENU_LIST_AUTHENTICATED_CORPORATE.map((menu, idx) => (
              <div
                className={styles.menuItem}
                key={menu.text}
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                onMouseEnter={() => setShowSubMenu(true)} // Show sub-menu on hover
                onMouseLeave={() => setShowSubMenu(false)} // Hide sub-menu on mouse leave
              >
                <div className="nav-item">
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
              </div>
            ))}

          {session.status == "unauthenticated" &&
            MENU_LIST_UNAUTHENTICATED.map((menu, idx) => (
              <div
                className={styles.menuItem}
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
                      onClick={() => setNavActive(false)}
                    />
                  </Link>
                ) : (
                  <Link href="/accountManagement">
                    <Image
                      src={HumanIcon}
                      alt="Profile Picture"
                      className={styles.avatar}
                      onClick={() => setNavActive(false)}
                    />
                  </Link>
                )}
                <h6>{userData?.userName}</h6>
              </div>
              <div className={styles.menuItem} onClick={handleSignOut}>
                <NavItem text="Logout" href={"/"} />
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
