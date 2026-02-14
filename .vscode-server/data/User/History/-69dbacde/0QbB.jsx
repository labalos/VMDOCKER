import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [variant] = useState("C"); // Glass
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY.current || currentScrollY < 50);
      setScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/formulario", label: "Contact" },
  ];
  const isActive = (path) => location.pathname === path;
  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${variant === "C" ? styles.glass : ""} ${visible ? styles.visible : styles.hidden}`}
      role="navigation"
      aria-label="Main"
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMobile} aria-label="Go Home">
          <span className={styles.logoIcon}>🏗️</span>
          <span className={styles.logoText}>
            Build<span className={styles.logoHighlight}>Pro Menhorn</span>
          </span>
        </Link>

        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMobile}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/formulario" className={styles.ctaButton} onClick={closeMobile}>
            Get Quote
          </Link>
        </div>

        <button
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={closeMobile}
            className={`${styles.mobileLink} ${isActive(link.path) ? styles.active : ""}`}
          >
            {link.label}
          </Link>
        ))}
        <Link to="/formulario" className={styles.mobileCta} onClick={closeMobile}>Get Quote</Link>
      </div>
    </nav>
  );
}

export default Navbar;
