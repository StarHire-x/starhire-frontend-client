'use client';
import Link from 'next/link';
import React from 'react';
import styles from './Navbar.module.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import NavItem from '../navItem/NavItem';

const links = [
  {
    id: 1,
    title: 'Home',
    url: '/',
  },
  {
    id: 2,
    title: 'Portfolio',
    url: '/portfolio',
  },
  {
    id: 3,
    title: 'Manage Job Listings',
    url: '/jobListingManagement',
  },
  {
    id: 4,
    title: 'Blog',
    url: '/blog',
  },
  {
    id: 3,
    title: 'Contact',
    url: '/contact',
  },
  {
    id: 4,
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    id: 5,
    title: 'Chat',
    url: '/chat',
  },
];

const MENU_LIST = [
  { text: 'Home', href: '/' },
  { text: 'Portfolio', href: '/portfolio' },
  { text: 'Job Listings', href: '/jobListings' },
  { text: 'Blog', href: '/blog' },
  { text: 'Contact', href: '/contact' },
  { text: 'Chat', href: '/chat' },
];

const Navbar = () => {
  const session = useSession();
  const [showDropdown, setShowDropdown] = useState(null);

  const handleLinkMouseEnter = (linkId) => {
    setShowDropdown(linkId);
  };

  const handleLinkMouseLeave = () => {
    setShowDropdown(null);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          StarHire
        </Link>
        <div className={styles.links}>
          <DarkModeToggle />
          {links.map((link) => (
            <div
              key={link.id}
              className={styles.linkContainer}
              onMouseEnter={() => handleLinkMouseEnter(link.id)}
              onMouseLeave={handleLinkMouseLeave}
            >
              <Link href={link.url} className={styles.link}>
                {link.title}
              </Link>
              {link.submenu && showDropdown === link.id && (
                <div className={styles.dropdown}>
                  {link.submenu.map((submenuItem) => (
                    <Link
                      key={submenuItem.id}
                      href={submenuItem.url}
                      className={styles.submenuItem}
                    >
                      {submenuItem.title}
                    </Link>
                  ))}
                </div>
              )}
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
