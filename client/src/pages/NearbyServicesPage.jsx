import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Building2, 
  Phone, 
  Navigation, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Compass, 
  Activity, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAlert } from '../context/AlertContext';

// Fix Leaflet default icon bug with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom emergency markers
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">${symbol}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const pccoeIcon = createCustomIcon('#EF4444', '📍');
const fireIcon = createCustomIcon('#DC2626', '🔥');
const policeIcon = createCustomIcon('#2563EB', '🚓');
const hospitalIcon = createCustomIcon('#059669', '🏥');

export default function NearbyServicesPage() {
  const { addToast } = useAlert();
  const [activeTab, setActiveTab] = useState('all'); // all | fire | police | hospital
  const [fireServices, setFireServices] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const pccoeCoords = [18.6517, 73.7615];

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const [fRes, pRes, hRes] = await Promise.all([
          fetch('/api/fire-services'),
          fetch('/api/police-stations'),
          fetch('/api/hospitals')
        ]);
        if (fRes.ok) setFireServices(await fRes.json());
        if (pRes.ok) setPoliceStations(await pRes.json());
        if (hRes.ok) setHospitals(await hRes.json());
      } catch (e) {
        console.warn('Could not fetch services, using fallback data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllServices();
  }, []);

  const handleCall = (service) => {
    addToast(`📞 Calling ${service.name} (${service.phone || service.emergencyNumber})...`, 'info', 4000);
  };

  const handleDirections = (service) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=18.6517,73.7615&destination=${service.latitude},${service.longitude}`;
    window.open(url, '_blank');
    addToast(`📍 Opening navigation route to ${service.name}`, 'info', 3000);
  };

  const filteredItems = () => {
    let items = [];
    if (activeTab === 'all' || activeTab === 'fire') {
      items = [...items, ...fireServices.map(s => ({ ...s, serviceCategory: 'fire' }))];
    }
    if (activeTab === 'all' || activeTab === 'police') {
      items = [...items, ...policeStations.map(s => ({ ...s, serviceCategory: 'police' }))];
    }
    if (activeTab === 'all' || activeTab === 'hospital') {
      items = [...items, ...hospitals.map(s => ({ ...s, serviceCategory: 'hospital' }))];
    }
    return items;
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Nearby Emergency Services
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Geolocated emergency stations around PCCOE (Pimpri Chinchwad, Sector 26, Akurdi, Pune)
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (15)
            </button>
            <button
              onClick={() => setActiveTab('fire')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'fire' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Fire ({fireServices.length})
            </button>
            <button
              onClick={() => setActiveTab('police')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'police' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Police ({policeStations.length})
            </button>
            <button
              onClick={() => setActiveTab('hospital')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'hospital' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Hospitals ({hospitals.length})
            </button>
          </div>
        </div>

        {/* INTERACTIVE LEAFLET MAP SECTION */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Interactive Incident & Agency Map (PCCOE Sector 26 Pune)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              GPS Locked: 18.6517° N, 73.7615° E
            </span>
          </div>

          <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 relative z-0">
            <MapContainer
              center={pccoeCoords}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* PCCOE Campus Marker */}
              <Marker position={pccoeCoords} icon={pccoeIcon}>
                <Popup>
                  <div className="text-slate-900 font-sans p-1">
                    <strong className="text-red-600 block font-bold text-sm">📍 PCCOE Campus (Your Location)</strong>
                    <span className="text-xs text-slate-600">Sector 26, Pradhikaran, Akurdi, Pune</span>
                    <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Central Emergency Hub</div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={pccoeCoords}
                radius={2000}
                pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.08 }}
              />

              {/* Fire Stations Markers */}
              {(activeTab === 'all' || activeTab === 'fire') &&
                fireServices.map((fs) => (
                  <Marker key={fs.id} position={[fs.latitude, fs.longitude]} icon={fireIcon}>
                    <Popup>
                      <div className="text-slate-900 font-sans p-1">
                        <strong className="text-red-600 font-bold block text-sm">🔥 {fs.name}</strong>
                        <span className="text-xs text-slate-600">{fs.location}</span>
                        <div className="mt-1 text-xs">Distance: <strong>{fs.distance}</strong></div>
                        <div className="text-xs text-slate-700">Phone: {fs.phone}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              {/* Police Stations Markers */}
              {(activeTab === 'all' || activeTab === 'police') &&
                policeStations.map((ps) => (
                  <Marker key={ps.id} position={[ps.latitude, ps.longitude]} icon={policeIcon}>
                    <Popup>
                      <div className="text-slate-900 font-sans p-1">
                        <strong className="text-blue-600 font-bold block text-sm">🚓 {ps.name}</strong>
                        <span className="text-xs text-slate-600">{ps.location}</span>
                        <div className="mt-1 text-xs">Distance: <strong>{ps.distance}</strong></div>
                        <div className="text-xs text-slate-700">Phone: {ps.phone}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              {/* Hospital Markers */}
              {(activeTab === 'all' || activeTab === 'hospital') &&
                hospitals.map((hp) => (
                  <Marker key={hp.id} position={[hp.latitude, hp.longitude]} icon={hospitalIcon}>
                    <Popup>
                      <div className="text-slate-900 font-sans p-1">
                        <strong className="text-emerald-600 font-bold block text-sm">🏥 {hp.name}</strong>
                        <span className="text-xs text-slate-600">{hp.location}</span>
                        <div className="mt-1 text-xs">Distance: <strong>{hp.distance}</strong></div>
                        <div className="text-xs text-emerald-700 font-semibold">Burn Unit: {hp.burnUnit}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600"></span> PCCOE Location
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-700"></span> Fire Stations (101)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span> Police Stations (112)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Hospitals (108)
            </span>
          </div>
        </div>

        {/* SERVICES CARDS DIRECTORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems().map((service) => {
            let catColor = 'text-red-400 border-red-500/30 bg-red-500/10';
            let catIcon = <Flame className="w-5 h-5" />;
            let catLabel = 'Fire Station';

            if (service.serviceCategory === 'police') {
              catColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
              catIcon = <ShieldAlert className="w-5 h-5" />;
              catLabel = 'Police Station';
            } else if (service.serviceCategory === 'hospital') {
              catColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
              catIcon = <Building2 className="w-5 h-5" />;
              catLabel = 'Hospital / ICU';
            }

            return (
              <div
                key={service.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${catColor}`}>
                        {catIcon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {catLabel}
                        </span>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {service.status || 'Available'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-start gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{service.location}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 my-2 border-y border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">DISTANCE</span>
                      <span className="text-slate-200 font-bold">{service.distance}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DIRECT PHONE</span>
                      <span className="text-slate-200">{service.phone}</span>
                    </div>
                    {service.burnUnit && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px]">BURN FACILITY</span>
                        <span className="text-emerald-400 font-semibold">{service.burnUnit}</span>
                      </div>
                    )}
                    {service.vehiclesAvailable && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px]">EQUIPMENT</span>
                        <span className="text-amber-400">{service.vehiclesAvailable} Fire Engines on alert</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                  <button
                    onClick={() => handleCall(service)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CALL</span>
                  </button>
                  <button
                    onClick={() => handleDirections(service)}
                    className="py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600 hover:text-white text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-red-500/30 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>DIRECTIONS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
