import { useNavigate } from "react-router-dom";
import { Button } from "./ui";
import styles from "./Hero.module.css";

function Hero() {
  const navigate = useNavigate();

  const goTo = (path) => {
    // evita navegación si ya estás en la ruta
    if (window.location.pathname !== path) navigate(path);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      
      <div className={styles.content}>
        <span className={styles.label}>Construction Services</span>
        <h1 className={styles.title}>
          Building Your Vision
          <span className={styles.highlight}>Constructing Excellence</span>
        </h1>
        <p className={styles.subtitle}>
          Professional construction services with 15+ years of experience.
          From remodeling to new builds, we bring your projects to life.
        </p>
        
        <div className={styles.buttons}>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => goTo("/formulario")}
          >
            Get a Quote
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => goTo("/projects")}
          >
            View Projects
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
