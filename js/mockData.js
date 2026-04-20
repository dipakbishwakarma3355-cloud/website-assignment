const MOCK_CLINICS = [
  { id: "c1", name: "Riverside Medical Practice", address: "12 River Road", distance: "0.5 miles", isOpen: true },
  { id: "c2", name: "Oak Tree Health Centre", address: "45 Oak Lane", distance: "1.2 miles", isOpen: true },
  { id: "c3", name: "St. John's Clinic", address: "High Street", distance: "2.5 miles", isOpen: false },
  { id: "c4", name: "Town Hall Surgery", address: "Market Square", distance: "0.8 miles", isOpen: true },
];

const MOCK_UPDATES = [
  {
    id: "update1",
    clinicId: "c1",
    type: "slot_available",
    message: "Just cancelled my 2:30 PM slot! Call them now.",
    reportedBy: "Sarah M.",
    userVerified: true,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    upvotes: 4,
  },
  {
    id: "update2",
    clinicId: "c2",
    type: "system_down",
    message: "Phone lines are currently down. They said to walk-in if urgent.",
    reportedBy: "David K.",
    userVerified: true,
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    upvotes: 12,
  },
  {
    id: "update3",
    clinicId: "c4",
    type: "delay",
    message: "Running about 45 minutes behind schedule today.",
    reportedBy: "Anonymous",
    userVerified: false,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    upvotes: 2,
  },
  {
    id: "update4",
    clinicId: "c1",
    type: "cancellation",
    message: "They have 3 more on-the-day slots just opened up for this afternoon.",
    reportedBy: "Dr. Evans (Admin)",
    userVerified: true,
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    upvotes: 25,
  }
];

// Export to global scope
window.MOCK_CLINICS = MOCK_CLINICS;
window.MOCK_UPDATES = MOCK_UPDATES;
