const WINDOWS_INSTALLER_URL =
  import.meta.env.VITE_WINDOWS_INSTALLER_URL || "https://github.com/vivek123r/omniforge-website/releases/latest/download/OmniForge-Studio-Setup.exe";
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
        showToast("Installer not available yet — coming soon with the first public release.");
      }
    } catch {
      event.preventDefault();
      showToast("Installer not available yet — coming soon with the first public release.");
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

if (!window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
}

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

/* ==========================================================================
   Toolbox Registry Integration (Unified Tools & Modules)
   ========================================================================== */

const REGISTRY_INDEX_URL = "https://raw.githubusercontent.com/vivek123r/omniforge-website/main/index.json";

const CATEGORY_SYMBOLS = {
  security: "⌁",
  utilities: "◫",
  formatting: "⇄",
  media: "▧",
  developers: "⌘",
  default: "✣"
};

const BUILTIN_MODULES = [
  { id: "documents", name: "Documents", description: "Offline document editing and formatting station for Word, spreadsheets, and slides.", category: "formatting", isBuiltin: true, iconSymbol: "▤", tags: ["word", "sheet", "slide", "editor", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "pdf-studio", name: "PDF Studio", description: "Merge, split, sign, compress, OCR, and edit metadata on PDF files locally.", category: "formatting", isBuiltin: true, iconSymbol: "⌁", tags: ["pdf", "compress", "sign", "ocr", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "image-studio", name: "Image Studio", description: "Crop, resize, convert, apply adjustments, and batch optimize image files.", category: "media", isBuiltin: true, iconSymbol: "▧", tags: ["image", "resize", "crop", "editor", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "video-studio", name: "Video Studio", description: "Trim, merge, compress, extract frames, and edit subtitles offline.", category: "media", isBuiltin: true, iconSymbol: "▷", tags: ["video", "trim", "compress", "gif", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "audio-studio", name: "Audio Studio", description: "Trim, merge, fade, normalize, inspect waveforms, and edit local audio files.", category: "media", isBuiltin: true, iconSymbol: "♪", tags: ["audio", "trim", "waveform", "editor", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "conversion", name: "Conversion", description: "Universal batch file format converter (documents, media, archives).", category: "formatting", isBuiltin: true, iconSymbol: "⇄", tags: ["convert", "format", "batch", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "archives", name: "Archives", description: "Extract, create, encrypt, and manage compressed ZIP, RAR, and 7Z files.", category: "utilities", isBuiltin: true, iconSymbol: "▣", tags: ["zip", "7z", "tar", "compress", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "versioning", name: "Versioning", description: "Simple local snapshot-based version tracking for backups and rolling back.", category: "utilities", isBuiltin: true, iconSymbol: "◉", tags: ["version", "snapshot", "backup", "rollback", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "capture", name: "Capture", description: "Advanced screenshot utility with screen annotations and scrolling captures.", category: "utilities", isBuiltin: true, iconSymbol: "◫", tags: ["screen", "capture", "screenshot", "annotate", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "recorder", name: "Recorder", description: "Record screen activity, webcams, and microphones simultaneously offline.", category: "media", isBuiltin: true, iconSymbol: "○", tags: ["record", "screen", "webcam", "video", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "downloads", name: "Downloads", description: "High-speed workspace download manager featuring connection splitting.", category: "utilities", isBuiltin: true, iconSymbol: "↓", tags: ["download", "split", "manager", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "toolbox", name: "Toolbox", description: "Dash panel to configure, load, and manage core and custom workspace utilities.", category: "utilities", isBuiltin: true, iconSymbol: "✣", tags: ["toolbox", "dashboard", "widgets", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "search", name: "Search", description: "Fast index-based disk search, duplicates finder, and space analyzer.", category: "utilities", isBuiltin: true, iconSymbol: "⌕", tags: ["search", "disk", "space", "duplicate", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "projects", name: "Projects", description: "Group file paths, assets, actions, and notes into structured client workspaces.", category: "utilities", isBuiltin: true, iconSymbol: "⚙", tags: ["project", "workspace", "organizer", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "automation", name: "Automation", description: "Visual task designer, folder watcher, and automated script scheduler.", category: "developers", isBuiltin: true, iconSymbol: "⌘", tags: ["automate", "workflow", "trigger", "script", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "explorer", name: "Explorer", description: "Local folder browser with built-in previews and custom tag manager.", category: "utilities", isBuiltin: true, iconSymbol: "▰", tags: ["files", "explorer", "preview", "tags", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "dashboard", name: "Dashboard", description: "Home screen with quick actions, recent files, storage overview, and active tasks.", category: "utilities", isBuiltin: true, iconSymbol: "⬡", tags: ["home", "dashboard", "quick-actions", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "settings", name: "Settings", description: "Configure themes, keyboard shortcuts, startup behavior, downloads, and automation.", category: "utilities", isBuiltin: true, iconSymbol: "⌨", tags: ["settings", "configure", "preferences", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" },
  { id: "terminal", name: "Terminal", description: "Multi-pane PTY terminal with voice input, auto-listen, and auto-submit modes.", category: "developers", isBuiltin: true, iconSymbol: "⚡", tags: ["terminal", "pty", "shell", "voice", "core"], author: "OmniForge", license: "Core", minAppVersion: "0.1.0", dependencies: "None (Core)", sourceUrl: "#" }
];

const FALLBACK_DOWNLOADABLE_TOOLS = [
  {
    id: "hash-calculator",
    name: "Hash Calculator",
    description: "Calculate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes for text and files locally.",
    version: "1.0.0",
    category: "security",
    author: "OmniForge",
    license: "MIT",
    tags: ["hash", "security", "md5", "sha256", "cryptography"],
    minAppVersion: "0.1.0",
    dependencies: "None",
    iconSymbol: "⌁",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/hash-calculator"
  },
  {
    id: "uuid-generator",
    name: "UUID/GUID Generator",
    description: "Bulk generate cryptographically secure UUID v4 strings with customizable casing and formatting.",
    version: "2.1.0",
    category: "utilities",
    author: "OmniForge",
    license: "MIT",
    tags: ["uuid", "guid", "generator", "utility", "developer"],
    minAppVersion: "0.1.0",
    dependencies: "None",
    iconSymbol: "▰",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/uuid-generator"
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate customized QR codes for URLs, text, Wi-Fi setups, or contact cards with high error tolerance.",
    version: "1.2.0",
    category: "utilities",
    author: "OmniForge Community",
    license: "Apache-2.0",
    tags: ["qr", "code", "barcode", "image", "generator"],
    minAppVersion: "0.1.0",
    dependencies: "qrcode-py",
    iconSymbol: "◫",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/qr-generator"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Clean, format, minify, and validate JSON structures with semantic highlighting and syntax checking.",
    version: "1.1.0",
    category: "formatting",
    author: "OmniForge",
    license: "MIT",
    tags: ["json", "formatter", "validator", "developer", "formatting"],
    minAppVersion: "0.1.0",
    dependencies: "None",
    iconSymbol: "⇄",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/json-formatter"
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Build and test regular expressions interactively with live highlight, matches counter, and capture breakdown.",
    version: "1.4.0",
    category: "developers",
    author: "OmniForge Community",
    license: "MIT",
    tags: ["regex", "tester", "text", "match", "developer"],
    minAppVersion: "0.1.0",
    dependencies: "python-regex",
    iconSymbol: "⌘",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/regex-tester"
  },
  {
    id: "text-diff",
    name: "Text Diff Tool",
    description: "Compare two files or text blocks side-by-side to highlight line/word modifications, additions, and deletions.",
    version: "1.0.1",
    category: "formatting",
    author: "OmniForge Community",
    license: "MIT",
    tags: ["diff", "compare", "text", "merge", "formatting"],
    minAppVersion: "0.1.0",
    dependencies: "None",
    iconSymbol: "▤",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/text-diff"
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Optimize and compress PNG, JPEG, and WebP images locally without quality degradation.",
    version: "1.3.0",
    category: "media",
    author: "OmniForge",
    license: "MIT",
    tags: ["image", "compress", "media", "optimization", "png", "jpeg"],
    minAppVersion: "0.1.0",
    dependencies: "pillow (PIL)",
    iconSymbol: "▧",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/image-compressor"
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write rich markdown documentation with side-by-side preview, automatic table generation, and PDF export.",
    version: "1.0.0",
    category: "formatting",
    author: "OmniForge Community",
    license: "MIT",
    tags: ["markdown", "editor", "formatting", "preview", "pdf"],
    minAppVersion: "0.1.0",
    dependencies: "None",
    iconSymbol: "⚙",
    sourceUrl: "https://github.com/OmniForge/omniforge-tools/tree/main/tools/markdown-editor"
  }
];

let toolsList = [];
let activeCategory = "all";
let searchQuery = "";
let showAllTools = false;

async function fetchRegistry() {
  let downloadableTools = [];
  try {
    const response = await fetch(REGISTRY_INDEX_URL);
    if (!response.ok) throw new Error("Registry server returned error");
    const data = await response.json();
    if (data && data.tools) {
      downloadableTools = Object.keys(data.tools).map(key => {
        const item = data.tools[key];
        return {
          id: item.id || key,
          name: item.name || key,
          description: item.description || "",
          version: item.version || "1.0.0",
          category: item.category || "utilities",
          author: item.author || "Community",
          license: item.license || "MIT",
          tags: item.tags || [],
          minAppVersion: item.minAppVersion || "0.1.0",
          dependencies: item.dependencies ? Object.entries(item.dependencies).map(([k, v]) => `${k} ${v}`).join(", ") : "None",
          iconUrl: item.icon || "",
          iconSymbol: CATEGORY_SYMBOLS[item.category] || CATEGORY_SYMBOLS.default,
          downloadUrl: item.downloadUrl || `https://github.com/OmniForge/omniforge-tools/releases/download/${key}-${item.version}/${key}-${item.version}.oftool`,
          sha256: item.sha256 || "",
          sourceUrl: `https://github.com/OmniForge/omniforge-tools/tree/main/tools/${key}`,
          isBuiltin: false
        };
      });
      console.log("Successfully loaded tool list from raw index.");
    } else {
      throw new Error("Invalid schema");
    }
  } catch (error) {
    console.warn("Registry endpoint unreachable, loading defaults.", error.message);
    downloadableTools = FALLBACK_DOWNLOADABLE_TOOLS.map(item => ({
      ...item,
      downloadUrl: item.downloadUrl || `https://github.com/OmniForge/omniforge-tools/releases/download/${item.id}-${item.version}/${item.id}-${item.version}.oftool`,
      sha256: item.sha256 || "0000000000000000000000000000000000000000000000000000000000000000",
      isBuiltin: false
    }));
  }
  
  // Unify lists — built-in modules + downloadable community tools
  toolsList = [...BUILTIN_MODULES, ...downloadableTools];
  renderTools();
}

const toolsGrid = document.getElementById("tools-grid");
const toolsEmpty = document.getElementById("tools-empty");

function renderTools() {
  if (!toolsGrid) return;
  toolsGrid.innerHTML = "";

  const filtered = toolsList.filter(tool => {
    // Category match
    let categoryMatch = false;
    if (activeCategory === "all") {
      categoryMatch = true;
    } else if (activeCategory === "builtin") {
      categoryMatch = tool.isBuiltin;
    } else if (activeCategory === "downloadable") {
      categoryMatch = !tool.isBuiltin;
    } else {
      categoryMatch = tool.category === activeCategory;
    }
    
    // Search query match
    const cleanQuery = searchQuery.trim().toLowerCase();
    const queryMatch = !cleanQuery || 
      tool.name.toLowerCase().includes(cleanQuery) ||
      tool.description.toLowerCase().includes(cleanQuery) ||
      tool.author.toLowerCase().includes(cleanQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(cleanQuery));

    return categoryMatch && queryMatch;
  });

  if (filtered.length === 0) {
    toolsGrid.style.display = "none";
    if (toolsEmpty) toolsEmpty.style.display = "flex";
  } else {
    toolsGrid.style.display = "grid";
    if (toolsEmpty) toolsEmpty.style.display = "none";

    const limit = showAllTools ? filtered.length : 6;
    const visible = filtered.slice(0, limit);

    visible.forEach((tool, index) => {
      const card = document.createElement("article");
      card.className = "tool-card reveal";
      card.setAttribute("tabindex", "0");
      card.style.transitionDelay = `${Math.min(index * 12, 110)}ms`;

      let iconHTML = `<span class="tool-card-icon-symbol">${tool.iconSymbol}</span>`;
      if (tool.iconUrl) {
        iconHTML = `<img src="${tool.iconUrl}" alt="${tool.name} icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                    <span class="tool-card-icon-symbol" style="display:none;">${tool.iconSymbol}</span>`;
      }

      const statusBadgeClass = tool.isBuiltin ? "category-badge builtin" : "category-badge downloadable";
      const statusText = tool.isBuiltin ? "Built-In" : "Downloadable";

      card.innerHTML = `
        <div>
          <div class="tool-card-top">
            <div class="tool-card-icon">${iconHTML}</div>
            <div class="tool-card-meta">
              <h4>${tool.name}</h4>
              <span class="tool-card-author">by ${tool.author}</span>
            </div>
          </div>
          <p class="tool-card-description">${tool.description}</p>
        </div>
        <div class="tool-card-footer">
          <span class="${statusBadgeClass}">${statusText}</span>
          <span class="tool-card-version">${tool.isBuiltin ? "Pre-Installed" : "v" + tool.version}</span>
        </div>
      `;

      card.addEventListener("click", () => openToolModal(tool));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openToolModal(tool);
        }
      });

      toolsGrid.appendChild(card);
    });

    if (filtered.length > 6 && !showAllTools) {
      const showMore = document.createElement("button");
      showMore.className = "show-more-btn";
      showMore.textContent = `Show all ${filtered.length} tools`;
      showMore.addEventListener("click", () => {
        showAllTools = true;
        renderTools();
      });
      toolsGrid.appendChild(showMore);
    }
  }
}

const toolModal = document.getElementById("tool-modal");
const modalTitle = document.getElementById("modal-title");
const modalVersion = document.getElementById("modal-version");
const modalAuthor = document.getElementById("modal-author");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalTags = document.getElementById("modal-tags");
const modalLicense = document.getElementById("modal-license");
const modalMinVersion = document.getElementById("modal-min-version");
const modalDependencies = document.getElementById("modal-dependencies");
const modalIconSymbol = document.getElementById("modal-icon-symbol");
const modalIconImg = document.getElementById("modal-icon-img");

const modalActionInstall = document.getElementById("modal-action-install");
const modalActionDownload = document.getElementById("modal-action-download");
const modalActionSource = document.getElementById("modal-action-source");

function openToolModal(tool) {
  if (!toolModal) return;

  if (modalTitle) modalTitle.textContent = tool.name;
  if (modalVersion) modalVersion.textContent = tool.isBuiltin ? "Built-In Module" : `v${tool.version}`;
  if (modalAuthor) modalAuthor.textContent = `by ${tool.author}`;
  
  if (modalCategory) {
    modalCategory.textContent = tool.isBuiltin ? `Core / ${tool.category}` : tool.category;
    modalCategory.className = tool.isBuiltin ? "category-badge builtin" : "category-badge downloadable";
  }
  if (modalDescription) modalDescription.textContent = tool.description;
  if (modalLicense) modalLicense.textContent = tool.license;
  if (modalMinVersion) modalMinVersion.textContent = `v${tool.minAppVersion}`;
  if (modalDependencies) modalDependencies.textContent = tool.dependencies;

  if (tool.iconUrl) {
    if (modalIconImg) {
      modalIconImg.src = tool.iconUrl;
      modalIconImg.style.display = "block";
    }
    if (modalIconSymbol) modalIconSymbol.style.display = "none";
  } else {
    if (modalIconImg) {
      modalIconImg.src = "";
      modalIconImg.style.display = "none";
    }
    if (modalIconSymbol) {
      modalIconSymbol.textContent = tool.iconSymbol;
      modalIconSymbol.style.display = "block";
    }
  }

  if (modalTags) {
    modalTags.innerHTML = "";
    tool.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "modal-tag";
      span.textContent = `#${tag}`;
      modalTags.appendChild(span);
    });
  }

  // Action buttons footer toggle based on Core status
  if (tool.isBuiltin) {
    // Hide download/source links, replace main action with full-width disabled button
    if (modalActionInstall) {
      modalActionInstall.className = "button button-disabled button-full";
      modalActionInstall.querySelector("span").textContent = "Built-in Core Module";
      modalActionInstall.href = "#";
    }
    if (modalActionDownload) modalActionDownload.style.display = "none";
    if (modalActionSource) modalActionSource.style.display = "none";
  } else {
    // Show download/source links, restore main action
    if (modalActionInstall) {
      modalActionInstall.className = "button button-dark";
      modalActionInstall.querySelector("span").textContent = "Install in App";
      const encodedUrl = encodeURIComponent(tool.downloadUrl);
      modalActionInstall.href = `omniforge://install?id=${tool.id}&version=${tool.version}&downloadUrl=${encodedUrl}&sha256=${tool.sha256 || ""}`;
    }
    if (modalActionDownload) {
      modalActionDownload.style.display = "inline-flex";
      modalActionDownload.href = tool.downloadUrl;
    }
    if (modalActionSource) {
      modalActionSource.style.display = "inline-flex";
      modalActionSource.href = tool.sourceUrl;
    }
  }

  toolModal.classList.add("show");
  toolModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    toolModal.querySelector(".modal-close")?.focus();
  }, 50);
}

function closeToolModal() {
  if (!toolModal) return;
  toolModal.classList.remove("show");
  toolModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Modal closing event attachments
if (toolModal) {
  const closeBtn = toolModal.querySelector(".modal-close");
  closeBtn?.addEventListener("click", closeToolModal);

  toolModal.addEventListener("click", (e) => {
    if (e.target === toolModal) {
      closeToolModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toolModal.classList.contains("show")) {
      closeToolModal();
    }
  });
}

// Search interactions
const toolSearch = document.getElementById("tool-search");
const clearSearchBtn = document.getElementById("clear-search");

if (toolSearch) {
  toolSearch.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    showAllTools = false;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? "block" : "none";
    }
    renderTools();
  });
}

if (clearSearchBtn && toolSearch) {
  clearSearchBtn.addEventListener("click", () => {
    toolSearch.value = "";
    searchQuery = "";
    showAllTools = false;
    clearSearchBtn.style.display = "none";
    toolSearch.focus();
    renderTools();
  });
}

// Category selection tabs
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    activeCategory = button.dataset.category;
    showAllTools = false;
    renderTools();
  });
});

// Initialize registry
fetchRegistry();
