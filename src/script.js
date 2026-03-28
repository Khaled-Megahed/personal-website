/**
 * Global Filter Function
 */
window.filterProjects = function (category) {
  const items = document.querySelectorAll(".project-item");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => {
    const isTarget = btn.getAttribute("onclick")?.includes(`'${category}'`);
    btn.classList.toggle("border-black", isTarget);
    btn.classList.toggle("dark:border-white", isTarget);
    btn.classList.toggle("text-black", isTarget);
    btn.classList.toggle("dark:text-white", isTarget);
    btn.classList.toggle("border-transparent", !isTarget);
    btn.classList.toggle("text-gray-400", !isTarget);
  });

  items.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px) scale(0.98)";
    item.style.pointerEvents = "none";
    item.classList.remove("is-visible");

    setTimeout(() => {
      const match =
        category === "all" || item.getAttribute("data-category") === category;
      if (match) {
        item.style.display = "grid";
        item.classList.add("is-visible");
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0) scale(1)";
          item.style.pointerEvents = "auto";
        }, 50);
      } else {
        item.style.display = "none";
      }
    }, 400);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");
  const darkToggle = document.getElementById("dark-toggle");
  const header = document.querySelector("header");

  const lines = [
    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3"),
  ].filter((el) => el !== null);

  const mobileLinks = document.querySelectorAll(".mobile-link");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const shape = document.getElementById("shape");
  const shapeText = document.getElementById("shape-text");

  // --- 1. Theme Logic ---
  const applyTheme = (theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  };

  if (
    localStorage.theme === "dark" ||
    (!localStorage.theme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    applyTheme("dark");
  }

  darkToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  });

  // --- 2. Interactive Shape ---
  shape?.addEventListener("mouseenter", () => {
    shapeText?.classList.remove("text-gray-300", "dark:text-gray-600");
    shapeText?.classList.add(
      "text-blue-600",
      "animate-pulse",
      "[text-shadow:0_0_20px_rgba(59,130,246,0.8)]",
    );
  });

  shape?.addEventListener("mouseleave", () => {
    shapeText?.classList.add("text-gray-300", "dark:text-gray-600");
    shapeText?.classList.remove(
      "text-blue-600",
      "animate-pulse",
      "[text-shadow:0_0_20_rgba(59,130,246,0.8)]",
    );
  });

  // --- 3. Scroll-Spy & Reveal ---
  const observerOptions = { threshold: 0.15, rootMargin: "0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        const id = entry.target.getAttribute("id");
        if (id) {
          navLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            ),
          );
          mobileLinks.forEach((link) =>
            link.classList.toggle(
              "active-mobile",
              link.getAttribute("href") === `#${id}`,
            ),
          );
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    section.classList.add("reveal-hidden");
    observer.observe(section);
  });

  // --- 4. Mobile Menu Logic ---
  const toggleMenu = (forceClose = false) => {
    const isOpening = forceClose
      ? false
      : !mobileMenu?.classList.contains("opacity-100");

    if (mobileMenu) {
      if (isOpening) {
        mobileMenu.classList.add("opacity-100", "pointer-events-auto");
        mobileMenu.classList.remove("opacity-0", "pointer-events-none");
        document.body.style.overflow = "hidden";
      } else {
        mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
        mobileMenu.classList.add("opacity-0", "pointer-events-none");
        document.body.style.overflow = "auto";

        // Force header reset
        if (header) {
          header.style.opacity = "1";
          header.style.transform = "translateY(0)";
          header.style.visibility = "visible";
          header.style.zIndex = "50";
        }
      }
    }

    if (lines.length === 3) {
      lines[0].style.transform = isOpening
        ? "translateY(8px) rotate(45deg)"
        : "none";
      lines[1].style.opacity = isOpening ? "0" : "1";
      lines[1].style.transform = isOpening
        ? "translateX(20px)"
        : "translateX(0)";
      lines[2].style.transform = isOpening
        ? "translateY(-8px) rotate(-45deg)"
        : "none";
    }
  };

  menuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  overlay?.addEventListener("click", () => toggleMenu(true));

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Small timeout ensures the anchor jump is handled before closing
      setTimeout(() => toggleMenu(true), 50);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("opacity-100")) {
      toggleMenu(true);
    }
  });

  // --- 5. Project Initialization ---
  document.querySelectorAll(".project-item").forEach((item) => {
    item.classList.add("is-visible");
  });
});
