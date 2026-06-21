(() => {
  const dropdown = document.querySelector(".nav-dropdown");
  if (!dropdown) return;

  // Open on hover
  dropdown.addEventListener("mouseenter", () => dropdown.classList.add("is-open"));
  dropdown.addEventListener("mouseleave", () => dropdown.classList.remove("is-open"));

  // Toggle on title click (touch / keyboard users)
  const title = dropdown.querySelector(".site-title");
  if (title) {
    title.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("is-open");
    });
  }

  // Close when clicking anywhere outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove("is-open");
  });
})();
