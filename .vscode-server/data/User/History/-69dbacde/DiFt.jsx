import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [variant, setVariant] = useState("C"); // Glass
  const [visible, setVisible] = useState(true); // Navbar auto-hide
  const location = useLocation();

  const lastScrollY = useRef(0);

  // Scroll listener para navbar fijo y visible/oculto
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Aparece si scroll hacia arriba, desaparece si baja
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > 50) {
        setVisible(false);
      }

      setScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra menú móvil al cambiar de ruta
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
        ${variant === "C" ? styles.glass : ""} 
        ${visible ? styles.visible : styles.hidden}`}
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
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ""}`}
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
