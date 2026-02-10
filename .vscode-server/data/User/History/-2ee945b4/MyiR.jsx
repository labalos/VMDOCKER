import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          Building Your Vision<br />
          <span className={styles.highlight}>Constructing Excellence</span>
        </h1>
        
        <p className={styles.subtitle}>
          Professional construction services with 15+ years of experience.<br />
          From remodeling to new builds, we bring your projects to life.
        </p>
        
        <div className={styles.buttons}>
          <button 
            className={styles.btnPrimary}
            onClick={() => navigate("/formulario")}
          >
            Get a Quote
          </button>
          <button 
            className={styles.btnSecondary}
            onClick={() => navigate("/projects")}
          >
            View Projects
          </button>
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <div className={styles.arrow}></div>
      </div>
    </section>
  );
}

export default Hero;