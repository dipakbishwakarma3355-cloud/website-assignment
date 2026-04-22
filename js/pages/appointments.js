const AppointmentsPage = {
  activeTab: 'upcoming',
  appointments: [],

  init: () => {
    // Inject Layout
    Layout.renderPatientLayout('appointments');
    
    // Load state from local storage or set initial mocks
    AppointmentsPage.loadAppointments();

    // Setup Tabs
    const tabs = document.querySelectorAll('#apptTabs .tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        AppointmentsPage.activeTab = e.target.getAttribute('data-view');
        AppointmentsPage.renderFeed();
      });
    });

    // Setup Modal interactions
    const bookBtn = document.getElementById('openBookingModalBtn');
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('closeBookingModalBtn');
    const cancelBtn = document.getElementById('cancelBookingBtn');
    const form = document.getElementById('bookingForm');

    bookBtn.addEventListener('click', () => {
      AppointmentsPage.populateClinicDropdown();
      
      // Set min date to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('dateSelect').setAttribute('min', today);
      
      modal.classList.add('show');
    });

    const closeModal = () => {
      modal.classList.remove('show');
      form.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clinicId = document.getElementById('clinicSelect').value;
      const clinicName = window.MOCK_CLINICS.find(c => c.id === clinicId)?.name || 'Unknown Clinic';
      const doctor = document.getElementById('doctorSelect').value;
      const date = document.getElementById('dateSelect').value;
      const time = document.getElementById('timeSelect').value;
      const reason = document.getElementById('reasonSelect').value;

      const newAppt = {
        id: 'appt_' + Date.now(),
        clinicName,
        doctor,
        date,
        time,
        reason,
        status: 'upcoming' 
      };

      AppointmentsPage.appointments.unshift(newAppt);
      AppointmentsPage.saveAppointments();
      AppointmentsPage.renderFeed();
      closeModal();
    });

    // Initial Render
    AppointmentsPage.renderFeed();
  },

  loadAppointments: () => {
    const saved = localStorage.getItem('mock_appointments');
    if (saved) {
      AppointmentsPage.appointments = JSON.parse(saved);
    } else {
      // Default Mock Data
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      AppointmentsPage.appointments = [
        {
          id: 'mock_1',
          clinicName: 'Riverside Medical Practice',
          doctor: 'Dr. Jenkins',
          date: tomorrow.toISOString().split('T')[0],
          time: '10:30',
          reason: 'Routine Checkup',
          status: 'upcoming'
        },
        {
          id: 'mock_2',
          clinicName: 'Town Hall Surgery',
          doctor: 'Nurse Practitioner Sarah',
          date: lastWeek.toISOString().split('T')[0],
          time: '09:00',
          reason: 'Blood Test Results',
          status: 'past'
        }
      ];
      AppointmentsPage.saveAppointments();
    }
  },

  saveAppointments: () => {
    localStorage.setItem('mock_appointments', JSON.stringify(AppointmentsPage.appointments));
  },

  populateClinicDropdown: () => {
    const select = document.getElementById('clinicSelect');
    // Keep placeholder
    select.innerHTML = '<option value="" disabled selected>Select a clinic...</option>';
    window.MOCK_CLINICS.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name} (${c.distance})</option>`;
    });
  },

  handleCancel: (id) => {
    if(confirm("Are you sure you want to cancel this appointment?")) {
      AppointmentsPage.appointments = AppointmentsPage.appointments.filter(a => a.id !== id);
      AppointmentsPage.saveAppointments();
      AppointmentsPage.renderFeed();
    }
  },

  renderFeed: () => {
    const feed = document.getElementById('appointmentsFeed');
    
    // Check if dates are technically past or upcoming dynamically instead of relying purely on status field
    // But for simplicity, we mock it using the status property or explicit date check
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Update statuses based on raw date compared to today
    AppointmentsPage.appointments = AppointmentsPage.appointments.map(a => {
      if (a.date < todayStr) a.status = 'past';
      else a.status = 'upcoming';
      return a;
    });
    AppointmentsPage.saveAppointments();

    const filtered = AppointmentsPage.appointments.filter(a => a.status === AppointmentsPage.activeTab);

    // Sort upcoming (nearest first), past (most recent first)
    filtered.sort((a, b) => {
      if (AppointmentsPage.activeTab === 'upcoming') {
         return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
      } else {
         return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
      }
    });

    if (filtered.length === 0) {
      feed.innerHTML = `
        <div class="card" style="padding: 48px; text-align: center; color: var(--text-muted);">
          <p>You have no ${AppointmentsPage.activeTab} appointments.</p>
        </div>
      `;
      if(window.lucide) lucide.createIcons();
      return;
    }

    feed.innerHTML = filtered.map(a => {
      // Format Date purely via JS
      const d = new Date(a.date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateFormatted = d.toLocaleDateString(undefined, options);

      // Convert 24h to 12h AM/PM
      const [h, m] = a.time.split(':');
      let hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      const timeStr = `${hour}:${m} ${ampm}`;

      const isUpcoming = a.status === 'upcoming';

      return `
        <div class="card appointment-card ${!isUpcoming ? 'past' : ''}">
          <div class="appt-header">
            <div>
              <div class="appt-date">
                <i data-lucide="calendar"></i>
                <span>${dateFormatted} at ${timeStr}</span>
              </div>
              <h3 style="font-size: 18px; font-weight: 700; margin-top: 8px;">${a.clinicName}</h3>
              <p style="color: var(--text-muted); font-size: 14px; margin-top: 2px;">
                With ${a.doctor}
              </p>
            </div>
            
            ${isUpcoming ? `
              <button class="btn btn-ghost" style="color: var(--danger); font-size: 13px;" onclick="AppointmentsPage.handleCancel('${a.id}')">
                Cancel
              </button>
            ` : `
              <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); background: var(--bg-main); padding: 4px 10px; border-radius: 12px;">
                Completed
              </span>
            `}
          </div>

          <div class="appt-details">
            <div class="appt-detail-item">
              <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
              <span>${a.reason}</span>
            </div>
            ${isUpcoming ? `
              <div class="appt-detail-item">
                <i data-lucide="clock" style="width: 16px; height: 16px;"></i>
                <span>Arrive 10 mins early</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) {
      lucide.createIcons();
    }
  }
};

// Initialize after DOM loads
document.addEventListener("DOMContentLoaded", AppointmentsPage.init);

