const WINDOWS_INSTALLER_URL =
  import.meta.env.VITE_WINDOWS_INSTALLER_URL || "/downloads/OmniForge-Studio-Setup.exe";
const EXTENSION_ZIP_URL =
  import.meta.env.VITE_EXTENSION_ZIP_URL || "/downloads/omniforge-browser-bridge.zip";

const cursorSpot = document.querySelector(".cursor-spot");
document.documentElement.classList.add("js-ready");

const toast = document.createElement("div");
toast.className = "download-toast";
toast.setAttribute("role", "status");
document.body.appendChild(toast);

let toastTimer = 0;
const showToast = (message) => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4200);
};

window.addEventListener("pointermove", (event) => {
  document.body.classList.add("pointer-active");
  if (cursorSpot) {
    cursorSpot.style.left = `${event.clientX}px`;
    cursorSpot.style.top = `${event.clientY}px`;
  }
});

document.querySelectorAll("[data-download='windows']").forEach((link) => {
  link.setAttribute("href", WINDOWS_INSTALLER_URL);
  link.addEventListener("click", async (event) => {
    if (/^https?:\/\//i.test(WINDOWS_INSTALLER_URL)) {
      return;
    }

    try {
      const response = await fetch(WINDOWS_INSTALLER_URL, { method: "HEAD" });
      if (!response.ok) {
        event.preventDefault();
        showToast("Windows installer is not uploaded yet. Add it to website/public/downloads or set VITE_WINDOWS_INSTALLER_URL.");
      }
    } catch {
      event.preventDefault();
      showToast("Windows installer is not reachable yet. Add it to downloads or set VITE_WINDOWS_INSTALLER_URL.");
    }
  });
});

document.querySelectorAll("[data-download='extension']").forEach((link) => {
  link.setAttribute("href", EXTENSION_ZIP_URL);
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  let frame = 0;

  const reset = () => {
    card.style.transform = "";
    card.style.boxShadow = "";
  };

  card.addEventListener("pointermove", (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -10;
      const rotateY = x * 13;
      const lift = card.classList.contains("app-window") ? 14 : 8;

      card.style.transform = `translateY(-${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.boxShadow = `${x * -28}px ${40 + y * 20}px 90px rgba(0, 0, 0, 0.18)`;
    });
  });

  card.addEventListener("pointerleave", reset);
  card.addEventListener("blur", reset);
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
  if (element.getBoundingClientRect().top < window.innerHeight * 0.95) {
    element.classList.add("visible");
  }
});

const moduleTiles = document.querySelectorAll(".module-tile");
moduleTiles.forEach((tile, index) => {
  tile.style.transitionDelay = `${Math.min(index * 18, 220)}ms`;
});

const quickButtons = document.querySelectorAll(".quick-grid button");
let activeQuickIndex = 0;

setInterval(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || quickButtons.length === 0) {
    return;
  }

  quickButtons.forEach((button) => button.classList.remove("is-live"));
  quickButtons[activeQuickIndex]?.classList.add("is-live");
  activeQuickIndex = (activeQuickIndex + 1) % quickButtons.length;
}, 1300);

const style = document.createElement("style");
style.textContent = `
  .quick-grid button.is-live {
    border-color: #050505;
    transform: translateY(-4px);
    box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
  }
`;
document.head.appendChild(style);
