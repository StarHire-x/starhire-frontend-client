'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from './Navbar.module.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect, useContext } from 'react';
import NavItem from '../navItem/NavItem';
import HumanIcon from '../../../public/icon.png';
import { UserContext } from '@/context/UserContext';
import { getCorporateByUserID } from '@/app/api/payment/route';
import Enums from '@/common/enums/enums';
import { ThemeContext } from '@/context/ThemeContext';

const MENU_LIST_AUTHENTICATED_JOB_SEEKER = [
  { text: 'Home', href: '/' },
  { text: 'Job Listings', href: '/jobListing' },
  { text: 'Job Applications', href: '/jobApplication' },
  { text: 'Forum', href: '/forum' },
  { text: 'Events', href: '/event' },
  { text: 'Contact', href: '/contact' },
  { text: 'Chat', href: '/chat' },
];

const MENU_LIST_AUTHENTICATED_CORPORATE = [
  { text: 'Home', href: '/' },
  {
    text: 'Job Listing Management',
    href: '#', // Use # as the href for dropdown
    subMenu: [
      { text: 'Create Job Listing', href: '/jobListingManagement' },
      { text: 'Edit Job Listing', href: '/jobListingManagement' },
      {
        text: 'View My Job Listings',
        href: '/jobListingManagement/viewAllMyJobListings',
      },
      // Add more sub-menu items as needed
    ],
  },
  { text: 'Event Management', href: '/eventManagement' },
  { text: 'Contact', href: '/contact' },
  { text: 'Chat', href: '/chat' },
];

const MENU_LIST_UNAUTHENTICATED = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '/about' },
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

  useEffect(() => {
    getCorporateByUserID(userIdRef, sessionTokenRef)
      .then((data) => {
        setCorporate(data);
        setStatus(data.corporatePromotionStatus); // Set the status when data is received
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [userIdRef, sessionTokenRef]);

  return (
    <header className={styles.header}>
      {navActive && <div className={styles.overlay}></div>}{" "}
      {/* Add the overlay element */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          StarHire
        </Link>
        {/* <DarkModeToggle /> */}
        <button
          style={{
            backgroundColor:
              status === "Premium"
                ? "gold"
                : "initial",
          }}
        >
          {status}
        </button>
        


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
                  // setShowSubMenu(true);
                }}
                key={menu.text}
                // onMouseEnter={() => setShowSubMenu(true)} // Show sub-menu on hover
                // onMouseLeave={() => setShowSubMenu(false)} // Hide sub-menu on mouse leave
              >
                {/* <Link href={menu.href}> */}
                <NavItem
                  active={activeIdx === idx}
                  text={menu.text}
                  href={menu.href}
                />
                {/* </Link> */}
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
