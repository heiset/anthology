(() => {
  const body = document.body;

  if (body.classList.contains('page-home')) {
    // Desktop home page: clicking site title toggles the sidebar nav
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
      siteTitle.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('menu-open');
      });
    }
  } else {
    // Project/sub-pages: append "full site map" toggle at bottom of sidebar nav
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
      const toggle = document.createElement('a');
      toggle.className = 'sidebar-main-toggle';
      toggle.href = '#';
      toggle.textContent = 'full site map';
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = body.classList.toggle('show-main-menu');
        toggle.textContent = isOpen ? 'hide site map' : 'full site map';
      });
      sidebarNav.appendChild(toggle);
    }
  }

  // Mobile: create a fixed title element that toggles the sidebar drawer
  const sidebarTitle = document.querySelector('.site-title');
  if (sidebarTitle) {
    const mobileTitle = document.createElement('a');
    mobileTitle.className = 'mobile-title';
    mobileTitle.href = sidebarTitle.href;
    mobileTitle.textContent = sidebarTitle.textContent;
    document.body.appendChild(mobileTitle);

    mobileTitle.addEventListener('click', (e) => {
      e.preventDefault();
      body.classList.remove('scrolled-down');
      body.classList.toggle('sidebar-open');
    });
  }

  // Mobile: close sidebar drawer when clicking outside it
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('sidebar-open')) return;
    const sidebar = document.querySelector('.site-sidebar');
    const mobileTitle = document.querySelector('.mobile-title');
    if (sidebar && !sidebar.contains(e.target) && e.target !== mobileTitle) {
      body.classList.remove('sidebar-open');
    }
  });

  // Mobile: hide fixed header elements on scroll down, show on scroll up
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (body.classList.contains('sidebar-open')) return;
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 50) {
      body.classList.add('scrolled-down');
    } else {
      body.classList.remove('scrolled-down');
    }
    lastScrollY = currentY;
  }, { passive: true });
})();
