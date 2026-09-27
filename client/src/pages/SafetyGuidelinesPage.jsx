import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Flame, 
  Heart, 
  DoorOpen, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  Printer,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const FALLBACK_GUIDELINES = [
  {
    id: "gdl-001",
    title: "Immediate Actions Upon Fire Discovery",
    category: "Fire Safety Tips",
    importance: "CRITICAL",
    content: "1. Stay calm and alert others loudly: Shout 'FIRE! FIRE!'\n2. Pull the nearest manual fire alarm call point immediately.\n3. Evacuate through designated staircases—NEVER use lifts or elevators.\n4. Call Fire Brigade at 101 or press SOS on this system.\n5. If safe and trained, attempt small fires using appropriate extinguishers."
  },
  {
    id: "gdl-002",
    title: "The P.A.S.S. Technique for Fire Extinguishers",
    category: "Fire Safety Tips",
    importance: "HIGH",
    content: "P - PULL the safety pin at the top of the extinguisher.\nA - AIM the nozzle low, pointing at the base of the fire, not the flames.\nS - SQUEEZE the handle slowly and evenly to release extinguishing agent.\nS - SWEEP the nozzle from side to side across the base until completely extinguished."
  },
  {
    id: "gdl-003",
    title: "Crawling Under Heavy Smoke (Low-Crawl)",
    category: "Evacuation Instructions",
    importance: "CRITICAL",
    content: "1. Toxic hot smoke and deadly carbon monoxide rise to the ceiling.\n2. Cleaner, cooler breathable air remains in the bottom 30-60 cm zone above floor.\n3. Drop to your hands and knees and crawl towards the emergency exit.\n4. Cover your mouth and nose with a damp cloth if available.\n5. Feel doors with back of your hand before turning handles."
  },
  {
    id: "gdl-004",
    title: "First Aid for Thermal & Fire Burns",
    category: "First Aid",
    importance: "CRITICAL",
    content: "1. COOL the burn immediately under gentle, cool running tap water for at least 10-20 minutes.\n2. DO NOT use ice, iced water, butter, toothpaste, turmeric, or greasy ointments.\n3. Carefully remove rings, belts, and tight jewelry before swelling begins.\n4. Do NOT pop blisters or peel burned skin.\n5. Cover loosely with sterile cling film or clean dry non-fluffy cloth and seek urgent medical help."
  },
  {
    id: "gdl-005",
    title: "Smoke Inhalation & Carbon Monoxide Protocol",
    category: "First Aid",
    importance: "HIGH",
    content: "1. Move victim immediately to fresh, outdoor air.\n2. Loosen tight collars, ties, belts, and obstructive clothing.\n3. If breathing is labored, sit them upright. If unconscious but breathing, place in recovery position.\n4. If unconscious and not breathing, begin CPR immediately (30 chest compressions : 2 breaths).\n5. Administer 100% humidified oxygen as soon as medical responders arrive."
  },
  {
    id: "gdl-006",
    title: "Stop, Drop, and Roll (If Clothes Catch Fire)",
    category: "Emergency Rules",
    importance: "CRITICAL",
    content: "1. STOP immediately—running fans oxygen to the flames and worsens burns.\n2. DROP to the floor and cover your face with your hands to protect eyes and airways.\n3. ROLL back and forth repeatedly to smother the flames against the ground.\n4. If someone else is on fire, wrap them in a heavy fire blanket, woolen coat, or rug."
  },
  {
    id: "gdl-007",
    title: "PCCOE Campus Evacuation Assembly Points",
    category: "Evacuation Instructions",
    importance: "HIGH",
    content: "1. Primary Assembly Point A: PCCOE Central Sports Ground (Opposite Main Admin Building).\n2. Secondary Assembly Point B: Lawn area behind Architecture & MBA Block.\n3. Do not re-enter any academic building until PCMC Fire Chief declares the all-clear.\n4. Class representatives and floor wardens must conduct head counts."
  },
  {
    id: "gdl-008",
    title: "Chemical Fire & Electrical Fire Precautions",
    category: "Fire Safety Tips",
    importance: "HIGH",
    content: "1. Class C / Electrical Fire: NEVER use water! Cut main electrical breaker, then use CO2 or ABC Dry Chemical Powder.\n2. Class B / Flammable Liquids: Smother using foam or dry chemical. Never throw water (causes explosive boilover).\n3. In labs, immediately trigger chemical fume hoods to isolate airborne toxins."
  },
  {
    id: "gdl-009",
    title: "Trapped in a Smoke-Filled Room",
    category: "Emergency Rules",
    importance: "CRITICAL",
    content: "1. Close the door between you and the fire.\n2. Block door cracks and vents with wet towels, blankets, or clothes to seal off smoke.\n3. Dial 101 / press SOS and inform exact room number (e.g. PCCOE Tech Bldg Room 304).\n4. Signal from a window using a flashlight or bright colored cloth. Only open window slightly if smoke is outside."
  },
  {
    id: "gdl-010",
    title: "Post-Emergency Recovery & Incident Reporting",
    category: "Emergency Rules",
    importance: "MEDIUM",
    content: "1. Report all injuries, even minor smoke irritation, to the on-site emergency triage team.\n2. Document incident timeline and submit report to PCCOE Disaster Management Cell.\n3. Replace discharged fire extinguishers and reset optical detectors immediately.\n4. Participate in post-incident safety debriefing."
  }
];

export default function SafetyGuidelinesPage() {
  const [guidelines, setGuidelines] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchGuidelines = () => {
    setLoading(true);
    fetch('/api/guidelines')
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGuidelines(data);
        } else {
          setGuidelines(FALLBACK_GUIDELINES);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Using fallback safety guidelines:', err);
        setGuidelines(FALLBACK_GUIDELINES);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Protocols', icon: BookOpen },
    { id: 'Fire Safety Tips', label: 'Fire Safety', icon: Flame },
    { id: 'First Aid', label: 'First Aid', icon: Heart },
    { id: 'Evacuation Instructions', label: 'Evacuation', icon: DoorOpen },
    { id: 'Emergency Rules', label: 'Rules & Drills', icon: AlertTriangle }
  ];

  const filtered = guidelines.filter((g) => {
    const matchesCat = category === 'ALL' || g.category === category;
    const matchesSearch =
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id, title, content) => {
    const textToCopy = `${title}\n\n${content}\n\n[PCCOE Campus Safety Protocol]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to format steps or P.A.S.S. items
  const renderFormattedContent = (content) => {
    const lines = content.split('\n').filter(Boolean);
    const isStepList = lines.some((l) => /^[0-9]+\.\s|^[A-Z]\s-\s/.test(l.trim()));

    if (!isStepList) {
      return (
        <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
          {content}
        </p>
      );
    }

    return (
      <div className="space-y-2 font-sans">
        {lines.map((line, idx) => {
          const passMatch = line.match(/^([P|A|S])\s-\s(.*)$/i);
          const numMatch = line.match(/^([0-9]+)\.\s(.*)$/);

          if (passMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center justify-center shrink-0">
                  {passMatch[1].toUpperCase()}
                </span>
                <span className="text-xs text-slate-300 pt-0.5 leading-snug">
                  {passMatch[2]}
                </span>
              </div>
            );
          }

          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {numMatch[1]}
                </span>
                <span className="text-xs text-slate-300 leading-relaxed">
                  {numMatch[2]}
                </span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs text-slate-300 pl-7 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 print:bg-white print:text-black print:p-0">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800 print:border-b-2 print:border-black">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 print:hidden">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight print:text-black">
                Fire Safety & First Aid Guidelines
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
              Standard operating procedures, burn triage protocols, and PCCOE campus evacuation routes.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition text-xs flex items-center gap-1.5"
              title="Print guidelines for drills"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print SOP</span>
            </button>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search instructions..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            const count = cat.id === 'ALL' 
              ? guidelines.length 
              : guidelines.filter(g => g.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  active ? 'bg-emerald-700/60 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CRITICAL ACTIONS HIGHLIGHT CARD */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 print:bg-white print:border print:border-black">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-black" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider print:text-black">
              Golden Rules in a Fire Emergency
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <strong className="text-red-400 block mb-1 font-bold print:text-red-700">1. NEVER USE LIFTS</strong>
              Electrical shafts funnel toxic smoke and power can cut out instantly, trapping occupants inside.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <strong className="text-amber-400 block mb-1 font-bold print:text-amber-700">2. CRAWL LOW UNDER SMOKE</strong>
              Deadly carbon monoxide rises. Cooler, breathable oxygen remains in the bottom 30cm near floor.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <strong className="text-emerald-400 block mb-1 font-bold print:text-emerald-700">3. WATER ON BURNS ONLY</strong>
              Cool burns under gentle running tap water for 10-20 min. Never apply ice, toothpaste, or butter.
            </div>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-24 bg-slate-800 rounded"></div>
                  <div className="h-3 w-16 bg-slate-800 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-slate-800 rounded"></div>
                <div className="h-20 bg-slate-950/60 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Guidelines Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No emergency protocols match "{searchTerm}". Try another search term or switch categories.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setCategory('ALL'); }}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* GUIDELINES LIST */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filtered.map((item) => {
              let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
              if (item.importance === 'CRITICAL') {
                badgeColor = 'bg-red-950/80 text-red-400 border-red-500/40 font-bold';
              } else if (item.importance === 'HIGH') {
                badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-500/40 font-bold';
              } else if (item.importance === 'MEDIUM') {
                badgeColor = 'bg-blue-950/80 text-blue-400 border-blue-500/40 font-bold';
              }

              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group print:bg-white print:border-slate-300 print:text-black"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700">
                        {item.category}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded border ${badgeColor} print:border-black print:text-black`}>
                        {item.importance || 'NORMAL'}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-3 leading-snug print:text-black">
                      {item.title}
                    </h3>

                    <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-900 print:bg-slate-50 print:border-slate-200">
                      {renderFormattedContent(item.content)}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 print:border-slate-300">
                    <span className="print:text-slate-700">PCCOE Campus Safety Protocol</span>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(item.id, item.title, item.content)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition print:hidden"
                        title="Copy guideline text"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 group-hover:text-slate-300" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <span className="text-emerald-400 font-semibold flex items-center gap-1 print:text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
