import Hero from "../components/Hero";
import Services from "../components/Services";
import FeaturedProjects from "../components/FeaturedProjects";  // NUEVO

function LandingPage() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProjects />  {/* NUEVO */}
      {/* Próximo: Footer */}
    </>
  );
}

export default LandingPage;