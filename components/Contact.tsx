"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { site } from "@/lib/site";
import { getDayType, slotsFor, todayInIST } from "@/lib/schedule";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-parchment bg-cream/50 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition";

type Enquiry = {
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.99 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.887 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.58 0 11.94-5.359 11.943-11.945a11.87 11.87 0 00-3.416-8.4" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState<Enquiry>({
    name: "",
    phone: "",
    service: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [website, setWebsite] = useState(""); // honeypot
  const dateRef = useRef<HTMLInputElement>(null);

  // Applied to the DOM after mount rather than rendered as an attribute:
  // computing it during render would bake the build date into the prerendered
  // HTML and mismatch on hydration.
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = todayInIST();
  }, []);

  const dayType = getDayType(form.date);
  const availableSlots = slotsFor(dayType);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    // Reset time slot whenever date changes so stale selection is cleared
    if (name === "date") {
      setForm((prev) => ({ ...prev, date: value, timeSlot: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm({ name: "", phone: "", service: "", date: "", timeSlot: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
  }

  return (
    <section id="contact" className="py-12 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
            Get In Touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest leading-tight mb-4">
            Begin Your Journey
          </h2>
          <p className="text-charcoal/60 max-w-md mx-auto">
            Reach out to book a class, ask a question, or just say hello.
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-parchment shadow-sm">
              <h3 className="font-display text-xl font-semibold text-forest mb-6">
                Find Us
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-9 h-9 rounded-full bg-sage-light/50 flex items-center justify-center shrink-0">📍</div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-0.5">Address</p>
                    <p className="text-charcoal/65 text-sm leading-relaxed">
                      401 Raghava Plaza,<br />
                      Kondapur Hi Tension Line,<br />
                      Raghvendra Colony, Hyderabad
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-9 h-9 rounded-full bg-sage-light/50 flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-0.5">WhatsApp</p>
                    <a
                      href={site.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal/65 text-sm hover:text-forest transition-colors"
                    >
                      {`Message us on ${site.phoneDisplay}`}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-9 h-9 rounded-full bg-sage-light/50 flex items-center justify-center shrink-0">📞</div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-0.5">Phone</p>
                    <a href={site.phoneHref} className="text-charcoal/65 text-sm hover:text-forest transition-colors">
                      {site.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-9 h-9 rounded-full bg-sage-light/50 flex items-center justify-center shrink-0">📸</div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-0.5">Instagram</p>
                    <a
                      href={site.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal/65 text-sm hover:text-forest transition-colors"
                    >
                      {site.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden border border-parchment shadow-sm h-52 flex items-center justify-center">
              <div className="text-center text-charcoal/40">
                <div className="text-3xl mb-2">🗺</div>
                <p className="text-sm">Kondapur, Hyderabad</p>
                <a
                  href="https://maps.google.com/?q=Kondapur+Hi+Tension+Line+Raghvendra+Colony+Hyderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-forest hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-parchment shadow-sm">
            <h3 className="font-display text-xl font-semibold text-forest mb-6">
              Book / Send an Enquiry
            </h3>

            {status === "sent" ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🙏</div>
                <h4 className="font-display text-xl font-semibold text-forest mb-2">
                  Namaste!
                </h4>
                <p className="text-charcoal/60 text-sm leading-relaxed max-w-xs mx-auto">
                  Your enquiry has reached us. We&apos;ll call or message you
                  shortly to get you started.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 text-sm text-forest underline underline-offset-2"
                >
                  Send another enquiry
                </button>
              </div>
            ) : status === "error" ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">😔</div>
                <h4 className="font-display text-xl font-semibold text-forest mb-2">
                  That didn&apos;t go through
                </h4>
                <p className="text-charcoal/60 text-sm leading-relaxed max-w-xs mx-auto">
                  Something went wrong on our side. Please message us directly —
                  we&apos;ll get straight back to you.
                </p>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-[#25D366] text-white font-medium text-sm hover:bg-[#1da851] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Message us on WhatsApp
                </a>
                <button
                  onClick={reset}
                  className="block mx-auto mt-5 text-sm text-forest underline underline-offset-2"
                >
                  Try the form again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot — hidden from people, tempting to bots */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                {/* Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-forest mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest mb-1.5">
                      Phone <span className="text-charcoal/40 font-normal">(if you prefer a call)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 ..."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-medium text-forest mb-1.5">Interested In</label>
                  <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                    <option value="">Select a class...</option>
                    <option>Wall Yoga</option>
                    <option>Chair Yoga</option>
                    <option>Dumbbell Yoga</option>
                    <option>Stick Yoga</option>
                    <option>Mat Pilates</option>
                    <option>Power Yoga</option>
                    <option>Brick Yoga</option>
                    <option>Aerial Yoga</option>
                    <option>Restorative Yoga</option>
                    <option>Hatha Yoga</option>
                    <option>Ashtanga Yoga</option>
                    <option>Acro Yoga</option>
                    <option>Pranayama</option>
                    <option>Prenatal / Postnatal Yoga</option>
                    <option>200-Hour Teacher Training</option>
                    <option>Not sure — need guidance</option>
                  </select>
                </div>

                {/* Date + Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-forest mb-1.5">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      ref={dateRef}
                      value={form.date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest mb-1.5">Preferred Time Slot</label>

                    {dayType === "sunday" ? (
                      <div className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-700 flex items-center gap-2">
                        <span>🙏</span>
                        <span>No classes on Sundays</span>
                      </div>
                    ) : (
                      <select
                        name="timeSlot"
                        value={form.timeSlot}
                        onChange={handleChange}
                        disabled={!dayType}
                        className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="">
                          {dayType ? "Select a slot..." : "Pick a date first"}
                        </option>
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-forest mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Tell us about your experience level, goals, or any questions..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3.5 rounded-full bg-forest text-white font-medium tracking-wide hover:bg-forest-mid transition-colors disabled:opacity-70 shadow-lg shadow-forest/20"
                >
                  {status === "sending" ? "Sending..." : "Send Enquiry"}
                </button>
                <p className="text-center text-xs text-charcoal/45 leading-relaxed">
                  We&apos;ll use your details only to respond to this enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
