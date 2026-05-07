"use client";

import { useState, FormEvent } from "react";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-parchment bg-cream/50 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition";

const today = new Date().toISOString().split("T")[0];

const WEEKDAY_SLOTS = ["5:30 AM", "6:30 AM", "7:30 AM", "8:30 AM", "5:00 PM", "6:00 PM"];
const SATURDAY_SLOTS = ["7:30 AM"];

function getDayType(dateStr: string): "weekday" | "saturday" | "sunday" | null {
  if (!dateStr) return null;
  // Append T00:00:00 so JS parses it in local time, not UTC
  const day = new Date(dateStr + "T00:00:00").getDay(); // 0=Sun, 6=Sat
  if (day === 0) return "sunday";
  if (day === 6) return "saturday";
  return "weekday";
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const dayType = getDayType(form.date);
  const availableSlots =
    dayType === "weekday" ? WEEKDAY_SLOTS :
    dayType === "saturday" ? SATURDAY_SLOTS : [];

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
    // TODO: wire up to API route in Phase 3
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", service: "", date: "", timeSlot: "", message: "" });
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
                  <div className="mt-1 w-9 h-9 rounded-full bg-sage-light/50 flex items-center justify-center shrink-0">📞</div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-0.5">Phone</p>
                    <a href="tel:9553809135" className="text-charcoal/65 text-sm hover:text-forest transition-colors">
                      +91 95538 09135
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-9 h-9 rounded-full bg-sage-light/50 flex items-center justify-center shrink-0">📸</div>
                  <div>
                    <p className="font-medium text-forest text-sm mb-0.5">Instagram</p>
                    <a
                      href="https://www.instagram.com/arambha.yoga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal/65 text-sm hover:text-forest transition-colors"
                    >
                      @arambha.yoga
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
                <h4 className="font-display text-xl font-semibold text-forest mb-2">Namaste!</h4>
                <p className="text-charcoal/60">
                  Thank you for reaching out. We&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-5 text-sm text-forest underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block text-xs font-medium text-forest mb-1.5">Phone Number</label>
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

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-forest mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className={inputClass}
                  />
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
                      value={form.date}
                      onChange={handleChange}
                      min={today}
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
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
