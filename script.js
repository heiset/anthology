(() => {
  const body = document.body;

  if (body.classList.contains('page-home')) {
    // Home page: toggle sidebar nav when clicking site title
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
      siteTitle.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('menu-open');
      });
    }
  } else {
    // Project/sub-pages: append "main menu" toggle link at bottom of sidebar nav
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
      const toggle = document.createElement('a');
      toggle.className = 'sidebar-main-toggle';
      toggle.href = '#';
      toggle.textContent = 'main menu';
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = body.classList.toggle('show-main-menu');
        toggle.textContent = isOpen ? 'hide menu' : 'main menu';
      });
      sidebarNav.appendChild(toggle);
    }
  }
})();
