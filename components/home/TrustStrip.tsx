import { Wrench, Certificate, Star, Timer } from "@phosphor-icons/react/dist/ssr";

const stats = [
  { icon: Wrench, value: "12,400", label: "Jobs completed" },
  { icon: Certificate, value: "27 yrs", label: "In business" },
  { icon: Star, value: "4.9", label: "Average rating" },
  { icon: Timer, value: "90 min", label: "Emergency response" },
];

export default function TrustStrip() {
  return (
    <section aria-label="Company credentials" className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 border-l-2 border-[#acff46] pl-4"
            >
              <stat.icon size={28} className="text-[#acff46] shrink-0" aria-hidden />
              <div>
                <dt className="order-2 text-sm text-zinc-400">{stat.label}</dt>
                <dd className="order-1 font-mono text-2xl font-bold text-white">
                  {stat.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
