import { useNavigate } from "react-router-dom";
import styles from "./FeaturedProjects.module.css";

function FeaturedProjects() {
  const navigate = useNavigate();

  // Estos datos vendrán de tu API después
  const projects = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      title: "Modern Kitchen Remodel",
      category: "Remodeling",
      location: "Miami, FL",
      description: "Complete kitchen renovation with custom cabinets and premium finishes.",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      title: "Luxury Home Construction",
      category: "Construction",
      location: "Austin, TX",
      description: "New 4-bedroom family home built from ground up in 8 months.",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      title: "Commercial Office Build",
      category: "Construction",
      location: "Denver, CO",
      description: "Modern office space for tech startup with open floor plan.",
    },
  ];

  return (
    <section className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Portfolio</span>
          <h2 className={styles.title}>Featured Projects</h2>
          <p className={styles.description}>
            Explore our recent work and see the quality we bring to every project.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <span className={styles.category}>{project.category}</span>
                </div>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.location}>📍 {project.location}</p>
                <p className={styles.projectDescription}>{project.description}</p>
                <button 
                  className={styles.viewButton}
                  onClick={() => navigate("/projects")}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <button 
            className={styles.allProjectsButton}
            onClick={() => navigate("/projects")}
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;