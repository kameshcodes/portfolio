// Shared theme, nav, and scroll-to-top logic for all pages

// Theme toggle
const btnTheme = document.getElementById("toggleTheme");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("body-dark");
  document.body.classList.remove("body-light");
  btnTheme.querySelector("i").classList.replace("fa-moon", "fa-sun");
}

btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("body-light");
  document.body.classList.toggle("body-dark");
  const icon = btnTheme.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
  localStorage.setItem("theme", document.body.classList.contains("body-dark") ? "dark" : "light");
});

// Mobile nav toggle
const btnHamburger = document.querySelector(".fa-bars");
const nav = document.getElementById("nav");

if (btnHamburger) {
  btnHamburger.addEventListener("click", () => {
    nav.classList.toggle("navOpen");
  });
}

// Scroll-to-top visibility
const scrollUp = document.querySelector(".scroll-up");
if (scrollUp) {
  window.addEventListener("scroll", () => {
    scrollUp.style.display = window.scrollY > 300 ? "block" : "none";
  });
}
