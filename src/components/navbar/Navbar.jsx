'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from './Navbar.module.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import NavItem from '../navItem/NavItem';
import HumanIcon from "../../../public/icon.png";

import { getUserByUserId } from '@/app/api/auth/user/route';

const MENU_LIST_AUTHENTICATED_JOB_SEEKER = [
  { text: "Home", href: "/" },
  { text: "Account Management", href: "/accountManagement" },
  { text: "Job Listings", href: "/jobListing" },
  { text: "Forum", href: "/forum" },
  { text: "Events", href: "/events" },
  { text: "Contact", href: "/contact" },
  { text: "Chat", href: "/chat" },
];

const MENU_LIST_AUTHENTICATED_CORPORATE = [
  { text: "Home", href: "/" },
  { text: "Account Management", href: "/accountManagement" },
  { text: "Job Listing Management", href: "/jobListingManagement" },
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
  const [imageUrl, setImageUrl] = useState(null);
  const [userName, setUserName] = useState(null);
  let roleRef, sessionTokenRef, userIdRef;

  if (session && session.data && session.data.user) {
    userIdRef = session.data.user.userId;
    roleRef = session.data.user.role;
    sessionTokenRef = session.data.user.accessToken;
  }

  useEffect(() => {
    if (session.status === "authenticated") {
      const fetchData = () => {
        getUserByUserId(userIdRef, roleRef, sessionTokenRef)
          .then((user) => {
            setImageUrl(user.data.profilePictureUrl);
            setUserName(user.data.userName);
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
          });
      };

      fetchData(); // Fetch immediately

      const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [session.status, userIdRef, roleRef, sessionTokenRef]);

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
          className={`${navActive ? styles.active : ''} ${
            styles.nav__menu_list
          }`}
        >
          {session.status == 'authenticated' && session.data.user.role === "Job_Seeker" && MENU_LIST_AUTHENTICATED_JOB_SEEKER.map((menu, idx) => (
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
          {session.status == 'authenticated' && session.data.user.role === "Corporate" && MENU_LIST_AUTHENTICATED_CORPORATE.map((menu, idx) => (
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
          {session.status == 'unauthenticated' && MENU_LIST_UNAUTHENTICATED.map((menu, idx) => (
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
          {session.status === 'authenticated' && (
            <>
             <div className={styles.imageContainer}>
             {imageUrl !== "" ? (
                 <img
                 src={imageUrl}
                 alt="User Profile"
                 className={styles.avatar}
               />
              ) : (
                <Image src={HumanIcon} alt="Profile Picture" className={styles.avatar} />
              )}
              <h6>{userName}</h6>
            </div>
            <button className={styles.logout} onClick={signOut}>
              Logout
            </button>
            </>
          )}
          {session.status === 'unauthenticated' && (
            <button
              className={styles.login}
              onClick={() => (window.location.href = '/login')}
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
