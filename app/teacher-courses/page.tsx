import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TeacherTraining from "@/components/TeacherTraining";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Teacher Courses — RYS 200 Yoga Teacher Training | Arambha Yoga & Wellness",
  description:
    "200-hour Yoga Teacher Training at Arambha Yoga & Wellness, Kondapur, Hyderabad. A Registered Yoga School (RYS 200) programme covering technique, anatomy, philosophy and teaching practice.",
};

export default function TeacherCoursesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <section className="relative overflow-hidden bg-cream pt-32 pb-12 md:pt-40 md:pb-16">
          <div
            className="absolute top-10 right-10 w-72 h-72 rounded-full bg-sage/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-earth/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <nav className="mb-6 text-xs text-charcoal/40" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-forest transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-charcoal/60">Teacher Courses</span>
            </nav>

            <Image
              src="/rys-200.png"
              alt="Yoga Alliance Registered Yoga School — RYS 200"
              width={400}
              height={400}
              sizes="(max-width: 768px) 112px, 144px"
              className="h-28 w-28 md:h-36 md:w-36 mx-auto mb-6 object-contain"
              priority
            />

            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
              Registered Yoga School
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-forest leading-tight mb-5">
              Teacher Courses
            </h1>
            <p className="text-charcoal/60 max-w-xl mx-auto leading-relaxed">
              Train to teach with a 200-hour programme rooted in tradition and
              built for the way people actually practise today — right here in
              Kondapur.
            </p>
          </div>
        </section>

        <TeacherTraining />
      </main>
      <Footer />
    </>
  );
}
