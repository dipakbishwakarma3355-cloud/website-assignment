const StatusBoard = {
  activeFilter: 'all',
  searchQuery: '',

  init: () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        StatusBoard.searchQuery = e.target.value.toLowerCase();
        StatusBoard.renderUpdates();
      });
    }

    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        filterPills.forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        StatusBoard.activeFilter = e.target.getAttribute('data-filter');
        StatusBoard.renderUpdates();
      });
    });

    StatusBoard.renderUpdates();
  },

  getClinicName: (id) => {
    const clinic = window.MOCK_CLINICS.find(c => c.id === id);
    return clinic ? clinic.name : "Unknown Clinic";
  },

  getIndicatorClass: (type) => {
    if (type === 'slot_available' || type === 'cancellation') return 'indicator-success';
    if (type === 'system_down') return 'indicator-danger';
    if (type === 'delay') return 'indicator-warning';
    return '';
  },

  getBadgeHTML: (type) => {
    switch(type) {
      case 'slot_available': return `<span class="badge badge-success"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Slot Available</span>`;
      case 'cancellation': return `<span class="badge badge-success"><i data-lucide="activity" style="width:14px; height:14px;"></i> Cancellation Gap</span>`;
      case 'delay': return `<span class="badge badge-warning"><i data-lucide="clock" style="width:14px; height:14px;"></i> Delay Expected</span>`;
      case 'system_down': return `<span class="badge badge-danger"><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i> Critical Status</span>`;
      default: return `<span class="badge badge-success">Info</span>`;
    }
  },

  renderUpdates: () => {
    const feed = document.getElementById('updatesFeed');
    if (!feed) return;

    let filtered = window.MOCK_UPDATES.filter(u => {
      const clinicName = StatusBoard.getClinicName(u.clinicId).toLowerCase();
      const msg = u.message.toLowerCase();
      const matchesSearch = clinicName.includes(StatusBoard.searchQuery) || msg.includes(StatusBoard.searchQuery);
      
      if (StatusBoard.activeFilter === 'slots' && u.type !== 'slot_available' && u.type !== 'cancellation') return false;
      if (StatusBoard.activeFilter === 'delays' && u.type !== 'delay' && u.type !== 'system_down') return false;
      if (StatusBoard.activeFilter === 'verified' && !u.userVerified) return false;
      
      return matchesSearch;
    });

    if (filtered.length === 0) {
      feed.innerHTML = `
        <div class="card" style="padding: 48px; text-align: center; color: var(--text-muted);">
          <p>No updates matching your filters.</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = filtered.map(u => {
      const isSlot = u.type === 'slot_available' || u.type === 'cancellation';
      return `
        <div class="card update-card ${isSlot ? 'slot' : ''}">
          <div class="update-indicator ${StatusBoard.getIndicatorClass(u.type)}"></div>
          
          <div class="update-content">
            <h3 style="font-size: 18px; font-weight: 700;">${StatusBoard.getClinicName(u.clinicId)}</h3>
            <p style="font-size: 14px; color: var(--text-muted); margin-top: 4px;">Updated recently</p>
            
            <div class="update-message">
              <p>"${u.message}"</p>
            </div>
          </div>
          
          <div class="update-meta">
            ${StatusBoard.getBadgeHTML(u.type)}
            
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-top: auto;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; font-weight: 700;">${u.reportedBy}</span>
                ${u.userVerified ? `<i data-lucide="shield-check" style="color: var(--success); width: 14px; height: 14px;"></i>` : ''}
              </div>
              <button class="btn btn-ghost" style="padding: 6px 12px; background: var(--bg-main); font-size: 13px;" 
                      onclick="alert('Upvote logic here!')">
                 Helpful (${u.upvotes})
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    if(window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.StatusBoard = StatusBoard;
