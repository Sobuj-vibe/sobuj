import logo from "@/assets/logo.png.asset.json";
import portrait from "@/assets/portrait-v2.png.asset.json";
import signature from "@/assets/signature.png.asset.json";

export const site = {
  name: "Sobuj Hossen",
  shortName: "Sobuj",
  tagline: "Real-life problem solver.",
  roles: [
    "AI Engineer",
    "Computer Vision Researcher",
    "Full-Stack Software Engineer",
  ],
  location: "Xili, Nanshan, Shenzhen, China",
  phone: "+8615817484815",
  phoneDisplay: "+86 158 1748 4815",
  email: "sobujhossen@qq.com",
  website: "https://sobuj.top",
  github: "https://github.com/helloSobuj",
  whatsapp: "https://wa.me/8615817484815",
  images: {
    logo: logo.url,
    portrait: portrait.url,
    signature: signature.url,
  },
} as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const quickStats = [
  { value: "6+", label: "Years building" },
  { value: "40+", label: "Projects shipped" },
  { value: "12", label: "Countries served" },
  { value: "3", label: "Disciplines merged" },
];

export const services = [
  {
    index: "01",
    title: "AI & Computer Vision",
    body: "Detection, tracking, OCR and classification pipelines taken from notebook to edge deployment — with drift monitoring, not just accuracy claims.",
    items: ["Model training", "Edge inference", "Data pipelines", "Evaluation"],
  },
  {
    index: "02",
    title: "Full-Stack Product",
    body: "Typed React front ends on top of real databases and APIs. Auth, roles, payments, dashboards — production concerns handled from day one.",
    items: ["React / TypeScript", "Postgres", "APIs & auth", "Dashboards"],
  },
  {
    index: "03",
    title: "Company Websites",
    body: "Corporate and e-commerce sites for logistics, industrial, medical and retail clients across Asia and the Gulf — built to convert, not just to look good.",
    items: ["Brand systems", "SEO", "CMS", "E-commerce"],
  },
  {
    index: "04",
    title: "Motion & Interface Craft",
    body: "Interfaces that explain themselves through motion. GSAP timelines and spring micro-interactions applied where they carry meaning.",
    items: ["GSAP", "Motion design", "Design systems", "Accessibility"],
  },
];