document.addEventListener("DOMContentLoaded", () => {
  // Elements - Using optional chaining later to prevent errors if an ID is missing
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("overlay");
  const darkToggle = document.getElementById("dark-toggle");

  const lines = [
    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3"),
  ].filter((el) => el !== null); // Ensure lines exist before animating

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

  // --- 2. Interactive Shape (Hover) ---
  shape?.addEventListener("mouseenter", () => {
    shapeText?.classList.remove("text-gray-300");
    shapeText?.classList.add(
      "text-blue-600",
      "animate-pulse",
      "[text-shadow:0_0_20px_rgba(59,130,246,0.8)]",
    );
  });
  shape?.addEventListener("mouseleave", () => {
    shapeText?.classList.add("text-gray-300");
    shapeText?.classList.remove(
      "text-blue-600",
      "animate-pulse",
      "[text-shadow:0_0_20px_rgba(59,130,246,0.8)]",
    );
  });

  // --- 3. Optimized Scroll-Spy & Reveal ---
  // Threshold adjusted to 0.5 so it switches active link when section is half-visible
  const observerOptions = { threshold: 0.3, rootMargin: "-10% 0px -20% 0px" };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Feature: Show-up animation
        entry.target.classList.add("reveal-visible");

        // Feature: Active Link Update
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

  // --- 4. Mobile Menu Logic (Fixed Toggling) ---
  const toggleMenu = (forceClose = false) => {
    const isOpening = forceClose
      ? false
      : !mobileMenu.classList.contains("opacity-100");

    mobileMenu.classList.toggle("opacity-100", isOpening);
    mobileMenu.classList.toggle("pointer-events-auto", isOpening);
    document.body.style.overflow = isOpening ? "hidden" : "auto";

    // Hamburger Animation (Only if 3 lines exist)
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

  // Close menu when clicking overlay or links
  overlay?.addEventListener("click", () => toggleMenu(true));
  mobileLinks.forEach((link) =>
    link.addEventListener("click", () => toggleMenu(true)),
  );

  // Escape key support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("opacity-100"))
      toggleMenu(true);
  });
  mobileNav.addEventListener("click", () => {
    toggleMenu(true);
  });
});
