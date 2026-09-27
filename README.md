# Smart Fire Emergency Response System (PCCOE Pune)

> **Tagline:** AI + Real-Time Alerting for Faster & Smarter Action  
> **Academic Project:** Pimpri Chinchwad College of Engineering (PCCOE), Sector 26, Pradhikaran, Akurdi, Pune - 411044  
> **Prototype Version:** 1.0.0 (Working Prototype with Simulated Dispatch & Real-Time AI Dehazing)

---

## ⚠️ Important Safety Notice: Simulated Emergency Dispatch

> **Is this sending real SMS messages or calling actual 101 / 112 emergency services?**
>
> **NO.** In this prototype, all emergency transmissions, SMS notifications, and authority dispatches are **SAFELY SIMULATED** in the local software stack.
>
> 1. **Legal & Safety Protection:** Testing panic alarms against actual municipal emergency services (PCMC Fire Brigade 101, Police 112, Ambulance 108) without authorization is strictly prohibited by law.
> 2. **Local Persistence:** When you press SOS, the alert is created and saved in the backend REST API (`server/data/db.json`), updates the live emergency timeline, triggers the Web Audio siren synthesizer, and updates the Admin Command Center in real-time.
> 3. **Production Readiness:** The backend `server/index.js` has dedicated hooks where production SMS Gateways (e.g., Twilio, Fast2SMS, AWS SNS) and emergency REST APIs can be connected by simply providing API keys in `.env`.

---

## Architecture Overview

```
                          ┌────────────────────────┐
                          │   Client Application   │
                          │  (React 18 + Vite +    │
                          │   Tailwind CSS + Maps) │
                          └───────────┬────────────┘
                                      │ REST API / Polling
                                      ▼
                          ┌────────────────────────┐
                          │   Express REST Server  │
                          │      (Port 5000)       │
                          └───────────┬────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              ▼                       ▼                        ▼
    ┌──────────────────┐   ┌──────────────────────┐   ┌─────────────────┐
    │  JSON Database   │   │  Simulated Multi-    │   │  IoT Sensor     │
    │ (server/data/    │   │  Agency Dispatcher   │   │  Telemetry &    │
    │   db.json)       │   │  (Fire, Police, Hosp)│   │  PEAS Agent     │
    └──────────────────┘   └──────────────────────┘   └─────────────────┘
```

---

## Key Features & Pages

| Page | Route | Description |
|---|---|---|
| **Page 1: Device Authentication** | `/auth` | Device registration (`DEV-PCCOE-CAMPUS-702`), phone verification, and session storage. |
| **Page 2: Home Dashboard** | `/` | Prominent glowing **PRESS SOS** button, status badges, diagnostics, and module cards. |
| **Page 3: SOS Emergency** | `/sos` | Multi-agency dispatch timeline, live status progression, and emergency cancellation. |
| **Page 4: Emergency Contacts** | `/contacts` | Full CRUD directory for family, hostel wardens, security, and campus doctors. |
| **Page 5: Nearby Services** | `/services` | Leaflet interactive map with markers for PCMC Fire, Nigdi Police, and Star/YCM Hospitals. |
| **Page 6: AI Video Dehazing** | `/dehazing` | Real-time Dark Channel Prior (DCP) & CLAHE canvas filter processing with split before/after view. |
| **Page 7: Emergency Alarm** | `/alarm` | Native Web Audio API emergency siren synthesizer with strobe beacon and volume controls. |
| **Page 8: Safety Guidelines** | `/guidelines` | Searchable knowledge base featuring P.A.S.S. technique, evacuation routes, and burn first aid. |
| **Page 9: Admin Portal Login** | `/admin/login` | Secure administrator access (`admin` / `pccoe123`) with one-click demo autofill. |
| **Page 10: Admin Dashboard** | `/admin/dashboard` | Central command table with alert status transitions and CRUD for all services and guidelines. |
| **PEAS AI Agent Telemetry** | `/agent-telemetry` | PEAS model dashboard: Performance, Environment, Actuators, and Sensors. |

---

## Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 1. Install Dependencies
```bash
# In project root:
npm run install:all
```
Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start Backend Server
```bash
cd server
npm start
```
*Backend runs at `http://localhost:5000`*

### 3. Start Frontend Dev Server
```bash
cd client
npm run dev
```
*Frontend runs at `http://localhost:5173` (or `http://127.0.0.1:5173`)*

---

## Admin Credentials (Demo)

- **URL:** `http://localhost:5173/admin/login`
- **Username:** `admin`
- **Password:** `pccoe123`

---

## Connecting Real SMS / WhatsApp / Email Gateways in the Future

In [server/index.js](file:///e:/Smart%20Fire%20Emergency%20Response/server/index.js) around line 175 inside `POST /api/alerts`:

```javascript
// Example: Adding Twilio SMS integration
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function sendRealSms(phone, message) {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
}
```

---

## Connecting an External PyTorch/OpenCV AI GAN Dehazing Model

In [client/src/pages/AiVideoDehazingPage.jsx](file:///e:/Smart%20Fire%20Emergency%20Response/client/src/pages/AiVideoDehazingPage.jsx):
The canvas processor simulates the **Dark Channel Prior (He et al.)** and atmospheric light scattering equation:
$$J(x) = \frac{I(x) - A}{\max(t(x), t_0)} + A$$

To stream directly to a Python Flask / FastAPI microservice running an actual **AOD-Net** or **FFA-Net** model:
```javascript
const response = await fetch('http://localhost:8000/api/dehaze', {
  method: 'POST',
  body: formDataWithImageFrame
});
const dehazedBlob = await response.blob();
```
