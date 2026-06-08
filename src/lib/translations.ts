export const translations = {
  es: {
    nav: {
      about: "Sobre mí",
      projects: "Proyectos",
      github: "GitHub",
      contact: "Contacto",
    },
    hero: {
      headline: "Fullstack Developer",
      headline2: "& ex-Chef",
      subtext:
        "Construyo productos reales con herramientas modernas. Desde las cocinas de Madrid al stack de producción.",
      cta_projects: "Ver proyectos",
      cta_contact: "Contacto",
    },
    about: {
      title: "Sobre mí",
      p1: "Cocinero profesional con más de 10 años en cocinas de Madrid, decidí dar el salto al desarrollo web. Sin bootcamp, sin carrera universitaria — aprendí construyendo cosas reales.",
      p2: "Usando IA como herramienta, desarrollé productos SaaS que están en producción y siendo usados. El mismo rigor que apliqué en la cocina lo aplico ahora al código: atención al detalle, consistencia, y un producto que realmente funciona.",
      stack: "Stack tecnológico",
    },
    projects: {
      title: "Proyectos",
      oidoo_tag: "Proyecto principal",
      oidoo_name: "Oidoo",
      oidoo_desc:
        "SaaS de gestión para cocinas profesionales. Control de inventario, escandallos, y comunicación de equipo — todo en una sola plataforma.",
      oidoo_cta: "Ver proyecto",
      wip_name: "Próximamente",
      wip_desc: "Nuevo producto en desarrollo",
      wip_badge: "En desarrollo",
    },
    github: {
      title: "En GitHub",
      subtitle: "Aprendiendo en público. Cada commit cuenta.",
      cta: "Ver perfil",
      stats: "Contribuciones",
    },
    contact: {
      title: "Contacto",
      subtitle: "¿Tienes un proyecto en mente? Hablemos.",
      name_label: "Nombre",
      email_label: "Email",
      message_label: "Mensaje",
      name_placeholder: "Tu nombre",
      email_placeholder: "tu@email.com",
      message_placeholder: "Cuéntame sobre tu proyecto...",
      send: "Enviar mensaje",
      sending: "Enviando...",
      success: "Mensaje enviado. Te escribo pronto.",
      error: "Algo salió mal. Escríbeme directamente.",
      location: "Madrid, España",
      or: "o escríbeme directamente",
    },
    footer: {
      copy: "Diseñado y construido por Marcin.",
      tagline: "De la cocina al código.",
    },
  },
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      github: "GitHub",
      contact: "Contact",
    },
    hero: {
      headline: "Fullstack Developer",
      headline2: "& ex-Chef",
      subtext:
        "Building real products with modern tools. From Madrid's professional kitchens to production stacks.",
      cta_projects: "View projects",
      cta_contact: "Contact",
    },
    about: {
      title: "About me",
      p1: "Professional cook with over 10 years in Madrid's kitchens, I made the leap into web development. No bootcamp, no CS degree — I learned by building real things.",
      p2: "Using AI as a tool, I built SaaS products that are live and being used. The same discipline I applied in the kitchen, I now apply to code: attention to detail, consistency, and a product that actually works.",
      stack: "Tech stack",
    },
    projects: {
      title: "Projects",
      oidoo_tag: "Main project",
      oidoo_name: "Oidoo",
      oidoo_desc:
        "SaaS for professional kitchen management. Inventory control, recipe costing, and team communication — all in one platform.",
      oidoo_cta: "View project",
      wip_name: "Coming soon",
      wip_desc: "New product in development",
      wip_badge: "In development",
    },
    github: {
      title: "On GitHub",
      subtitle: "Learning in public. Every commit counts.",
      cta: "View profile",
      stats: "Contributions",
    },
    contact: {
      title: "Contact",
      subtitle: "Have a project in mind? Let's talk.",
      name_label: "Name",
      email_label: "Email",
      message_label: "Message",
      name_placeholder: "Your name",
      email_placeholder: "your@email.com",
      message_placeholder: "Tell me about your project...",
      send: "Send message",
      sending: "Sending...",
      success: "Message sent. I'll get back to you soon.",
      error: "Something went wrong. Write to me directly.",
      location: "Madrid, Spain",
      or: "or write to me directly",
    },
    footer: {
      copy: "Designed and built by Marcin.",
      tagline: "From the kitchen to the code.",
    },
  },
};

export type Language = "es" | "en";
export type Translations = typeof translations.es;
