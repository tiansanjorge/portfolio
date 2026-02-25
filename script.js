// Dropdown navbar button

function dropdown() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const barIcon = document.getElementById("bar-icon");
  const xIcon = document.getElementById("x-icon");

  if (dropdownMenu.classList.contains("active")) {
    dropdownMenu.classList.remove("active");

    barIcon.classList.remove("d-none");
    barIcon.classList.add("d-block");

    xIcon.classList.remove("d-block");
    xIcon.classList.add("d-none");
  } else {
    dropdownMenu.classList.add("active");

    barIcon.classList.remove("d-block");
    barIcon.classList.add("d-none");

    xIcon.classList.remove("d-none");
    xIcon.classList.add("d-block");
  }
}

// Scroll-triggered animations
document.addEventListener("DOMContentLoaded", function () {
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  if (scrollElements.length > 0) {
    const elementInView = (el, percentageScroll = 100) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) *
          (percentageScroll / 100)
      );
    };

    const displayScrollElement = (element) => {
      element.classList.add("visible");
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 85)) {
          displayScrollElement(el);
        }
      });
    };

    window.addEventListener("scroll", () => {
      handleScrollAnimation();
    });

    // Trigger on page load for elements already in view
    handleScrollAnimation();
  }
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
            basePrefix() + "pdf/Sebastian_Sanjorge_Frontend_Engineer_CV_ES.pdf";
        } else {
          cv.href =
            basePrefix() + "pdf/Sebastian_Sanjorge_Frontend_Engineer_CV_EN.pdf";
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

    // banners set above; animation handled by a simple independent routine below

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
        currentLang = lang;
        updateFlags();
      });
    });
  });
})();

// Scrolling animation for text banners
document.addEventListener("DOMContentLoaded", function () {
  // Delay banner setup slightly so i18n replacements finish first
  setTimeout(() => {
    const textBanner = document.getElementById("text-banner");
    if (!textBanner) return;

    const originalHTML = textBanner.innerHTML;
    // Duplicate the content enough times to ensure seamless loop
    const repeatedHTML = originalHTML.repeat(50);
    textBanner.innerHTML = repeatedHTML;

    // Measure the width of a single repetition
    const tempDiv = document.createElement("div");
    tempDiv.style.cssText =
      "position: absolute; visibility: hidden; white-space: nowrap;";
    tempDiv.className = textBanner.className;
    tempDiv.innerHTML = originalHTML;
    document.body.appendChild(tempDiv);
    const singleWidth = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);

    let position = 0;
    const speed = 0.5; // pixels per frame

    function animateScroll() {
      requestAnimationFrame(animateScroll);

      position -= speed;

      // Reset position seamlessly when one full cycle completes
      if (Math.abs(position) >= singleWidth) {
        position = position % singleWidth;
      }

      textBanner.style.transform = `translateX(${position}px)`;
    }

    animateScroll();
  }, 80);
});

document.addEventListener("DOMContentLoaded", function () {
  // Delay banner2 setup slightly so i18n replacements finish first
  setTimeout(() => {
    const textBanner2 = document.getElementById("text-banner-2");
    if (!textBanner2) return;

    const originalHTML2 = textBanner2.innerHTML;
    const repeatedHTML2 = originalHTML2.repeat(50);
    textBanner2.innerHTML = repeatedHTML2;

    const tempDiv2 = document.createElement("div");
    tempDiv2.style.cssText =
      "position: absolute; visibility: hidden; white-space: nowrap;";
    tempDiv2.className = textBanner2.className;
    tempDiv2.innerHTML = originalHTML2;
    document.body.appendChild(tempDiv2);
    const singleWidth2 = tempDiv2.offsetWidth;
    document.body.removeChild(tempDiv2);

    let position2 = 0;
    const speed2 = 0.5;

    function animateScroll2() {
      requestAnimationFrame(animateScroll2);

      position2 -= speed2;

      if (Math.abs(position2) >= singleWidth2) {
        position2 = position2 % singleWidth2;
      }

      textBanner2.style.transform = `translateX(${position2}px)`;
    }

    animateScroll2();
  }, 80);
});
