const Layout = {
  renderPatientLayout: (currentPage) => {
    // 1. Build Header
    const headerHtml = `
      <header class="top-header">
        <div class="header-content">
          <a href="../main/index.html" class="logo-link">
            <i data-lucide="activity"></i>
            <span>HealthWaze Local</span>
          </a>
          
          <div class="header-actions">
            <div class="nearby-badge">📍 Nearby Clinics</div>
            
            <button class="btn btn-ghost" style="color: white; border-radius: 50%; padding: 8px;">
              <i data-lucide="bell"></i>
            </button>

            <a href="../features/profile.html" class="profile-btn">ME</a>
          </div>
        </div>
      </header>
    `;

    // 2. Build Desktop Sidebar
    const navItems = [
      { id: 'index', path: '../main/index.html', icon: 'home', label: 'Status Board' },
      { id: 'clinics', path: '../features/clinics.html', icon: 'map-pin', label: 'Nearby Clinics' },
      { id: 'appointments', path: '../features/appointments.html', icon: 'calendar', label: 'Appointments' },
      { id: 'messages', path: '../features/messages.html', icon: 'message-square', label: 'Messages' },
      { id: 'profile', path: '../features/profile.html', icon: 'user', label: 'Profile (Verified)' }
    ];

    const sidebarHtml = `
      <div class="desktop-sidebar">
        <nav>
          ${navItems.map(item => `
            <a href="${item.path}" class="nav-item ${currentPage === item.id ? 'active' : ''}">
              <i data-lucide="${item.icon}"></i>
              <span>${item.label}</span>
              ${item.label.includes('Verified') ? '<i data-lucide="shield-check" style="color: var(--success); margin-left: auto;"></i>' : ''}
            </a>
          `).join('')}
        </nav>
      </div>
    `;

    // 3. Build Mobile Nav (Bottom)
    const mobileNavHtml = `
      <div class="mobile-nav">
        ${navItems.filter(i => ['index', 'clinics', 'appointments', 'profile'].includes(i.id)).map(item => `
          <a href="${item.path}" class="mobile-nav-item ${currentPage === item.id ? 'active' : ''}">
            <i data-lucide="${item.icon}"></i>
            <span>${item.label.split(' ')[0]}</span>
          </a>
        `).join('')}
      </div>
    `;

    const headerContainer = document.getElementById('layout-header');
    if (headerContainer) headerContainer.innerHTML = headerHtml;

    const sidebarContainer = document.getElementById('layout-sidebar');
    if (sidebarContainer) sidebarContainer.innerHTML = sidebarHtml;

    const mobileNavContainer = document.getElementById('layout-mobile-nav');
    if (mobileNavContainer) mobileNavContainer.innerHTML = mobileNavHtml;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.Layout = Layout;
