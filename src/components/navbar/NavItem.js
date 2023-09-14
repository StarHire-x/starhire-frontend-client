import Link from "next/link";
import styles from "./navbar.module.css";

const NavItem = ({ text, href, active }) => {
  return (
    <Link className={styles.nav__link} href={href}>
      {text}
    </Link>
  );
};

export default NavItem;