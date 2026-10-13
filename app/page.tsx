import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Promotions from "@/components/Promotions";
import Carousel from "@/components/Carousel";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getLiveOfferPosters,
  getPublishedGallery,
  getPublishedTestimonials,
  getSchedule,
} from "@/lib/db/content";

// Promotions come from the database. Saving in the admin dashboard refreshes
// this page immediately; the hourly revalidate is what lets a promotion appear
// or expire on its scheduled date without anyone touching it.
export const revalidate = 3600;

export default async function Home() {
  // Everything the owner manages from /admin. Plain objects only — most of
  // these sections are client components.
  const [schedule, posters, gallery, reviews] = await Promise.all([
    getSchedule(),
    getLiveOfferPosters(),
    getPublishedGallery(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero
          offers={posters.map((p) => ({
            src: p.imageUrl,
            width: p.width,
            height: p.height,
            alt: p.alt,
          }))}
        />
        <Promotions />
        <Carousel
          slides={gallery.map((g) => ({
            src: g.imageUrl,
            width: g.width,
            height: g.height,
            caption: g.caption,
          }))}
        />
        <About />
        <Services />
        <Testimonials
          reviews={reviews.map((r) => ({ name: r.name, context: r.context, quote: r.quote }))}
        />
        <Contact schedule={schedule} />
      </main>
      <Footer />
    </>
  );
}
