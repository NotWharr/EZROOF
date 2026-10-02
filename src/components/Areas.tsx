import { AREAS, CONTACT } from "../content";
import { Reveal } from "./ui";

// Service area: district checklist beside the emergency card.
export default function Areas() {
  return (
    <section aria-label="Service area" className="relative border-t border-line">
      <div className="mx-auto grid w-[min(72rem,100%-2rem)] grid-cols-1 items-start gap-10 py-16 lg:grid-cols-12 lg:py-24">
        <Reveal className="lg:col-span-7">
          <h2 className="max-w-[22ch] font-display text-h2 font-bold leading-[1.05] tracking-tight">
            {AREAS.title}
          </h2>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted">{AREAS.body}</p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AREAS.districts.map((area) => (
              <li
                key={area}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-zinc-200"
              >
                <span aria-hidden="true" className="text-accent">◈</span>
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <span aria-hidden="true" className="text-accent">◷</span>
            {AREAS.hours}
          </p>
        </Reveal>
        <Reveal className="lg:col-span-5">
          <aside className="rounded-2xl bg-accent p-8 text-accent-ink">
            <h3 className="text-2xl font-bold tracking-tight">{AREAS.emergencyTitle}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed">{AREAS.emergencyBody}</p>
            <a
              href={CONTACT.phoneHref}
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-bold whitespace-nowrap text-white transition-all active:scale-[0.98]"
            >
              {CONTACT.phone}
            </a>
            <a
              href="#contact"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-ink/30 px-5 py-3.5 text-sm font-bold whitespace-nowrap text-accent-ink transition-all hover:border-ink active:scale-[0.98]"
            >
              Get Free Estimate
            </a>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
