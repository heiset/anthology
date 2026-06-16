(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let previousY = Math.max(window.scrollY, 0);
  let ticking = false;
  const revealAtTop = 18;
  const minimumDelta = 5;

  const updateHeader = () => {
    const currentY = Math.max(window.scrollY, 0);
    const delta = currentY - previousY;

    header.classList.toggle("is-scrolled", currentY > revealAtTop);

    if (currentY <= revealAtTop) {
      header.classList.remove("is-hidden");
    } else if (delta > minimumDelta) {
      // Scrolling down: tuck the header away.
      header.classList.add("is-hidden");
    } else if (delta < -minimumDelta) {
      // Scrolling up anywhere on the page: bring it gently back.
      header.classList.remove("is-hidden");
    }

    previousY = currentY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
})();

// Dropdown sitemap toggle (click support for touch/mobile)
(() => {
  const dropdown = document.querySelector(".nav-dropdown");
  if (!dropdown) return;

  dropdown.querySelector(".site-title").addEventListener("click", (e) => {
    // Only intercept if not navigating (i.e. treat as toggle on same page)
    e.preventDefault();
    dropdown.classList.toggle("is-open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("is-open");
    }
  });
})();
