const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read DB
function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return {
      users: [],
      emergencyContacts: [],
      fireServices: [],
      policeStations: [],
      hospitals: [],
      emergencyAlerts: [],
      guidelines: []
    };
  }
}

// Helper function to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Smart Fire Emergency Response Backend (PCCOE)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==========================================
// AUTHENTICATION
// ==========================================

// POST /api/auth/authenticate - Device & User Verification
app.post('/api/auth/authenticate', (req, res) => {
  const { deviceId, name, phone } = req.body;
  if (!deviceId || !name || !phone) {
    return res.status(400).json({ error: 'Device ID, User Name, and Phone are required' });
  }

  const db = readDb();
  let user = db.users.find(u => u.deviceId === deviceId || u.phone === phone);

  if (!user) {
    user = {
      id: `usr-${uuidv4().substring(0, 8)}`,
      name,
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@pccoe.edu.in`,
      deviceId,
      role: 'user',
      authenticated: true,
      lastAuthenticated: new Date().toISOString()
    };
    db.users.push(user);
    writeDb(db);
  } else {
    user.authenticated = true;
    user.name = name;
    user.lastAuthenticated = new Date().toISOString();
    writeDb(db);
  }

  res.json({
    success: true,
    message: 'Device and User Authenticated successfully',
    user,
    token: `pccoe-token-${Date.now()}`
  });
});

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Demo admin credentials for PCCOE prototype
  if (username === 'admin' && password === 'pccoe123') {
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      admin: {
        id: 'adm-001',
        name: 'Chief Emergency Officer (PCCOE)',
        role: 'SUPER_ADMIN',
        permissions: ['all']
      },
      token: `admin-token-${Date.now()}`
    });
  }
  return res.status(401).json({ error: 'Invalid credentials. For demo, use: admin / pccoe123' });
});

// ==========================================
// USERS
// ==========================================
app.get('/api/users', (req, res) => {
  const db = readDb();
  res.json(db.users);
});

// ==========================================
// EMERGENCY CONTACTS
// ==========================================
app.get('/api/contacts', (req, res) => {
  const db = readDb();
  res.json(db.emergencyContacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, phone, relationship, priority = 'High', userId = 'usr-pccoe-001' } = req.body;
  if (!name || !phone || !relationship) {
    return res.status(400).json({ error: 'Name, phone, and relationship are required' });
  }

  const db = readDb();
  const newContact = {
    id: `cnt-${uuidv4().substring(0, 8)}`,
    userId,
    name,
    phone,
    relationship,
    priority
  };
  db.emergencyContacts.push(newContact);
  writeDb(db);
  res.status(201).json(newContact);
});

app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.emergencyContacts.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  db.emergencyContacts[index] = { ...db.emergencyContacts[index], ...req.body };
  writeDb(db);
  res.json(db.emergencyContacts[index]);
});

app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const filtered = db.emergencyContacts.filter(c => c.id !== id);
  if (filtered.length === db.emergencyContacts.length) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  db.emergencyContacts = filtered;
  writeDb(db);
  res.json({ success: true, message: 'Contact deleted successfully' });
});

// ==========================================
// EMERGENCY SERVICES
// ==========================================

// Fire Services
app.get('/api/fire-services', (req, res) => {
  const db = readDb();
  res.json(db.fireServices);
});

app.post('/api/fire-services', (req, res) => {
  const db = readDb();
  const newService = {
    id: `fire-${uuidv4().substring(0, 8)}`,
    ...req.body
  };
  db.fireServices.push(newService);
  writeDb(db);
  res.status(201).json(newService);
});

app.put('/api/fire-services/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.fireServices.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Fire service not found' });
  db.fireServices[index] = { ...db.fireServices[index], ...req.body };
  writeDb(db);
  res.json(db.fireServices[index]);
});

app.delete('/api/fire-services/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.fireServices = db.fireServices.filter(s => s.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Fire service removed' });
});

// Police Stations
app.get('/api/police-stations', (req, res) => {
  const db = readDb();
  res.json(db.policeStations);
});

app.post('/api/police-stations', (req, res) => {
  const db = readDb();
  const newStation = {
    id: `pol-${uuidv4().substring(0, 8)}`,
    ...req.body
  };
  db.policeStations.push(newStation);
  writeDb(db);
  res.status(201).json(newStation);
});

app.put('/api/police-stations/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.policeStations.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Police station not found' });
  db.policeStations[index] = { ...db.policeStations[index], ...req.body };
  writeDb(db);
  res.json(db.policeStations[index]);
});

app.delete('/api/police-stations/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.policeStations = db.policeStations.filter(s => s.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Police station removed' });
});

// Hospitals
app.get('/api/hospitals', (req, res) => {
  const db = readDb();
  res.json(db.hospitals);
});

app.post('/api/hospitals', (req, res) => {
  const db = readDb();
  const newHosp = {
    id: `hosp-${uuidv4().substring(0, 8)}`,
    ...req.body
  };
  db.hospitals.push(newHosp);
  writeDb(db);
  res.status(201).json(newHosp);
});

app.put('/api/hospitals/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.hospitals.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Hospital not found' });
  db.hospitals[index] = { ...db.hospitals[index], ...req.body };
  writeDb(db);
  res.json(db.hospitals[index]);
});

app.delete('/api/hospitals/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.hospitals = db.hospitals.filter(s => s.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Hospital removed' });
});

// ==========================================
// EMERGENCY ALERTS (SOS WORKFLOW)
// ==========================================
app.get('/api/alerts', (req, res) => {
  const db = readDb();
  // Sort descending by timestamp
  const alerts = [...db.emergencyAlerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(alerts);
});

app.get('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const alert = db.emergencyAlerts.find(a => a.id === id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// POST /api/alerts - Creates SOS emergency alert and simulates immediate multi-agency dispatch
app.post('/api/alerts', (req, res) => {
  const {
    userId = 'usr-pccoe-001',
    userName = 'Prof. Rajesh Deshmukh',
    userPhone = '+91 98230 45678',
    emergencyType = 'Fire Emergency',
    location = 'PCCOE Campus, Sector 26, Pradhikaran, Akurdi, Pune - 411044',
    latitude = 18.6517,
    longitude = 73.7615,
    severity = 'CRITICAL'
  } = req.body;

  const db = readDb();
  const now = new Date();
  const timeString = now.toLocaleTimeString();

  // Pick top contacts and nearby services to notify
  const contactsToNotify = db.emergencyContacts.map(c => c.name);
  const servicesToNotify = [
    { name: db.fireServices[0]?.name || 'PCMC Fire Akurdi', type: 'Fire Brigade', time: timeString, status: 'DISPATCHED' },
    { name: db.policeStations[0]?.name || 'Nigdi Police Station', type: 'Police', time: timeString, status: 'ALERTED' },
    { name: db.hospitals[0]?.name || 'Star Multispeciality Hospital', type: 'Hospital / Ambulance', time: timeString, status: 'STANDBY' }
  ];

  const newAlert = {
    id: `ALT-${now.getFullYear()}${String(now.getMonth()+1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${uuidv4().substring(0, 4).toUpperCase()}`,
    userId,
    userName,
    userPhone,
    emergencyType,
    location,
    latitude,
    longitude,
    timestamp: now.toISOString(),
    status: 'ACTIVE',
    severity,
    dispatchPhase: 'DISPATCHED',
    notifiedContacts: contactsToNotify,
    notifiedServices: servicesToNotify,
    timeline: [
      { step: 'USER_IN_DANGER', title: 'User In Danger Detected', time: timeString, completed: true },
      { step: 'PRESS_SOS', title: 'Emergency SOS Triggered', time: timeString, completed: true },
      { step: 'ALERT_SENT', title: 'Central AI Command Alert Sent', time: timeString, completed: true },
      { step: 'CONTACTS_NOTIFIED', title: 'Family & Emergency Contacts Alerted', time: timeString, completed: true },
      { step: 'SERVICES_DISPATCHED', title: 'Akurdi Fire, Nigdi Police & Ambulance Dispatched', time: timeString, completed: true },
      { step: 'RESPONDING', title: 'Emergency Response Team En Route', time: 'In Progress...', completed: false },
      { step: 'HELP_REACHED', title: 'First Responders on Scene', time: 'Awaiting Arrival', completed: false }
    ]
  };

  db.emergencyAlerts.unshift(newAlert);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: '🚨 Emergency SOS Dispatched to all agencies and contacts',
    alert: newAlert
  });
});

app.put('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.emergencyAlerts.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Alert not found' });

  db.emergencyAlerts[index] = {
    ...db.emergencyAlerts[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  if (req.body.status === 'RESOLVED' && !db.emergencyAlerts[index].resolvedAt) {
    db.emergencyAlerts[index].resolvedAt = new Date().toISOString();
  }

  writeDb(db);
  res.json(db.emergencyAlerts[index]);
});

app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.emergencyAlerts = db.emergencyAlerts.filter(a => a.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Alert deleted' });
});

// ==========================================
// GUIDELINES
// ==========================================
app.get('/api/guidelines', (req, res) => {
  const db = readDb();
  res.json(db.guidelines);
});

app.post('/api/guidelines', (req, res) => {
  const { title, category, content, importance = 'MEDIUM' } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ error: 'Title, category, and content are required' });
  }
  const db = readDb();
  const newGuide = {
    id: `gdl-${uuidv4().substring(0, 8)}`,
    title,
    category,
    content,
    importance
  };
  db.guidelines.push(newGuide);
  writeDb(db);
  res.status(201).json(newGuide);
});

app.put('/api/guidelines/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.guidelines.findIndex(g => g.id === id);
  if (index === -1) return res.status(404).json({ error: 'Guideline not found' });
  db.guidelines[index] = { ...db.guidelines[index], ...req.body };
  writeDb(db);
  res.json(db.guidelines[index]);
});

app.delete('/api/guidelines/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.guidelines = db.guidelines.filter(g => g.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Guideline removed' });
});

// ==========================================
// AI AGENT TELEMETRY & PEAS ARCHITECTURE
// ==========================================
app.get('/api/agent/telemetry', (req, res) => {
  // Generates live simulated sensor readings for the PEAS architecture
  const now = new Date();
  const baseSmoke = 65; // ppm
  const baseTemp = 28.5; // °C
  
  // Random slight variations to simulate active IoT sensors
  const smokePpm = Math.floor(baseSmoke + Math.random() * 15);
  const tempCelsius = Number((baseTemp + (Math.random() * 2 - 1)).toFixed(1));
  const humidity = Math.floor(58 + Math.random() * 6);

  res.json({
    agentName: "Smart Fire Emergency Response Agent (PCCOE)",
    peas: {
      performance: [
        { metric: "Detection Accuracy", value: "96.4%", target: ">95%" },
        { metric: "Time-to-Alert", value: "1.2s", target: "<3.0s" },
        { metric: "False Alarm Rate", value: "1.8%", target: "<3.0%" },
        { metric: "Campus Coverage", value: "98.2%", target: ">95%" },
        { metric: "Emergency Dispatch Latency", value: "2.4s", target: "<5.0s" }
      ],
      environment: {
        type: "PCCOE Campus Academic & Hostel Blocks (Sector 26, Akurdi)",
        riskLevel: "NORMAL",
        ambientTemperature: `${tempCelsius}°C`,
        smokePpm: `${smokePpm} ppm (Safe < 100 ppm)`,
        ambientHumidity: `${humidity}%`,
        connectedSensors: 48,
        activeCCTVs: 32
      },
      actuators: [
        { name: "Emergency Siren Horn", status: "STANDBY", autoTrigger: true },
        { name: "Push & SMS Notification Gateway", status: "READY", latency: "420ms" },
        { name: "PCMC Authority Dispatch API", status: "CONNECTED", ping: "28ms" },
        { name: "Campus PA Evacuation Broadcast", status: "READY", autoTrigger: false },
        { name: "Automated Water Sprinkler Solenoids", status: "MONITORED", autoTrigger: true }
      ],
      sensors: [
        { name: "Optical Smoke Sensors (MQ-2/MQ-135)", status: "ONLINE", value: `${smokePpm} ppm`, threshold: "250 ppm" },
        { name: "Infrared Thermal & Flame Detectors", status: "ONLINE", value: "No Flame", threshold: "65°C" },
        { name: "DHT22 Temperature & Humidity Array", status: "ONLINE", value: `${tempCelsius}°C / ${humidity}%`, threshold: "50°C" },
        { name: "CCTV AI Video Smoke & Fire Vision", status: "STREAMING", fps: "30 FPS", dehazing: "ENGAGED" },
        { name: "Mobile GPS / Device Location Anchor", status: "LOCKED", coords: "18.6517° N, 73.7615° E", accuracy: "±3m" },
        { name: "User Manual SOS Panic Button", status: "ARMED", priority: "IMMEDIATE" }
      ]
    },
    systemTime: now.toISOString()
  });
});

// POST /api/reset-demo - Clears active alerts and restores default clean state for teacher presentations
app.post('/api/reset-demo', (req, res) => {
  const db = readDb();
  // Mark all alerts as RESOLVED
  db.emergencyAlerts = db.emergencyAlerts.map(a => ({
    ...a,
    status: 'RESOLVED',
    resolvedAt: a.resolvedAt || new Date().toISOString()
  }));
  writeDb(db);
  res.json({
    success: true,
    message: 'Demo state refreshed: All active emergencies cleared for teacher presentation.'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🔥 Smart Fire Emergency Response Server`);
  console.log(`📍 PCCOE Akurdi, Pune - AI Prototype API`);
  console.log(`🚀 Running at http://localhost:${PORT}`);
  console.log(`====================================================`);
});
