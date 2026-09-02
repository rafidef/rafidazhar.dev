/**
 * All page copy, ported from the legacy site.
 *
 * COPY POLICY (this is a visual overhaul, not a content rewrite):
 *   - Voice, claims, numbers and phrasing are preserved.
 *   - Every em-dash and separator en-dash is resolved per Section 9.G. Role
 *     titles that used a spaced em-dash take a comma; date ranges take a
 *     plain hyphen.
 *   - U+2011 non-breaking hyphens are normalised to plain hyphens.
 *   - Three factual-accuracy edits are applied and flagged in the Step 4
 *     audit: the unsupported "AWS Certified Skills" and "3+ Certifications"
 *     hero stats are gone with the stats strip, and "Kubernetes specialist"
 *     is out of the meta description (see lib/site.ts).
 */

export const nav = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Organizations", href: "#organizations" },
  { label: "Certifications", href: "#certifications" },
] as const;

export const navCta = { label: "Hire Me", href: "#contact" } as const;

/** One label per intent (Section 4.5). Used identically in hero and contact. */
export const CV_LABEL = "Download CV";
export const CV_HREF = "/cv/rafid-azhar-cv-ats.pdf";

export const hero = {
  name: ["Rafid Azhar", "Adi Saputra"],
  /* 17 words, inside the 20-word cap (Section 4.7). */
  subtext:
    "Information Technology graduate from Telkom University Surabaya. I migrate production infrastructure to AWS and keep it running.",
  portrait: {
    src: "/portrait/rafid-square.webp",
    alt: "Rafid Azhar Adi Saputra",
    width: 687,
    height: 687,
  },
} as const;

/** The one marquee on the page (Section 5, max one per page). */
export const stack = [
  { file: "aws.svg", label: "Amazon Web Services" },
  { file: "docker.svg", label: "Docker" },
  { file: "githubactions.svg", label: "GitHub Actions" },
  { file: "cloudflare.svg", label: "Cloudflare" },
  { file: "linux.svg", label: "Linux" },
  { file: "mikrotik.svg", label: "MikroTik" },
  { file: "ubuntu.svg", label: "Ubuntu" },
  { file: "debian.svg", label: "Debian" },
  { file: "archlinux.svg", label: "Arch Linux" },
  { file: "cisco.svg", label: "Cisco" },
  { file: "googlecloud.svg", label: "Google Cloud" },
  { file: "azure.svg", label: "Microsoft Azure" },
  { file: "git.svg", label: "Git" },
  { file: "github.svg", label: "GitHub" },
  { file: "vmware.svg", label: "VMware" },
  { file: "virtualbox.svg", label: "VirtualBox" },
] as const;

/** A run of body copy. `strong` was <strong>, `mark` was the gold .highlight. */
export type Segment = { t: string; strong?: boolean; mark?: boolean };

/* Segments carry the emphasis the legacy markup expressed with <strong> and
   .highlight, so the lime marker can replace a gold text colour. Typed
   explicitly rather than inferred, so every segment shares one shape. */
const aboutParagraphs: Segment[][] = [
    [
      { t: "I'm an " },
      { t: "Information Technology graduate", strong: true },
      { t: " of Telkom University Surabaya with a final GPA of 3.58/4.00, specializing in " },
      { t: "DevOps, Cloud Engineering, and Network Infrastructure", mark: true },
      { t: "." },
    ],
    [
      { t: "During my internship at " },
      { t: "PT Raja Teknologi Digital", strong: true },
      { t: ", I migrated production apps to " },
      { t: "AWS Lightsail", mark: true },
      { t: " with zero downtime, built " },
      { t: "GitHub Actions", mark: true },
      { t: " deployment workflows for multiple services, containerized apps with " },
      { t: "Docker", mark: true },
      { t: ", configured " },
      { t: "Cloudflare R2", mark: true },
      { t: " storage and DNS, managed " },
      { t: "Zoho SMTP", mark: true },
      { t: " for email delivery, and migrated message brokering to " },
      { t: "AWS SQS", mark: true },
      { t: "." },
    ],
    [
      { t: "I hold " },
      { t: "MTCNA", strong: true },
      { t: " (MikroTik Certified Network Associate) and " },
      { t: "BNSP Junior Network Engineer", strong: true },
      { t: " certifications, bridging solid networking fundamentals with modern cloud automation skills." },
    ],
];

export const about = {
  heading: "Who Am I",
  paragraphs: aboutParagraphs,
  info: [
    { label: "Location", value: "Ponorogo, East Java" },
    { label: "Education", value: "Telkom University Surabaya" },
    { label: "GPA", value: "3.58 / 4.00" },
    /* Preserved from the retired hero stats strip. */
    { label: "Years in IT", value: "2+" },
    { label: "Status", value: "Open to Work" },
  ],
  /* The terminal motif survives as typography, not as a simulated window.
     No traffic lights, no title bar, no chrome: Section 9.F bans div-built
     fake terminals, and the ban is about the fake UI, not the idea. */
  transcript: [
    { cmd: "whoami" },
    { out: "rafid-azhar" },
    { cmd: "cat profile.json" },
    { out: "{" },
    { out: '  "role": "DevOps & Cloud Engineer",' },
    { out: '  "university": "Telkom Univ. Surabaya",' },
    { out: '  "gpa": 3.58,' },
    { out: '  "cloud": ["AWS", "GCP", "Azure"],' },
    { out: '  "devops": ["Docker","CI/CD","Cloudflare"],' },
    { out: '  "network": ["MikroTik","Cisco","MTCNA"]' },
    { out: "}" },
  ],
} as const;

export const experience = {
  heading: "Work Experience",
  roles: [
    {
      role: "DevOps Engineer",
      badge: "Internship",
      company: "PT Raja Teknologi Digital",
      date: "Sep 2025 - Feb 2026",
      bullets: [
        "Orchestrated the migration of production applications to AWS Lightsail, ensuring optimized infrastructure and a seamless transition with zero downtime.",
        "Designed and maintained GitHub Actions workflows for automated deployment across multiple repositories (Backend, Frontend, and Worker services), enhancing security by restricting direct server root access.",
        "Containerized fullstack applications using Docker, implementing dedicated virtual networks for database services to ensure isolation and system reliability.",
        "Configured Cloudflare R2 for high-performance, zero-egress object storage and managed complex DNS records including CNAME and proxied configurations for production domains.",
        "Implemented and managed dedicated Zoho SMTP servers for application email verification, eliminating bot registrations and improving delivery rates.",
        "Migrated message brokering from RabbitMQ to AWS SQS to reduce operational overhead.",
      ],
      tags: [
        "AWS Lightsail",
        "GitHub Actions",
        "Docker",
        "AWS SQS",
        "Cloudflare R2",
        "Zoho SMTP",
        "DNS",
        "CI/CD",
      ],
    },
    {
      role: "Network Engineer",
      badge: "Internship",
      company: "PT Globalindo Pandawa Teknologi",
      date: "Aug - Oct 2021",
      bullets: [
        "Installed and managed CCTV and Door Lock systems at PT Telkom Indonesia (South Jakarta).",
        "Installed, monitored and managed network infrastructure at PT Datacenter Indonesia.",
        "Trained in splicing and connecting Fiber Optic cables.",
      ],
      tags: ["Networking", "CCTV", "Fiber Optic", "Infrastructure"],
    },
  ],
} as const;

export const skills = {
  heading: "Technical Stack",
  categories: [
    {
      name: "Cloud Platforms",
      icon: "cloud",
      items: ["AWS", "Google Cloud", "Azure", "AWS Lightsail", "AWS SQS"],
      logos: ["aws.svg", "googlecloud.svg", "azure.svg"],
    },
    {
      name: "DevOps & CI/CD",
      icon: "pipeline",
      items: ["Docker", "GitHub Actions", "CI/CD Pipelines", "Git/GitHub"],
      logos: ["docker.svg", "githubactions.svg", "git.svg"],
    },
    {
      name: "Networking",
      icon: "network",
      items: ["MikroTik", "Cisco Router", "Cisco Packet Tracer", "Winbox", "Fiber Optic"],
      logos: ["mikrotik.svg", "cisco.svg"],
    },
    {
      name: "Operating Systems",
      icon: "terminal",
      items: ["Debian Linux", "Arch Linux", "Ubuntu Server"],
      logos: ["debian.svg", "archlinux.svg", "ubuntu.svg"],
    },
    {
      name: "Virtualization",
      icon: "stack",
      items: ["VirtualBox", "VMware"],
      /* VMware's mark is an extreme-aspect wordmark that letterboxes down to
         an illegible dash at cell size. It still reads in the marquee, where
         the box is larger, and the pill above already names it. */
      logos: ["virtualbox.svg"],
    },
    {
      name: "Soft Skills",
      icon: "people",
      items: ["Communication", "Teamwork", "Curiosity", "Leadership"],
      logos: [],
    },
  ],
} as const;

export const organizations = {
  heading: "Organizational Experience",
  items: [
    {
      role: "Coordinator, Web Dev & Infrastructure",
      org: "HIMATISI, CODE Challenge 2025",
      date: "Jun 2025 - Aug 2025",
      bullets: [
        "Configured and managed server infrastructure for a competition dashboard and CTF platform, achieving 100% uptime.",
        "Implemented a dedicated SMTP server for email verification, eliminating bot registrations and ensuring zero email delivery failures.",
        "Deployed CTF challenges and monitored server health in real-time for a stable and fair competition environment.",
      ],
      evidence: "/certificates/code-challenge-coordinator.jpeg",
    },
    {
      role: "Treasurer of PSDM",
      org: "HIMATISI",
      date: "Feb 2024 - Jul 2025",
      bullets: [
        "Arranged and reminded PSDM staff on cash payments.",
        "Discussed and conveyed campus financial policies with BPH HIMATISI staff.",
      ],
      evidence: null,
    },
    {
      role: "Chief Executive, Junior Staff Recruitment",
      org: "HIMATISI",
      date: "Apr 2024",
      bullets: [
        "Developed and designed the recruitment mechanism for selecting and onboarding junior staff.",
        "Selected and assigned junior staff to appropriate departments based on their skills and talents.",
      ],
      evidence: null,
    },
    {
      role: "Chief Executive, Makrab 2024",
      org: "HIMATISI",
      date: "Aug 2024 - Sep 2024",
      bullets: [
        "Designed, planned, and set objectives for the 2024 welcoming event to foster stronger connections among new students.",
        "Developed event planning and rundown to ensure successful execution.",
      ],
      /* Was an orphan file on disk, never linked by the legacy site. */
      evidence: "/certificates/makrab-chief-executive.jpeg",
    },
  ],
} as const;

export const certifications = {
  heading: "Certifications & Awards",
  items: [
    {
      title: "MTCNA",
      issuer: "MikroTik Certified Network Associate",
      date: "Nov 2020 - May 2024",
      image: "/certificates/mtcna.webp",
      href: "/certificates/mtcna.pdf",
    },
    {
      title: "BNSP Network Technician",
      issuer: "Badan Nasional Sertifikasi Profesi",
      date: "May 2022 - May 2025",
      image: "/certificates/bnsp-network-technician.jpeg",
      href: "/certificates/bnsp-network-technician.jpeg",
    },
    {
      title: "1st Place, CTF Competition",
      issuer: "Capture The Flag, HIMATISI",
      date: "2024",
      image: "/certificates/ctf-first-place.jpeg",
      href: "/certificates/ctf-first-place.jpeg",
    },
    {
      title: "Laboratory Assistant, Computer Networks Labs",
      issuer: "Telkom University Surabaya",
      date: "2025",
      image: "/certificates/lab-assistant-networks.webp",
      href: "/certificates/lab-assistant-networks.pdf",
    },
    {
      title: "Practicum Assistant, Computer Networks",
      issuer: "Telkom University Surabaya",
      date: "2025",
      image: "/certificates/practicum-assistant-networks.webp",
      href: "/certificates/practicum-assistant-networks.pdf",
    },
    {
      title: "Practicum Assistant, Operating Systems",
      issuer: "Telkom University Surabaya",
      date: "2025",
      image: "/certificates/practicum-assistant-os.webp",
      href: "/certificates/practicum-assistant-os.pdf",
    },
    {
      title: "Coordinator, Web Dev & Infrastructure",
      issuer: "CODE Challenge 2025, HIMATISI",
      date: "2025",
      image: "/certificates/code-challenge-coordinator.jpeg",
      href: "/certificates/code-challenge-coordinator.jpeg",
    },
    {
      title: "EPrT, Score 513",
      issuer: "English Proficiency Test, Telkom University Language Center",
      date: "May 2026 - May 2028",
      image: "/certificates/eprt.webp",
      href: "/certificates/eprt.pdf",
    },
    {
      /* No certificate file exists for this one. Rendered as a typographic
         card rather than with a fabricated image. */
      title: "TOEIC",
      issuer: "Test of English for International Communication",
      date: "Feb 2022",
      image: null,
      href: null,
    },
  ],
} as const;

export const education = {
  heading: "Education",
  items: [
    {
      years: "2022",
      school: "Telkom University Surabaya",
      degree: "Bachelor of Information Technology",
      note: "Final GPA: 3.58 / 4.00",
      date: "Aug 2022 - Aug 2026",
    },
    {
      years: "2019",
      school: "SMK Madinatulquran Bogor",
      degree: "Computer & Network Engineering (TKJ)",
      note: null,
      date: "Jul 2019 - Jun 2022",
    },
  ],
} as const;

export const contact = {
  heading: "Get In Touch",
  sub: "I'm actively looking for opportunities. Whether you have a question or just want to say hi, my inbox is always open.",
  channels: [
    /* rot13 as on the legacy site, but the anchor is rendered with a real
       href from the start so it works, and is focusable, without JS. */
    { kind: "email", label: "Email", value: "jbex@ensvqnmune.qri", scheme: "znvygb" },
    { kind: "phone", label: "Phone", value: "+6281238145369", scheme: "gry", display: "+62 812-3814-5369" },
    { kind: "linkedin", label: "LinkedIn", value: "rafidazhar79", href: "https://www.linkedin.com/in/rafidazhar79" },
  ],
} as const;

export const footer = {
  wordmark: { open: "<", name: "rafidazhar", dot: ".", tld: "dev", close: "/>" },
  copy: "© 2026 Rafid Azhar Adi Saputra",
  place: "Ponorogo, East Java, Indonesia",
} as const;
