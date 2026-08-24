// Dropdown navbar button

function dropdown(trigger) {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const barIcon = document.getElementById("bar-icon");
  const xIcon = document.getElementById("x-icon");

  if (dropdownMenu.classList.contains("active")) {
    dropdownMenu.classList.remove("active");

    barIcon.classList.remove("d-none");
    barIcon.classList.add("d-block");

    xIcon.classList.remove("d-block");
    xIcon.classList.add("d-none");

    if (trigger) trigger.setAttribute("aria-expanded", "false");
  } else {
    dropdownMenu.classList.add("active");

    barIcon.classList.remove("d-block");
    barIcon.classList.add("d-none");

    xIcon.classList.remove("d-none");
    xIcon.classList.add("d-block");

    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }
}

// Scroll-triggered animations
document.addEventListener("DOMContentLoaded", function () {
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  if (scrollElements.length === 0) return;

  if ("IntersectionObserver" in window) {
    // Reveals each element once, then stops observing it — avoids
    // recalculating layout for every element on every scroll event.
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 }
    );

    scrollElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver support
    const elementInView = (el, percentageScroll = 100) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) *
          (percentageScroll / 100)
      );
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 85)) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation();
  }
});

// YouTube click-to-load facade — avoids loading the embed until the user asks for it
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".yt-facade").forEach(function (facade) {
    facade.addEventListener("click", function () {
      const videoId = facade.getAttribute("data-yt-id");
      const title = facade.getAttribute("data-yt-title") || "YouTube video";
      const iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube.com/embed/" +
        videoId +
        "?autoplay=1&vq=hd1080";
      iframe.title = title;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;border:0;";
      facade.replaceWith(iframe);
    });
  });
});

// --- Simple i18n loader and applier ---
(function () {
  const STORAGE_KEY = "site_lang";

  function basePrefix() {
    // If page is inside /pages/ use ../ else use ./
    return location.pathname.includes("/pages/") ? "../" : "";
  }

  async function loadTranslations() {
    const path = basePrefix() + "i18n/translations.json";
    try {
      const res = await fetch(path);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function applyTranslations(translations, lang) {
    if (!translations || !translations[lang]) return;
    const nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = translations[lang][key];
      if (value !== undefined) el.innerHTML = value;
    });
    document.documentElement.lang = lang;
  }

  function setActiveLangUI(lang) {
    const buttons = document.querySelectorAll(".lang-toggle");
    buttons.forEach((btn) => {
      const btnLang =
        btn.getAttribute("data-lang") ||
        (btn.id === "lang-en" ? "en" : btn.id === "lang-es" ? "es" : null);
      if (!btnLang) return;
      btn.classList.toggle("active-lang", btnLang === lang);
    });
  }

  function changeLanguage(translations, lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(translations, lang);
    setActiveLangUI(lang);
  }

  // (Removed complex banner animator - using a simple static banner below)

  document.addEventListener("DOMContentLoaded", async () => {
    const translations = await loadTranslations();
    if (!translations) return;
    const saved = localStorage.getItem(STORAGE_KEY) || "en";
    applyTranslations(translations, saved);
    setActiveLangUI(saved);

    // Apply translations to common selectors when data-i18n attributes aren't present
    function applySelectorTranslations(lang) {
      const t = translations[lang] || {};
      // nav links: try multiple href patterns
      const navMap = [
        { sel: 'a[href$="index.html"]', key: "nav.home" },
        { sel: 'a[href="#"]', key: "nav.home" },
        { sel: 'a[href$="experience.html"]', key: "nav.experience" },
        { sel: 'a[href$="works.html"]', key: "nav.projects" },
        { sel: 'a[href$="contact.html"]', key: "nav.contact" },
        { sel: 'a[href$="../index.html"]', key: "nav.home" },
      ];

      navMap.forEach((m) => {
        const els = document.querySelectorAll(m.sel);
        els.forEach((el) => {
          // Evitar reemplazar el contenido del logo SS
          if (
            el &&
            !el.hasAttribute("data-i18n") &&
            t[m.key] &&
            !(
              el.classList.contains("logo") ||
              el.classList.contains("contact-logo")
            ) &&
            // Evitar sobrescribir el botón flecha del footer
            !(
              el.classList.contains("contact-button") ||
              el.querySelector(".fa-arrow-right")
            )
          ) {
            // Detectar si es la opción activa
            if (el.classList.contains("active-link")) {
              // Determinar la clave correcta según la página
              let correctKey = m.key;
              if (location.pathname.includes("works"))
                correctKey = "nav.projects";
              else if (location.pathname.includes("case-studies"))
                correctKey = "nav.caseStudies";
              else if (location.pathname.includes("experience"))
                correctKey = "nav.experience";
              else if (location.pathname.includes("contact"))
                correctKey = "nav.contact";
              else if (
                location.pathname.endsWith("index.html") ||
                location.pathname === "/" ||
                location.pathname.endsWith("/")
              )
                correctKey = "nav.home";
              el.innerHTML =
                t[correctKey] +
                (el.querySelector(".active-dot")
                  ? ' <span class="active-dot aqua">•</span>'
                  : "");
            } else {
              el.innerHTML =
                t[m.key] +
                (m.key === "nav.home" && el.querySelector(".active-dot")
                  ? ' <span class="active-dot aqua">•</span>'
                  : "");
            }
          }
        });
      });

      // Hero and presentation
      const hero = document.querySelector(".magilio-heading");
      if (hero && t["hero.h1"] && !hero.hasAttribute("data-i18n"))
        hero.innerHTML = t["hero.h1"];
      const pres = document.querySelector(".presentation-description");
      if (pres && t["hero.title"] && !pres.hasAttribute("data-i18n"))
        pres.innerHTML = t["hero.title"];

      // Banner content is provided by the HTML (data-i18n) and handled by the
      // original scrolling animation below; do not override here.

      // Contact page specific: prefer explicit data-i18n targets
      const contactNameEl =
        document.querySelector('[data-i18n="contact.headingName"]') ||
        document.querySelector(".heading-contact");
      const contactRoleEl =
        document.querySelector('[data-i18n="contact.headingRole"]') ||
        document.querySelector(".heading-contact-role");
      if (contactNameEl && t["contact.headingName"])
        contactNameEl.innerHTML = t["contact.headingName"];
      if (contactRoleEl && t["contact.headingRole"])
        contactRoleEl.innerHTML = t["contact.headingRole"];
      const letsTalk = document.querySelectorAll(".magilio-contact");
      if (letsTalk && t["contact.letsTalk"])
        letsTalk.forEach((e) => (e.innerHTML = t["contact.letsTalk"]));
      const cv = document.getElementById("cv-download-link");
      if (cv && t["contact.cv"])
        cv.innerHTML = "<b>" + t["contact.cv"] + "</b>";
      // Cambiar href del CV según idioma
      if (cv) {
        if (lang === "es") {
          cv.href =
            basePrefix() +
            "pdf/Sebastian_Sanjorge_Fullstack_Engineer_CV_ES.pdf";
        } else {
          cv.href =
            basePrefix() +
            "pdf/Sebastian_Sanjorge_Fullstack_Engineer_CV_EN.pdf";
        }
      }
    }

    // inject simple language toggle into header if not present
    function injectToggleUI() {
      // desktop header
      const desktopHeader =
        document.querySelector(".col-10.d-none.d-md-flex") ||
        document.querySelector("header .row");
      // Only inject if no language toggle exists on the page to avoid duplicates
      if (desktopHeader && !document.querySelector(".lang-toggle")) {
        const wrap = document.createElement("div");
        wrap.className =
          "col-2 d-none d-lg-flex justify-content-end align-items-center";
        wrap.innerHTML =
          '<button id="lang-en" class="lang-toggle border-0 bg-transparent fs-5 me-2" title="English">🇬🇧</button><button id="lang-es" class="lang-toggle border-0 bg-transparent fs-5" title="Español">🇪🇸</button>';
        desktopHeader.insertBefore(wrap, desktopHeader.children[1] || null);
      }

      // mobile dropdown: try to add at end of dropdown menu
      const dd = document.getElementById("dropdown-menu");
      if (dd && !document.querySelector(".lang-toggle")) {
        const node = document.createElement("div");
        node.className = "pe-2 mt-2 d-flex justify-content-end";
        node.innerHTML =
          '<button id="lang-en" class="lang-toggle border-0 bg-transparent fs-5 me-2" title="English">🇬🇧</button><button id="lang-es" class="lang-toggle border-0 bg-transparent fs-5" title="Español">🇪🇸</button>';
        dd.appendChild(node);
      }
    }

    applySelectorTranslations(saved);
    injectToggleUI();
    buildMarquee("text-banner");
    buildMarquee("text-banner-2");

    // Hook UI buttons (attach to all .lang-toggle elements)
    const langButtons = document.querySelectorAll(".lang-toggle");
    let currentLang = localStorage.getItem(STORAGE_KEY) || "en";
    function updateFlags() {
      langButtons.forEach((btn) => {
        const btnLang =
          btn.getAttribute("data-lang") ||
          (btn.id === "lang-en" ? "en" : btn.id === "lang-es" ? "es" : null);
        if (!btnLang) return;
        btn.style.display = btnLang === currentLang ? "none" : "inline-block";
      });
    }
    updateFlags();
    langButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lang = btn.id.split("-")[1];
        localStorage.setItem(STORAGE_KEY, lang);

        // FIX: sincroniza CSS inmediato
        document.documentElement.setAttribute("data-lang", lang);

        applyTranslations(translations, lang);
        applySelectorTranslations(lang);
        buildMarquee("text-banner");
        buildMarquee("text-banner-2");
        currentLang = lang;
        updateFlags();
      });
    });
  });
})();

// --- Marquee banner ---
function buildMarquee(trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  // Get the template unit — can be loose (first run) or inside a set (language change)
  const template = track.querySelector(".marquee-unit");
  if (!template) return;

  // 1. Remove all previous sets and loose units, reset animation
  track.querySelectorAll(".marquee-set").forEach((el) => el.remove());
  track.querySelectorAll(".marquee-unit").forEach((el) => el.remove());
  track.style.animation = "none";
  track.style.transform = "";
  void track.offsetWidth;

  // 2. Measure unit width with a clean single insert
  track.appendChild(template);
  void track.offsetWidth;
  const unitWidth = template.getBoundingClientRect().width;
  track.removeChild(template);
  if (unitWidth <= 0) return;

  // 3. Build two identical sets — setB is the seamless "second copy"
  const unitsNeeded = Math.ceil(window.innerWidth / unitWidth) + 2;

  function buildSet() {
    const set = document.createElement("div");
    set.className = "marquee-set";
    for (let i = 0; i < unitsNeeded; i++) {
      const unit = template.cloneNode(true);
      if (i > 0) unit.setAttribute("aria-hidden", "true");
      set.appendChild(unit);
    }
    return set;
  }

  const setA = buildSet();
  const setB = buildSet();
  setB.setAttribute("aria-hidden", "true");
  track.appendChild(setA);
  track.appendChild(setB);

  // 4. Measure EXACT pixel width of one set after layout
  void track.offsetWidth;
  const setWidth = setA.getBoundingClientRect().width;

  // Pixel offset — no subpixel ambiguity, seamless reset guaranteed
  track.style.setProperty("--marquee-offset", `-${Math.round(setWidth)}px`);

  const duration = setWidth / 40;
  track.style.animation = `marquee-slide ${duration.toFixed(3)}s linear infinite`;
}
