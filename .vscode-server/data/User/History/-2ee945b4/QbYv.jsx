cat > src/components/Hero.jsx << 'EOF'
import { useNavigate } from "react-router-dom";
import { Button } from "./ui";
import styles from "./Hero.module.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      
      <div className={styles.content}>
        <span className={styles.label}>Construction Services</span>
        <h1 className={styles.title}>
          Building Your Vision
          <span className={styles.highlight}>Constructing Excellence</span>
        </h1>
        <p className={styles.description}>
          Professional construction services with 15+ years of experience.
          From remodeling to new builds, we bring your projects to life.
        </p>
        
        <div className={styles.buttons}>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate("/formulario")}
          >
            Get a Quote
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/projects")}
          >
            View Projects
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
EOF