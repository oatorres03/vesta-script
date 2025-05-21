document.addEventListener("DOMContentLoaded", async () => {
  if (!window.mixpanel) return;

  await initializeMixpanel();
  trackPageView();
  trackMenuClicks();
  trackCTAButtons();
  trackBannerCTA();
  trackTileClicks();
  setupFormTracking();
  trackScrollDepth();
});

/** Initialize Mixpanel with basic config */
async function initializeMixpanel() {
  await mixpanel.init("d3fbc34d0c634a98d5299ee79bbb2971", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  console.log("Mixpanel initialized");
}

/** Track page load */
function trackPageView() {
  mixpanel.track("Page View", {
    path: window.location.pathname,
  });
}

/** Track navigation menu links */
function trackMenuClicks() {
  document.querySelectorAll("#menu .links a").forEach((link) => {
    link.addEventListener("click", () => {
      mixpanel.track("Menu Click", {
        label: link.textContent.trim(),
        href: link.getAttribute("href"),
      });
    });
  });
}

/** Track CTA-style buttons and inputs */
function trackCTAButtons() {
  document.querySelectorAll("a.button, input.button, input[type=submit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mixpanel.track("CTA Click", {
        label: btn.textContent.trim() || btn.value,
      });
    });
  });
}

/** Track the banner CTA specifically */
function trackBannerCTA() {
  const bannerBtn = document.querySelector("#banner .button");
  if (bannerBtn) {
    bannerBtn.addEventListener("click", () => {
      mixpanel.track("Banner CTA", { section: "banner" });
    });
  }
}

/** Track clicks on content tiles */
function trackTileClicks() {
  document.querySelectorAll(".tiles article a.link").forEach((link) => {
    link.addEventListener("click", () => {
      mixpanel.track("Tile Click", {
        title: link.textContent.trim(),
        href: link.getAttribute("href"),
      });
    });
  });
}

/** Track contact form input and submission + session recording */
function setupFormTracking() {
  const form = document.querySelector("form");
  if (!form) return;

  let hasStartedRecording = false;

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (!hasStartedRecording) {
        mixpanel.start_session_recording?.();
        mixpanel.track("Session Recording Started", { context: "Contact Form" });
        mixpanel.track("Start filling out contact form", { context: "Contact Form" });
        hasStartedRecording = true;
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name")?.value || "unknown";
    const email = form.querySelector("#email")?.value || "unknown";
    const message = form.querySelector("#message")?.value || "";

    mixpanel.track("Contact Form Submitted", {
      name,
      email,
      messageLength: message.length,
    });

    if (hasStartedRecording) {
      mixpanel.stop_session_recording?.();
      mixpanel.track("Session Recording Stopped", { context: "Contact Form" });
    }

    alert("Form submission tracked (but not sent).");
  });
}

/** Track when the user scrolls halfway down the page */
function trackScrollDepth() {
  window.addEventListener("scroll", () => {
    const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollDepth > 0.5) {
      mixpanel.track("Scrolled 50% of Page");
    }
  }, { once: true });
}