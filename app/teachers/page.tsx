import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Teachers from "@/components/Teachers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Meet Our Teachers | Arambha Yoga & Wellness, Kondapur",
  description:
    "Meet the certified yoga teachers behind Arambha Yoga & Wellness in Kondapur, Hyderabad — Giri Yadav (RYT 500), Harish Veladi and Sowjanya Rao (RYT 200).",
};

export default function TeachersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <section className="relative overflow-hidden bg-cream pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-sage/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-earth/15 blur-3xl" aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
              Our Team
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-forest leading-tight mb-5">
              Meet Our Teachers
            </h1>
            <p className="text-charcoal/60 max-w-xl mx-auto leading-relaxed">
              Every practice at Arambha is guided by teachers who have walked
              the path themselves — bringing decades of combined experience,
              formal certification, and genuine care to every class.
            </p>
          </div>
        </section>

        <Teachers />

        {/* CTA */}
        <section className="bg-cream py-14 md:py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-4">
              Practise With Us
            </h2>
            <p className="text-charcoal/60 mb-7 leading-relaxed">
              Book a class with any of our teachers, or tell us your goals and
              we&apos;ll help you find the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#contact"
                className="px-7 py-3.5 rounded-full bg-forest text-white font-medium tracking-wide hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20"
              >
                Book a Class
              </Link>
              <Link
                href="/#services"
                className="px-7 py-3.5 rounded-full border-2 border-forest text-forest font-medium tracking-wide hover:bg-forest hover:text-white transition-colors"
              >
                Explore Classes
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
