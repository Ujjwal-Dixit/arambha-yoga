const ticker = [
  "🌿 New batch starting May 5th — Register now!",
  "✨ Free trial class for first-time students",
  "🪢 Aerial Yoga weekend workshop — limited spots",
  "🌸 Prenatal Yoga: special session every Saturday 7:30 AM",
  "💚 Refer a friend and get 10% off your next month",
  "🧘 Early bird offer: join before April 30 and save 15%",
];

const repeated = [...ticker, ...ticker];

export default function AnnouncementBar() {
  return (
    <div className="bg-forest text-white py-2 overflow-hidden sticky top-0 z-50">
      <div className="flex gap-0 animate-[ticker_30s_linear_infinite] whitespace-nowrap w-max">
        {repeated.map((item, i) => (
          <span key={i} className="text-xs font-medium px-8 shrink-0">
            {item}
            <span className="ml-8 text-sage-light/40">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
