// Import main CSS - Vite will handle CSS processing
import "./theme.css";
import sectionManager from "~/scripts/section-manager.js";

// Import hero image so Vite processes and moves it to assets folder
import "../assets/hero.png";

// Import logo image
import "../assets/nighshift.png";

console.log("Nightshift theme loaded");

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Load below-the-fold sections dynamically on home page
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "" ||
    window.location.pathname === window.Shopify?.routes?.root
  ) {
    loadBelowFoldSections();
  }
});

const loadBelowFoldSections = async () => {
  try {
    // Load below-the-fold sections dynamically for better performance
    const belowFoldSections = ["testimonials", "newsletter"];

    console.log("Loading below-the-fold sections:", belowFoldSections);

    // Load sections with staggered animation
    await sectionManager.loadSections(belowFoldSections);

    console.log("🎉 Below-the-fold sections loaded!");
  } catch (error) {
    console.error("Error loading below-the-fold sections:", error);
  }
};
