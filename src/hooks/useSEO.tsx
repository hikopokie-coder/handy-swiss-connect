import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  type?: string;
  image?: string;
}

const defaultConfig: SEOConfig = {
  title: "Ремонт Квартир Цюрих | Handwerker Zürich | TipTop Service 24h",
  description: "★ Ремонт квартир в Цюрихе и Швейцарии. Renovierung, Elektrik, Sanitär, Malerarbeiten. Качественный ремонт под ключ ✓ Доступные цены ✓ 24h Notdienst ✓ ☎ +41 79 813 51 47",
  keywords: "ремонт квартир цюрих, ремонт квартир швейцария, handwerker zürich, renovierung zürich, wohnungsrenovierung, apartment renovation zurich",
  type: "website",
  image: "https://tiptop-service.ch/og-image.jpg"
};

const pageConfigs: Record<string, SEOConfig> = {
  "/": {
    title: "Ремонт Квартир Цюрих | Handwerker Zürich | TipTop Service 24h",
    description: "★ Ремонт квартир в Цюрихе и Швейцарии. Renovierung, Elektrik, Sanitär, Malerarbeiten. Ремонт под ключ ✓ Качественно ✓ 24h Notdienst ✓ ☎ +41 79 813 51 47",
    keywords: "ремонт квартир цюрих, ремонт квартир швейцария, отделка квартир, косметический ремонт, капитальный ремонт, handwerker zürich, renovierung zürich, wohnungsrenovierung, apartment renovation zurich, мастер на час"
  },
  "/services": {
    title: "Услуги Ремонта Квартир | Handwerker-Leistungen Zürich | TipTop",
    description: "Профессиональные услуги ремонта в Цюрихе: Электрика ⚡ Сантехника 🔧 Маляренные работы 🎨 Сборка мебели 🪑 Ремонт под ключ. Доступные цены!",
    keywords: "услуги ремонта цюрих, электрик цюрих, сантехник цюрих, маляренные работы, сборка мебели ikea, elektriker zürich, sanitär zürich, malerarbeiten zürich"
  },
  "/gallery": {
    title: "Портфолио Ремонта Квартир | Referenzen Zürich | TipTop Service",
    description: "Наши выполненные проекты: ремонт ванной, отделка кухни, маляренные работы, электромонтаж. Убедитесь в нашем качестве!",
    keywords: "портфолио ремонта, ремонт ванной цюрих, ремонт кухни, отделка квартир фото, badezimmer renovierung zürich, küche montage"
  },
  "/reviews": {
    title: "Отзывы Клиентов ★★★★★ 4.9/5 | TipTop Service Zürich",
    description: "Более 200 довольных клиентов оценивают нас на 4.9/5 звезд. Читайте реальные отзывы о ремонте квартир в Цюрихе.",
    keywords: "отзывы ремонт квартир, отзывы клиентов цюрих, handwerker bewertungen zürich, kundenmeinungen"
  },
  "/contact": {
    title: "Заказать Ремонт Квартиры | Kontakt Zürich | TipTop Service",
    description: "Бесплатная консультация и расчёт стоимости. Онлайн-заявка на ремонт. Ответ в течение 30 минут. ☎ +41 79 813 51 47",
    keywords: "заказать ремонт квартиры, консультация ремонт цюрих, расчёт стоимости ремонта, handwerker kontakt zürich"
  }
};

export const useSEO = (customConfig?: SEOConfig) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const path = location.pathname;
    const config = { ...defaultConfig, ...pageConfigs[path], ...customConfig };
    const baseUrl = "https://tiptop-service.ch";
    const canonicalUrl = `${baseUrl}${config.canonicalPath || path}`;
    
    // Update document title
    document.title = config.title || defaultConfig.title!;
    
    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    
    // Primary meta tags
    updateMeta("description", config.description!);
    updateMeta("keywords", config.keywords!);
    
    // Open Graph
    updateMeta("og:title", config.title!, true);
    updateMeta("og:description", config.description!, true);
    updateMeta("og:url", canonicalUrl, true);
    updateMeta("og:type", config.type!, true);
    updateMeta("og:image", config.image!, true);
    
    // Twitter
    updateMeta("twitter:title", config.title!);
    updateMeta("twitter:description", config.description!);
    updateMeta("twitter:url", canonicalUrl);
    updateMeta("twitter:image", config.image!);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
    
    // Update hreflang tags
    const languages = ["de", "en", "fr", "it"];
    languages.forEach(lang => {
      const hrefLang = `link[rel="alternate"][hreflang="${lang}"]`;
      let link = document.querySelector(hrefLang);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${canonicalUrl}?lang=${lang}`);
    });
    
    // x-default hreflang
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement("link");
      xDefault.setAttribute("rel", "alternate");
      xDefault.setAttribute("hreflang", "x-default");
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute("href", canonicalUrl);
    
    // Update html lang attribute
    document.documentElement.lang = i18n.language || "de";
    
  }, [location.pathname, customConfig, i18n.language]);
};

export default useSEO;