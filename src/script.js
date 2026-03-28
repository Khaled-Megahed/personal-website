/**
 * Global Filter Function
 * Handles category switching and dynamic spacing via the 'is-visible' class.
 */
window.filterProjects = function (category) {
  const items = document.querySelectorAll(".project-item");
  const buttons = document.querySelectorAll(".filter-btn");

  // 1. Update Navigation Button UI
  buttons.forEach((btn) => {
    const isTarget = btn.getAttribute("onclick").includes(`'${category}'`);
    btn.classList.toggle("border-black", isTarget);
    btn.classList.toggle("dark:border-white", isTarget);
    btn.classList.toggle("text-black", isTarget);
    btn.classList.toggle("dark:text-white", isTarget);
    btn.classList.toggle("border-transparent", !isTarget);
    btn.classList.toggle("text-gray-400", !isTarget);
  });

  // 2. Animate and Filter Project Items
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
  // --- Elements Selection ---
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("overlay");
  const darkToggle = document.getElementById("dark-toggle");
  const shape = document.getElementById("shape");
  const shapeText = document.getElementById("shape-text");

  const lines = [
    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3"),
  ].filter((el) => el !== null);

  const mobileLinks = document.querySelectorAll(".mobile-link");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

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

  // --- 2. Responsive Evolution Content ---
  // Using JS to manage complex text swaps for cleaner HTML and better mobile fit
  const aboutContent = {
    pc: [
      `"It started with a simple idea: what if I could build my own game? Watching characters move because of code I wrote changed everything." What began as curiosity about game development quickly became a passion for programming. I wanted to understand how things work, how logic creates movement, and how ideas turn into interactive experiences.`,
      `Then I discovered web development — and something just felt right. The browser became my new playground. Instead of building worlds inside a game, I was building experiences anyone could access with a single click. I became curious about how websites respond, move, and feel so smooth. That’s when I dove into JavaScript and React — not just to learn them, but to understand how to make a site feel alive.`,
      `Today, I bridge the gap between design and engineering. What began as curiosity has evolved into a mission: architecting scalable systems from the ground up. I don't just build interfaces; I engineer high-performance experiences where every detail is optimized for growth. Now, I turn ambitious ideas into future-proof digital foundations—built not just for today, but for what’s next.`,
    ],
    mobile: [
      `"What if I could build my own game?" Seeing characters move because of my code turned curiosity into a passion for logic and interactive experiences.`,
      `I discovered web development and the browser became my playground. I dove into JavaScript and React to understand how to make a site feel alive.`,
      `I bridge design and engineering to architect scalable systems. I engineer high-performance experiences optimized for growth and future-proof foundations.`,
    ],
  };

  const updateEvolutionText = () => {
    const isMobile = window.innerWidth < 768;
    const version = isMobile ? "mobile" : "pc";
    const textElements = [
      document.getElementById("step-1-text"),
      document.getElementById("step-2-text"),
      document.getElementById("step-3-text"),
    ];

    textElements.forEach((el, index) => {
      if (el) el.innerText = aboutContent[version][index];
    });
  };

  window.addEventListener("resize", updateEvolutionText);
  updateEvolutionText(); // Initial call

  // --- 3. Interactive Shape ---
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
      "[text-shadow:0_0_20px_rgba(59,130,246,0.8)]",
    );
  });

  // --- 4. Optimized Scroll-Spy & Reveal ---
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

  // --- 5. Mobile Menu Logic ---
  const toggleMenu = (forceClose = false) => {
    const isOpening = forceClose
      ? false
      : !mobileMenu?.classList.contains("opacity-100");
    if (mobileMenu) {
      mobileMenu.classList.toggle("opacity-100", isOpening);
      mobileMenu.classList.toggle("pointer-events-auto", isOpening);
      document.body.style.overflow = isOpening ? "hidden" : "auto";
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
  mobileLinks.forEach((link) =>
    link.addEventListener("click", () => toggleMenu(true)),
  );
  mobileNav?.addEventListener("click", () => toggleMenu(true));

  // --- 6. Project Initialization ---
  document.querySelectorAll(".project-item").forEach((item) => {
    item.classList.add("is-visible");
  });
});
