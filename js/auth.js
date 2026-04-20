const Auth = {
  isAuthenticated: () => {
    return localStorage.getItem('auth_user') !== null;
  },

  getUser: () => {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  login: (email, role) => {
    const user = {
      id: "u_" + Date.now(),
      email,
      role: role || 'patient',
      name: email.split('@')[0],
      verified: true
    };
    localStorage.setItem('auth_user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    window.location.href = '../auth/login.html';
  },

  requireAuth: (allowedRoles = ['patient', 'doctor']) => {
    if (!Auth.isAuthenticated()) {
      window.location.href = '../auth/login.html';
      return false;
    }
    const user = Auth.getUser();
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 'doctor') {
        window.location.href = '../dashboard/doctor-dashboard.html';
      } else {
        window.location.href = '../main/index.html';
      }
      return false;
    }
    return true;
  }
};

window.Auth = Auth;
