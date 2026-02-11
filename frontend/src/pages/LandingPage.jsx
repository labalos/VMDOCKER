import Hero from "../components/Hero";
import Services from '../components/Services';
import FeaturedProjects from '../components/FeaturedProjects';
import Formulario from '../components/Formulario';

export default function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Services />
        <FeaturedProjects />
        <section id="contact" style={{ padding: '80px 20px' }}>
          <Formulario />
        </section>
      </main>
    </>
  );
}