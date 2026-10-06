import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Promotions from "@/components/Promotions";
import Carousel from "@/components/Carousel";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Promotions come from the database. Saving in the admin dashboard refreshes
// this page immediately; the hourly revalidate is what lets a promotion appear
// or expire on its scheduled date without anyone touching it.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Promotions />
        <Carousel />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
