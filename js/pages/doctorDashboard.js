const DoctorDashboard = {
  patients: [],

  init: () => {
    lucide.createIcons();
    DoctorDashboard.loadGreeting();
    DoctorDashboard.loadMockSchedule();
    DoctorDashboard.renderSchedule();
  },

  loadGreeting: () => {
    let user = Auth.getUser();
    let name = user ? user.name : "Doctor";
    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    const hour = new Date().getHours();
    let timeOfDay = "Morning";
    if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
    else if (hour >= 17) timeOfDay = "Evening";

    const greetingElement = document.getElementById('docGreeting');
    if(greetingElement) {
      greetingElement.innerText = `Good ${timeOfDay}, Dr. ${name}`;
    }
  },

  loadMockSchedule: () => {
    // Generate some functional mock interactions
    DoctorDashboard.patients = [
      { id: 'p1', name: "Eleanor Rigby", time: "09:00 AM", reason: "Follow up - Hypertension", status: "In Session", statusCode: "in" },
      { id: 'p2', name: "Mark Johnson", time: "09:30 AM", reason: "Routine Blood Test Results", status: "Waiting Room", statusCode: "wait" },
      { id: 'p3', name: "Sarah Connor", time: "10:15 AM", reason: "Migraine Consultation", status: "Waiting Room", statusCode: "wait" },
      { id: 'p4', name: "David Miller", time: "11:00 AM", reason: "Knee Pain", status: "Scheduled", statusCode: "scheduled" },
      { id: 'p5', name: "Alicia Keys", time: "11:45 AM", reason: "Vaccination", status: "Scheduled", statusCode: "scheduled" }
    ];
  },

  handlePatientAction: (id) => {
    // Simple state modification for demonstration
    const patientIndex = DoctorDashboard.patients.findIndex(p => p.id === id);
    if(patientIndex > -1) {
      const p = DoctorDashboard.patients[patientIndex];
      if (p.statusCode === 'wait') {
        p.statusCode = 'in';
        p.status = 'In Session';
        
        // Remove currently in-session patient intuitively
        DoctorDashboard.patients = DoctorDashboard.patients.map(pat => {
          if (pat.id !== id && pat.statusCode === 'in') {
            pat.statusCode = 'completed';
            pat.status = 'Completed';
          }
          return pat;
        });

      } else if (p.statusCode === 'in') {
        p.statusCode = 'completed';
        p.status = 'Completed';
      }
      DoctorDashboard.renderSchedule();
    }
  },

  renderSchedule: () => {
    const list = document.getElementById('patientList');
    if(!list) return;

    // Filter out completed for the main view
    const visiblePatients = DoctorDashboard.patients.filter(p => p.statusCode !== 'completed');

    if(visiblePatients.length === 0) {
       list.innerHTML = `
        <div style="padding: 32px; text-align: center; color: var(--text-muted);">
          All appointments for today have been completed.
        </div>
       `;
       return;
    }

    list.innerHTML = visiblePatients.map(p => {
      let badgeClass = '';
      if(p.statusCode === 'in') badgeClass = 'status-in';
      else if (p.statusCode === 'wait') badgeClass = 'status-waiting';
      else badgeClass = 'status-badge'; // fallback neutral styling defined inline loosely
      
      const badgeHtml = p.statusCode !== 'scheduled' ? 
        `<span class="status-badge ${badgeClass}">${p.status}</span>` : 
        `<span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">${p.status}</span>`;

      // Button rules
      let actionBtnHtml = '';
      if (p.statusCode === 'wait') {
        actionBtnHtml = `<button onclick="DoctorDashboard.handlePatientAction('${p.id}')" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">Call In</button>`;
      } else if (p.statusCode === 'in') {
        actionBtnHtml = `<button onclick="DoctorDashboard.handlePatientAction('${p.id}')" class="btn btn-ghost" style="border: 1px solid var(--border-light); padding: 6px 12px; font-size: 12px;">Conclude</button>`;
      }

      return `
        <div class="patient-item">
          <div class="patient-info">
            <h4>${p.name}</h4>
            <p>
              <i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${p.time} • ${p.reason}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            ${badgeHtml}
            <div style="min-width: 80px; text-align: right;">
               ${actionBtnHtml}
            </div>
          </div>
        </div>
      `;
    }).join("");

    lucide.createIcons();

    // Update dynamic stats array
    const waitCount = visiblePatients.filter(p => p.statusCode === 'wait').length;
    document.getElementById('statWaitList').innerText = waitCount;
    document.getElementById('statPatients').innerText = visiblePatients.length;
  }
};

window.DoctorDashboard = DoctorDashboard;
