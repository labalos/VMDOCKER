
import Navbar from '../components/Navbar';
import Hero from "../components/Hero";
import Services from '../components/Services';
import FeaturedProjects from '../components/FeaturedProjects';
import Formulario from '../components/Formulario';  // Opcional: también en landing

export default function LandingPage() {
  return (
    <>
      <Navbar />  {/* Navbar solo en landing */}
      
      <main>
        <Hero />
        <Services />
        <FeaturedProjects />
        
        {/* Opcional: Formulario también en landing page */}
        <section id="contact" style={{ padding: '80px 20px' }}>
          <Formulario />
        </section>
      </main>
    </>
  );
}