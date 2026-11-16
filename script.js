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

    // Collapse the Projects submenu and drop the height set while it was open
    dropdownMenu.style.height = "";
    dropdownMenu.querySelectorAll(".nav-sub.open").forEach(function (sub) {
      sub.classList.remove("open");
      const t = document.querySelector('[aria-controls="' + sub.id + '"]');
      if (t) t.setAttribute("aria-expanded", "false");
    });
  } else {
    dropdownMenu.classList.add("active");

    barIcon.classList.remove("d-block");
    barIcon.classList.add("d-none");

    xIcon.classList.remove("d-none");
    xIcon.classList.add("d-block");

    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }
}

// Projects dropdown: floating panel on desktop, collapsible list in the mobile menu
document.addEventListener("DOMContentLoaded", function () {
  // Desktop
  document.querySelectorAll(".nav-dd").forEach(function (dd) {
    const trigger = dd.querySelector(".nav-dd-trigger");
    if (!trigger) return;

    const setOpen = function (open) {
      dd.classList.toggle("open", open);
      trigger.setAttribute("aria-expanded", String(open));
    };

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!dd.classList.contains("open"));
    });

    dd.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dd.classList.contains("open")) {
        setOpen(false);
        trigger.focus();
      }
    });

    // Keyboard users tabbing out of the panel close it (relatedTarget is null on
    // some mouse clicks, so only act when focus really lands elsewhere)
    dd.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!dd.contains(e.target)) setOpen(false);
    });
  });

  // Mobile: the submenu lives inside the hamburger menu, whose height is fixed in CSS
  const mobileMenu = document.getElementById("dropdown-menu");
  document
    .querySelectorAll('.nav-dd-trigger[aria-controls$="-m"]')
    .forEach(function (trigger) {
      const sub = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!sub || !mobileMenu) return;
      trigger.addEventListener("click", function () {
        const open = !sub.classList.contains("open");
        sub.classList.toggle("open", open);
        trigger.setAttribute("aria-expanded", String(open));
        mobileMenu.style.height = open ? mobileMenu.scrollHeight + "px" : "";
      });
    });
});

// AI Engineering page: "View trace" opens the Langfuse screenshot in a native <dialog>
// (Esc closes it, focus is trapped while open and returns to the button afterwards).
// The image can be zoomed: buttons, + / - / 0 keys, click, Ctrl+wheel or trackpad pinch,
// and dragged with the mouse once zoomed in.
document.addEventListener("DOMContentLoaded", function () {
  const dialog = document.getElementById("trace-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const img = document.getElementById("trace-dialog-img");

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;
  const STEPS = [1, 1.5, 2, 3, 4];
  const levelLabel = dialog.querySelector(".ai-trace-zoom__level");
  const btnIn = dialog.querySelector('[data-zoom="in"]');
  const btnOut = dialog.querySelector('[data-zoom="out"]');
  let zoom = 1;

  function updateUi() {
    levelLabel.textContent = Math.round(zoom * 100) + "%";
    btnIn.disabled = zoom >= MAX_ZOOM - 0.001;
    btnOut.disabled = zoom <= MIN_ZOOM + 0.001;
  }

  // Zoom keeping the point under (clientX, clientY) in place; defaults to the visible center
  function applyZoom(next, clientX, clientY) {
    next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    if (Math.abs(next - zoom) < 0.001) return;
    const view = dialog.getBoundingClientRect();
    const rect = img.getBoundingClientRect();
    const px = clientX != null ? clientX : view.left + view.width / 2;
    const py = clientY != null ? clientY : view.top + view.height / 2;
    const x = px - rect.left;
    const y = py - rect.top;
    const factor = next / zoom;
    zoom = next;
    img.style.width = zoom === 1 ? "" : zoom * 100 + "%";
    img.classList.toggle("is-zoomed", zoom > 1);
    dialog.scrollLeft += x * (factor - 1);
    dialog.scrollTop += y * (factor - 1);
    updateUi();
  }

  function step(direction, clientX, clientY) {
    const next =
      direction > 0
        ? STEPS.find(function (v) { return v > zoom + 0.001; })
        : STEPS.slice().reverse().find(function (v) { return v < zoom - 0.001; });
    if (next) applyZoom(next, clientX, clientY);
  }

  function resetZoom() {
    zoom = 1;
    img.style.width = "";
    img.classList.remove("is-zoomed");
    dialog.scrollLeft = 0;
    dialog.scrollTop = 0;
    updateUi();
  }

  document.querySelectorAll("[data-trace-src]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      img.src = btn.getAttribute("data-trace-src");
      img.alt = btn.getAttribute("data-trace-alt") || "";
      resetZoom();
      dialog.showModal();
    });
  });

  dialog.querySelectorAll("[data-trace-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      dialog.close();
    });
  });

  // A click on the backdrop lands on the <dialog> element itself
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  btnIn.addEventListener("click", function () { step(1); });
  btnOut.addEventListener("click", function () { step(-1); });
  dialog.querySelector('[data-zoom="reset"]').addEventListener("click", resetZoom);

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "+" || e.key === "=") step(1);
    else if (e.key === "-" || e.key === "_") step(-1);
    else if (e.key === "0") resetZoom();
  });

  // Ctrl+wheel and trackpad pinch (browsers send them as ctrl+wheel)
  dialog.addEventListener(
    "wheel",
    function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      applyZoom(zoom * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY);
    },
    { passive: false },
  );

  // Click toggles between fit and 2x; dragging (mouse) pans when zoomed in
  let drag = null;
  let moved = false;
  img.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, left: dialog.scrollLeft, top: dialog.scrollTop };
    moved = false;
    img.setPointerCapture(e.pointerId);
  });
  img.addEventListener("pointermove", function (e) {
    if (!drag || zoom === 1) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      moved = true;
      img.classList.add("is-dragging");
    }
    dialog.scrollLeft = drag.left - dx;
    dialog.scrollTop = drag.top - dy;
  });
  function endDrag() {
    drag = null;
    img.classList.remove("is-dragging");
  }
  img.addEventListener("pointerup", endDrag);
  img.addEventListener("pointercancel", endDrag);
  img.addEventListener("click", function (e) {
    if (moved) {
      moved = false;
      return;
    }
    if (zoom === 1) applyZoom(2, e.clientX, e.clientY);
    else resetZoom();
  });

  updateUi();
});

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

// --- YouTube player with its own control bar, used for every video of the site.
// YouTube chooses the resolution from the size of its player, so the iframe is rendered larger
// and scaled back down (see --yt-z in the CSS), which a native control bar would shrink too.
// The presentation (data-yt-crop) also crops a landscape video into a vertical frame. ---
let ytApiPromise;
function loadYtApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (!ytApiPromise) {
    ytApiPromise = new Promise(function (resolve) {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (previous) previous();
        resolve();
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return ytApiPromise;
}

function mountYtPlayer(facade, muted) {
  // Presentation: one video per language. Any other video: a single id.
  const single = facade.getAttribute("data-yt-id");
  const ids = {
    en: facade.getAttribute("data-yt-id-en") || single,
    es: facade.getAttribute("data-yt-id-es") || single,
  };
  const vertical = facade.hasAttribute("data-yt-crop");
  const currentLang = function () {
    return document.documentElement.getAttribute("data-lang") === "es" ? "es" : "en";
  };
  const wrap = document.createElement("div");
  wrap.className = "yt-crop-player" + (vertical ? " yt-crop-vertical" : "");
  wrap.setAttribute("role", "group");
  wrap.setAttribute("aria-label", facade.getAttribute("data-yt-title") || "YouTube video");
  // Diagnostics: open the site with ?ytdebug to get YouTube's native player (right click -> Stats for nerds)
  const debug = /[?&]ytdebug/.test(location.search);
  if (debug) wrap.classList.add("yt-debug");
  wrap.dataset.ytIdEn = ids.en;
  wrap.dataset.ytIdEs = ids.es;
  const slot = document.createElement("div");
  const hit = document.createElement("button");
  hit.type = "button";
  hit.className = "yt-crop-hit";
  hit.setAttribute("aria-label", "Play / pause");
  const bar = document.createElement("div");
  bar.className = "yt-crop-bar";
  bar.innerHTML =
    '<button type="button" class="yt-crop-btn" data-act="play" aria-label="Play / pause"><i class="fa-solid fa-pause"></i></button>' +
    '<div class="yt-crop-progress"><div class="yt-crop-progress-fill"></div></div>' +
    '<button type="button" class="yt-crop-btn" data-act="mute" aria-label="Mute / unmute"><i class="fa-solid fa-volume-high"></i></button>' +
    '<button type="button" class="yt-crop-btn" data-act="fs" aria-label="Fullscreen"><i class="fa-solid fa-expand"></i></button>';
  wrap.append(slot, hit, bar);
  facade.replaceWith(wrap);

  const playIcon = bar.querySelector("[data-act=play] i");
  const muteIcon = bar.querySelector("[data-act=mute] i");
  const fsBtn = bar.querySelector("[data-act=fs]");
  const fsIcon = fsBtn.querySelector("i");
  const progress = bar.querySelector(".yt-crop-progress");
  const fill = bar.querySelector(".yt-crop-progress-fill");
  let player = null;
  let loadedId = ids[currentLang()];
  // The player applies mute()/unMute() asynchronously, so isMuted() right after the call still
  // returns the old value: the button keeps its own state instead of asking the player.
  let mutedUI = !!muted;

  function sync() {
    if (!player || !player.getPlayerState) return;
    const playing = player.getPlayerState() === 1;
    playIcon.className = "fa-solid " + (playing ? "fa-pause" : "fa-play");
    muteIcon.className = "fa-solid " + (mutedUI ? "fa-volume-xmark" : "fa-volume-high");
  }
  // No automatic captions (YouTube may turn them on by itself)
  function hideCaptions(target) {
    try {
      target.unloadModule("captions");
      target.unloadModule("cc");
    } catch (err) {
      /* the module is not loaded: nothing to hide */
    }
  }
  function onState(e) {
    if (e.data === 1) hideCaptions(e.target);
    sync();
  }
  function toggle() {
    if (!player) return;
    if (player.getPlayerState() === 1) player.pauseVideo();
    else player.playVideo();
  }

  hit.addEventListener("click", toggle);
  bar.querySelector("[data-act=play]").addEventListener("click", toggle);
  bar.querySelector("[data-act=mute]").addEventListener("click", function () {
    if (!player) return;
    mutedUI = !mutedUI;
    if (mutedUI) player.mute();
    else player.unMute();
    sync();
  });
  // Fullscreen shows the whole video (no vertical crop). iPhone Safari can only fullscreen
  // <video> elements, so the button is hidden where the browser cannot do it.
  const requestFs = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
  const exitFs = document.exitFullscreen || document.webkitExitFullscreen;
  const fsElement = function () {
    return document.fullscreenElement || document.webkitFullscreenElement;
  };
  if (!requestFs || !exitFs) fsBtn.hidden = true;
  fsBtn.addEventListener("click", function () {
    if (fsElement() === wrap) exitFs.call(document);
    else requestFs.call(wrap);
  });
  const onFsChange = function () {
    if (!wrap.isConnected) {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      return;
    }
    fsIcon.className = "fa-solid " + (fsElement() === wrap ? "fa-compress" : "fa-expand");
  };
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);

  progress.addEventListener("click", function (e) {
    if (!player || !player.getDuration) return;
    const rect = progress.getBoundingClientRect();
    player.seekTo(((e.clientX - rect.left) / rect.width) * player.getDuration(), true);
  });

  const timer = setInterval(function () {
    if (!wrap.isConnected) return clearInterval(timer);
    if (!player || !player.getDuration) return;
    const d = player.getDuration();
    fill.style.width = (d ? (player.getCurrentTime() / d) * 100 : 0) + "%";
  }, 300);

  // Language switch: same player, other video
  wrap.switchVideo = function (id) {
    if (!player || !id || id === loadedId) return;
    loadedId = id;
    player.loadVideoById(id);
  };

  loadYtApi().then(function () {
    player = new YT.Player(slot, {
      host: "https://www.youtube-nocookie.com",
      width: "100%",
      height: "100%",
      videoId: loadedId,
      playerVars: {
        autoplay: 1,
        controls: debug ? 1 : 0,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        cc_load_policy: 0,
        mute: muted ? 1 : 0,
      },
      events: {
        onReady: function (e) {
          if (muted) e.target.mute();
          hideCaptions(e.target);
          e.target.playVideo();
          sync();
        },
        onStateChange: onState,
      },
    });
  });
}

// YouTube click-to-load facade — avoids loading the embed until the user asks for it
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".yt-facade").forEach(function (facade) {
    // muted: browsers only allow autoplay without a user gesture if it starts muted
    function activate(muted) {
      if (!facade.isConnected) return;
      const videoSrc = facade.getAttribute("data-video-src");
      if (videoSrc) {
        const video = document.createElement("video");
        video.muted = muted;
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.title = facade.getAttribute("data-yt-title") || "Video";
        // Keep the per-language sources so a language switch can swap them
        [
          ["srcEn", "data-video-src-en"],
          ["srcEs", "data-video-src-es"],
          ["posEn", "data-video-pos-en"],
          ["posEs", "data-video-pos-es"],
        ].forEach(function (pair) {
          if (facade.hasAttribute(pair[1]))
            video.dataset[pair[0]] = facade.getAttribute(pair[1]);
        });
        video.className = "local-video";
        const pos = facade.getAttribute("data-video-pos");
        if (pos) video.style.setProperty("--video-pos", pos);
        video.style.cssText +=
          "position:absolute;top:0;left:0;width:100%;height:100%;border:0;background:#000;";
        facade.replaceWith(video);
        return;
      }
      mountYtPlayer(facade, muted);
    }

    facade.addEventListener("click", function () {
      activate(false);
    });

    // Start once when scrolled into view, after the language video has been chosen
    // Phones and tablets: no autoplay (the video downloads only when the user taps play)
    const smallScreen = window.matchMedia("(max-width: 991px)").matches;
    if (facade.hasAttribute("data-autoplay-on-scroll") && !smallScreen && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          if (!entries.some((e) => e.isIntersecting)) return;
          observer.disconnect();
          const start = function () {
            activate(true);
          };
          if (window.__langVideosReady) start();
          else {
            const t = setTimeout(start, 3000);
            document.addEventListener(
              "langvideos:ready",
              function () {
                clearTimeout(t);
                start();
              },
              { once: true },
            );
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(facade);
    }
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
    applyLangVideos(lang);
  }

  // Swap language-specific local videos (facades and already-playing players)
  function applyLangVideos(lang) {
    const key = lang === "es" ? "es" : "en";
    const prefix = basePrefix();
    document.querySelectorAll(".yt-facade[data-video-src-" + key + "]").forEach((f) => {
      f.setAttribute("data-video-src", prefix + f.getAttribute("data-video-src-" + key));
      const img = f.querySelector("img");
      const poster = f.getAttribute("data-poster-" + key);
      if (img && poster) img.src = prefix + poster;
      const pos = f.getAttribute("data-video-pos-" + key);
      if (pos) f.setAttribute("data-video-pos", pos);
      else f.removeAttribute("data-video-pos");
    });
    document.querySelectorAll("video.local-video").forEach((v) => {
      const pos = v.dataset["pos" + (key === "es" ? "Es" : "En")];
      if (pos) v.style.setProperty("--video-pos", pos);
      else v.style.removeProperty("--video-pos");
    });
    // YouTube versions: pick the id (and poster) of the active language
    document.querySelectorAll(".yt-facade[data-yt-id-" + key + "]").forEach((f) => {
      f.setAttribute("data-yt-id", f.getAttribute("data-yt-id-" + key));
      const img = f.querySelector("img");
      const poster = f.getAttribute("data-poster-" + key);
      if (img && poster) img.src = prefix + poster;
    });
    const ytKey = key === "es" ? "ytIdEs" : "ytIdEn";
    document.querySelectorAll(".yt-crop-player").forEach((el) => {
      if (el.switchVideo) el.switchVideo(el.dataset[ytKey]);
    });
    const dsKey = key === "es" ? "srcEs" : "srcEn";
    document.querySelectorAll("video[data-src-en], video[data-src-es]").forEach((v) => {
      const next = prefix + v.dataset[dsKey];
      if (v.dataset[dsKey] && !v.src.endsWith(next.replace(/^\.\.\//, ""))) {
        // Same element, new source: the old language stops, never two at once
        v.pause();
        v.src = next;
        v.play().catch(() => {});
      }
    });
    if (!window.__langVideosReady) {
      window.__langVideosReady = true;
      document.dispatchEvent(new Event("langvideos:ready"));
    }
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
