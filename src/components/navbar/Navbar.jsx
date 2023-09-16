'use client';
import Link from 'next/link';
import React from 'react';
import styles from './Navbar.module.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import NavItem from '../navItem/NavItem';

const MENU_LIST_AUTHENTICATED = [
  { text: "Home", href: "/" },
  { text: "Account", href: "/accountManagement" },
  { text: "Portfolio", href: "/portfolio" },
  { text: "Job Listings", href: "/jobListing" },
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
          {session.status == 'authenticated' && MENU_LIST_AUTHENTICATED.map((menu, idx) => (
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
            <button className={styles.logout} onClick={signOut}>
              Logout
            </button>
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
