// ==========================
// Simple Portfolio Enhancements
// ==========================

// Fade-in effect on load
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 0.6s ease-in";
    document.body.style.opacity = 1;
  }, 100);
});


// ==========================
// Highlight Active Navigation Link
// ==========================
const links = document.querySelectorAll("nav a");
const currentPath = window.location.pathname;

links.forEach(link => {
  if (currentPath.includes(link.getAttribute("href"))) {
    link.style.fontWeight = "bold";
  }
});


// ==========================
// Project Search Filter (for projects.html)
// ==========================
const searchInput = document.getElementById("projectSearch");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(filter) ? "block" : "none";
    });
  });
}