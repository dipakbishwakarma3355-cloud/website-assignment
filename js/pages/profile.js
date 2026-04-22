const ProfilePage = {
  init: () => {
    Layout.renderPatientLayout('profile');
    lucide.createIcons();
    
    ProfilePage.loadUserData();

    // Attach Save Form event
    const form = document.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        ProfilePage.saveUserData();
      });
    }
  },

  loadUserData: () => {
    let user = Auth.getUser();
    
    // In a real app we'd load this from an API. We'll simulate loading extended data or default to the auth payload.
    const extProfileStorage = localStorage.getItem('profile_ext_' + (user?.id || 'guest'));
    const extendedData = extProfileStorage ? JSON.parse(extProfileStorage) : {};

    const firstName = extendedData.firstName || (user ? user.name : 'Jane');
    const lastName = extendedData.lastName || 'Doe';
    const email = extendedData.email || (user ? user.email : 'jane.doe@example.com');
    const phone = extendedData.phone || '';

    // Update Header Display
    document.getElementById('displayName').innerText = `${firstName} ${lastName}`;
    document.getElementById('profileInitials').innerText = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

    // Input fields
    document.getElementById('firstName').value = firstName;
    document.getElementById('lastName').value = lastName;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;

    // Preferences
    document.getElementById('prefEmail').checked = extendedData.prefEmail !== undefined ? extendedData.prefEmail : true;
    document.getElementById('prefSMS').checked = extendedData.prefSMS !== undefined ? extendedData.prefSMS : false;
  },

  saveUserData: () => {
    const defaultUser = Auth.getUser();
    const saveId = defaultUser ? defaultUser.id : 'guest';
    
    const dataToSave = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      prefEmail: document.getElementById('prefEmail').checked,
      prefSMS: document.getElementById('prefSMS').checked
    };

    localStorage.setItem('profile_ext_' + saveId, JSON.stringify(dataToSave));

    // Optional visual feedback
    const btn = document.getElementById('saveBtn');
    const origText = btn.innerText;
    btn.innerText = "Saved Successfully!";
    btn.style.background = "var(--success)";
    
    // Re-render header fields
    document.getElementById('displayName').innerText = `${dataToSave.firstName} ${dataToSave.lastName}`;
    document.getElementById('profileInitials').innerText = dataToSave.firstName.charAt(0).toUpperCase() + dataToSave.lastName.charAt(0).toUpperCase();

    setTimeout(() => {
      btn.innerText = origText;
      btn.style.background = ""; // Reset to CSS class default
    }, 2000);
  }
};

document.addEventListener("DOMContentLoaded", ProfilePage.init);
