import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [variant, setVariant] = useState("B"); // Cambia a "C" para probar
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  return (
    <nav 
      className={`${styles.navbar} 
        ${scrolled ? styles.scrolled : ""} 
        ${variant === "C" ? styles.glass : ""}`}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏗️</span>
          <span className={styles.logoText}>
            Build<span className={styles.logoHighlight}>Pro</span>
          </span>
        </Link>

        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/formulario" className={styles.ctaButton}>
            Get Quote
          </Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path} className={styles.mobileLink}>
            {link.label}
          </Link>
        ))}
        <Link to="/formulario" className={styles.mobileCta}>Get Quote</Link>
      </div>
    </nav>
  );
}

export default Navbar;