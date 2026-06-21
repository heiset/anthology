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
})();
