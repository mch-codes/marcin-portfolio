# Marcin Chrzuszcz — Portfolio

Personal developer portfolio. Built with Next.js 16, TypeScript, and Tailwind CSS. Deployed on Vercel.

**Live:** [marcin-portfolio-mocha.vercel.app](https://marcin-portfolio-mocha.vercel.app)

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Email:** Resend
- **Deployment:** Vercel

## Features

- Bilingual (ES / EN) with a custom context-based language switcher
- Contact form with server actions and email delivery via Resend
- Animated network canvas background
- Responsive design, optimised for mobile and desktop
- SEO: sitemap, robots.txt, Open Graph image

## Projects featured

| Project | What it is | Live | Source |
| --- | --- | --- | --- |
| **Oidoo** | SaaS for professional kitchens — recipes, checklists and allergens | [oidoo.app](https://www.oidoo.app) | private |
| **Hebras** | Client site for a handmade crochet brand in Madrid; the piece catalogue leads and contact runs through Instagram | [demo](https://hebras-lemon.vercel.app) | [repo](https://github.com/mch-codes/hebras) |
| **Fontanería Urgente Lavapiés** | Emergency-plumber landing, built for fast contact | [demo](https://fontaneria-urgente-lavapies.vercel.app) | [repo](https://github.com/mch-codes/fontaneria-urgente-lavapies) |
| **Clínica Fisio Vitalia** | Physiotherapy clinic landing | [demo](https://fisio-vitalia-landing.vercel.app) | [repo](https://github.com/mch-codes/fisio-vitalia-landing) |
| **Taberna El Fogón** | Bilingual landing for a Castilian tavern, mobile-first | [demo](https://taberna-el-fogon-landing.vercel.app) | [repo](https://github.com/mch-codes/taberna-el-fogon-landing) |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Refreshing a project screenshot

```bash
npm run shot -- https://hebras-lemon.vercel.app hebras
```

Writes `public/<name>-screenshot.webp` at 1280x800. Dismisses the cookie banner first, and refuses a URL that doesn't return 200.

The link-preview image is the same script pointed at this site — a name with an extension is used verbatim, and an explicit size overrides the default:

```bash
npm run shot -- https://marcin-portfolio-mocha.vercel.app og.jpg 1200x630
```

### Environment variables

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_SITE_URL=
```
