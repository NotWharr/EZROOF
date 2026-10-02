// Every word on the site lives here. Copy edits stay in one place;
// components only handle layout and motion.

export const BRAND = { first: "Copper", second: "line" } as const;

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
] as const;

export const HERO = {
  eyebrow: "Licensed plumbing contractor",
  title: "Water where you want it. Gone when you don't.",
  sub: "Repairs, drains, heaters and repipes with upfront pricing and a 5-year labor warranty.",
  primary: "Get free estimate",
  secondary: "Call (555) 014-7663",
  ticks: ["90 min emergency response", "Flat written quotes", "5-year labor warranty"],
} as const;

export const TRUST = [
  { value: "12,400", label: "Jobs completed" },
  { value: "27 yrs", label: "In business" },
  { value: "4.9", label: "Average rating" },
  { value: "90 min", label: "Emergency response" },
] as const;

export const SERVICES = [
  {
    title: "Emergency leak repair",
    body: "Burst pipes, failed valves and active leaks stopped fast, any hour.",
    points: ["Same day dispatch", "Shutoff and dry out", "Pipe and valve rebuild"],
  },
  {
    title: "Drains and sewer",
    body: "Camera inspection, cable clearing and hydro jetting that keeps lines open.",
    points: ["Camera locating", "Hydro jetting", "Trenchless repair"],
  },
  {
    title: "Water heaters",
    body: "Tank and tankless installs, yearly flushes and same day swaps.",
    points: ["Tank and tankless", "Yearly flush service", "Expansion tanks"],
  },
  {
    title: "Repipes and remodels",
    body: "Whole home PEX and copper repipes plus bathroom rough ins.",
    points: ["PEX and copper", "Bathroom rough ins", "Pressure balancing"],
  },
] as const;

export const BASICS = {
  title: "Who we are",
  facts: [
    { value: "1999", label: "Founded in Riverside" },
    { value: "6", label: "Districts served" },
    { value: "4", label: "Core services" },
    { value: "90 min", label: "Emergency response" },
  ],
  details: [
    { no: "01", label: "Founded 1999", desc: "Family run shop, same owners, same phone number since day one." },
    { no: "02", label: "Area served", desc: "Six districts with stocked vans, so parts ride along." },
    { no: "03", label: "What we fix", desc: "Repairs, drains and sewer, water heaters, full repipes." },
    { no: "04", label: "Response promise", desc: "90 minutes for emergencies, quotes within 48 hours." },
  ],
} as const;

export const OWNER = {
  lead: "About",
  tail: "The Owner",
  img: "https://picsum.photos/seed/copperline-owner/800/1000",
  imgAlt: "Portrait of the Copperline founder",
  bio: [
    "Started at 17 holding the flashlight while his father fixed the leaks other plumbers walked away from.",
    "27 years later he runs Copperline the same way: show up fast, price it flat, stand behind it in writing.",
  ],
  quote: "I treat every home like it's my own.",
  attribution: "Michael Torres - Founder",
} as const;

export const PROMISE = {
  tileTitle: "Our promise",
  tileHint: "Tap to read it",
  dialogTitle: "Fixed right, or free",
  bullets: [
    "Flat price approved before we start",
    "Shoe covers on, water tested at every fixture",
    "5-year labor warranty in writing",
  ],
  buttonLabel: "Get free estimate",
  buttonHref: "#contact",
  closeLabel: "Close dialog",
} as const;

export const TABS = {
  tabs: ["Credentials", "Values"],
  credentials: [
    { title: "Licensed C-36", desc: "State plumbing license, verified and current." },
    { title: "$2M insured", desc: "Liability and workers comp on every job." },
    { title: "Factory certified", desc: "Trained on the heaters we install." },
    { title: "5-year warranty", desc: "Labor covered in writing, not spoken." },
  ],
  values: [
    { title: "Upfront pricing", desc: "Flat written quotes. The invoice matches or the extra is free." },
    { title: "Tidy vans, tidy homes", desc: "Shoe covers, drop cloths, tested fixtures before we leave." },
    { title: "Answer the phone", desc: "Humans on the line, 90 minutes for emergencies." },
  ],
} as const;

export const NUMBERS = [
  { value: 27, decimals: 0, prefix: "", suffix: " yrs", label: "In business" },
  { value: 12400, decimals: 0, prefix: "", suffix: "", label: "Jobs done" },
  { value: 4.9, decimals: 1, prefix: "", suffix: "", label: "Average rating" },
  { value: 90, decimals: 0, prefix: "", suffix: " min", label: "Emergency response" },
] as const;

export const VIDEO = {
  eyebrow: "How we work",
  title: "Diagnosed on camera, fixed in one visit.",
  sub: "Watch a trap replacement, start to finish.",
  unavailable: "Video unavailable - the poster says it all.",
} as const;

export const GALLERY = {
  eyebrow: "Recent work",
  title: "Jobs still holding today.",
  items: [
    { seed: "copperline-repipe", job: "Repipe", location: "Riverside" },
    { seed: "copperline-bath", job: "Bath remodel", location: "Hillcrest" },
    { seed: "copperline-fixture", job: "Fixture swap", location: "Northside" },
    { seed: "copperline-tub", job: "Tub trim", location: "Lakeshore" },
    { seed: "copperline-sewer", job: "Sewer renewal", location: "Milltown" },
    { seed: "copperline-drain", job: "Drain rescue", location: "Westbrook" },
    { seed: "copperline-heater", job: "Heater install", location: "Riverside" },
    { seed: "copperline-roughin", job: "Rough-in", location: "Northside" },
  ],
} as const;

export const PROCESS = {
  eyebrow: "How we work",
  title: "Flat quote in one visit or less.",
  steps: [
    { title: "Diagnose", body: "Camera inspection and pressure tests with photos you keep." },
    { title: "Fix", body: "Shoe covers on, water tested at every fixture before we leave." },
    { title: "Backed", body: "Walkthrough plus a 5-year labor warranty in writing." },
  ],
} as const;

export const AREAS = {
  title: "Local vans, fast arrival.",
  body: "We run stocked vans across six districts, so the part for your fix is usually already on board.",
  districts: ["Northside", "Westbrook", "Riverside", "Milltown", "Hillcrest", "Lakeshore"],
  hours: "Mon-Fri 7AM-6PM, Sat 8AM-2PM, burst pipe line open 24/7.",
  emergencyTitle: "Burst pipe right now?",
  emergencyBody: "Call the burst pipe line. We stop the water today and quote free.",
} as const;

export const FAQ = [
  {
    question: "How fast can you get here?",
    answer: "Emergency calls get a 90 minute response window. Standard jobs book within 48 hours.",
  },
  {
    question: "Are you licensed and insured?",
    answer: "Yes. Every job is run by a licensed, bonded and insured crew, with permits pulled where required.",
  },
  {
    question: "Do you fix sewers without digging?",
    answer: "Yes. We camera inspect first, then line or burst the pipe trenchless wherever the line allows.",
  },
  {
    question: "Should I flush my water heater?",
    answer: "Yearly in hard water areas. Our flush service takes under an hour and extends tank life for years.",
  },
  {
    question: "Do I get the price before you start?",
    answer: "Always. You approve a flat written quote first. The invoice matches it or the extra work is free.",
  },
] as const;

export const CONTACT = {
  phone: "(555) 014-7663",
  phoneHref: "tel:+15550147663",
  email: "hello@copperline.com",
  address: "2400 Industrial Way, Riverside",
  hours: "Mon-Fri 7AM-6PM, Sat 8AM-2PM",
  stormLine: "Burst pipe line open 24/7",
} as const;

export const FOOTER = {
  tagline: "Repairs, drains, water heaters and repipes for homes and businesses. Flowing right since 1999.",
  columns: [
    {
      heading: "Services",
      links: [
        { label: "Emergency repair", href: "#work" },
        { label: "Drains and sewer", href: "#work" },
        { label: "Water heaters", href: "#work" },
        { label: "Repipes", href: "#work" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#about-owner" },
        { label: "Our promise", href: "#about-dialog" },
        { label: "Credentials", href: "#about-tabs" },
        { label: "Numbers", href: "#about-numbers" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Cost estimator", href: "#contact" },
        { label: "Get an estimate", href: "#contact" },
        { label: "Emergencies", href: "#contact" },
        { label: "Reviews", href: "#contact" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "(555) 014-7663", href: "tel:+15550147663" },
        { label: "hello@copperline.com", href: "mailto:hello@copperline.com" },
        { label: "2400 Industrial Way, Riverside", href: "#contact" },
        { label: "Mon-Fri 7AM-6PM, Sat 8AM-2PM", href: "#contact" },
      ],
    },
  ],
  legal: "© 2026 Copperline. Concept website, not a real business.",
  credit: "Designed and built in-house by the Copperline team",
} as const;

export const CTA = {
  title: "Get plumbing you stop thinking about.",
  body: "Free inspections, upfront pricing, 5-year labor warranty. Most quotes delivered within 48 hours.",
} as const;
