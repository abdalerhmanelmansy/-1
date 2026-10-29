"use strict";

const modal = document.querySelector("#app-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const signupForm = document.querySelector("#signup-form");
const toast = document.querySelector("#toast");
const courseCards = [...document.querySelectorAll(".course-card")];
const filterButtons = [...document.querySelectorAll(".filter-tab")];
const searchInput = document.querySelector("#course-search");
const emptyState = document.querySelector("#empty-state");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
let activeFilter = "all";
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 3600);
}

function openModal(title, description) {
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  signupForm.reset();
  modal.showModal();
}

function updateCourses() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  courseCards.forEach((card) => {
    const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchableText = `${card.dataset.title} ${card.textContent}`.toLocaleLowerCase();
    const matchesSearch = searchableText.includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("selected", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });
    updateCourses();
  });

  button.setAttribute("aria-pressed", String(button.classList.contains("selected")));
});

searchInput.addEventListener("input", updateCourses);

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const isLogin = button.dataset.openModal === "login";
    openModal(
      isLogin ? "Welcome back" : "Ready for a fresh start?",
      isLogin
        ? "This demo is a preview. Create a profile to take your first step."
        : "Sign up to take your first step on a new learning journey."
    );
  });
});

document.querySelectorAll("[data-course]").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(
      button.dataset.course,
      "This course preview is part of the Skillora demo. Sign up to register your interest."
    );
  });
});

document.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.close();
  showToast("Thanks for your interest! This demo does not save or send your details.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Thanks for signing up! Newsletter delivery is not connected in this demo.");
});

document.querySelector(".announcement-close").addEventListener("click", () => {
  document.querySelector(".announcement").hidden = true;
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  mainNav.classList.toggle("open", !isExpanded);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});
