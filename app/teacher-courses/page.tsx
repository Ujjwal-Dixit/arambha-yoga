import type { Metadata } from "next";
import Image from "next/image";
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
        <section className="relative overflow-hidden bg-cream pt-24 pb-8">
          <div
            className="absolute top-10 right-10 w-72 h-72 rounded-full bg-sage/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-earth/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Image
                src="/rys-200.png"
                alt="Yoga Alliance Registered Yoga School — RYS 200"
                width={400}
                height={400}
                sizes="(max-width: 768px) 80px, 96px"
                className="h-20 w-20 md:h-24 md:w-24 object-contain"
                priority
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-forest">
                  International Yoga Alliance
                </p>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Registry ID: 661801
                </p>
              </div>
            </div>

            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-2">
              Registered Yoga School
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-forest leading-tight mb-4">
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
