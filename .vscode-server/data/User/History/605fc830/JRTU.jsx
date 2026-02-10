import styles from "./Services.module.css";

function Services() {
  const services = [
    {
      icon: "🏠",
      title: "Remodeling",
      description: "Transform your existing spaces with modern designs and quality craftsmanship.",
    },
    {
      icon: "🏗️",
      title: "Construction",
      description: "New builds from foundation to finish, built to last with premium materials.",
    },
    {
      icon: "🎨",
      title: "Painting",
      description: "Interior and exterior painting with flawless finishes and durable coatings.",
    },
    {
      icon: "🪵",
      title: "Flooring",
      description: "Hardwood, tile, vinyl, and more. Beautiful floors for every room.",
    },
    {
      icon: "🔧",
      title: "Other",
      description: "Custom projects, repairs, and specialized solutions for your unique needs.",
    },
  ];

  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>What We Do</span>
          <h2 className={styles.title}>Our Services</h2>
          <p className={styles.description}>
            From small repairs to major construction, we deliver quality 
            workmanship on every project.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{service.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;  // ← ESTA LÍNEA ES CRÍTICA