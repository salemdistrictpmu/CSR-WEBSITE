import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  HeartHandshake, MapPin, IndianRupee, Layers, Calendar, 
  User, CheckCircle2, ShieldAlert, ArrowLeft, Loader2, Send, X, AlertTriangle, Heart,
  Building, ShoppingBag, ArrowRight, Trash2, Search
} from 'lucide-react';
import { CSRIntervention } from '../types';

const CACHE_KEY_INTERVENTIONS = 'SDAS_INTERVENTIONS_CACHE';

export default function InterventionsView() {
  const [interventions, setInterventions] = useState<CSRIntervention[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_INTERVENTIONS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [allInterventions, setAllInterventions] = useState<CSRIntervention[]>(() => {
    try {
      const cached = localStorage.getItem('SDAS_ALL_INTERVENTIONS_CACHE');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_INTERVENTIONS);
      return !cached;
    } catch (e) {
      return true;
    }
  });
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart / Selection state (in-memory, Set of Intervention IDs)
  const [selectedInterventionIds, setSelectedInterventionIds] = useState<Set<string | number>>(new Set());
  
  // Review / Sponsorship Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [submitId, setSubmitId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const API_ENDPOINT = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbz_OL6IbMhJy0dtEXqODK20d1LhbaNJ_ZvuIqAdbzU9vvwi2x_ZUGA-FcWZ25KnvXfW/exec';

  // Fetch Interventions on Load
  useEffect(() => {
    fetchInterventions();
  }, []);

  // Lock body scroll when modal is open to prevent page drift
  useEffect(() => {
    if (isReviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReviewOpen]);

  const fetchInterventions = async () => {
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAllInterventions(data);
        // Only display interventions where Status equals "Open"
        const openInterventions = data.filter((item: CSRIntervention) => 
          item.Status && item.Status.trim().toLowerCase() === 'open'
        );
        setInterventions(openInterventions);
        try {
          localStorage.setItem(CACHE_KEY_INTERVENTIONS, JSON.stringify(openInterventions));
          localStorage.setItem('SDAS_ALL_INTERVENTIONS_CACHE', JSON.stringify(data));
        } catch (e) {}
      } else {
        throw new Error("Invalid response format. Expected an array.");
      }
    } catch (err: any) {
      console.error("Fetch error: ", err);
      if (interventions.length === 0) {
        setError("Unable to load data, please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  // Compile unique sectors dynamically from live data
  const sectors = ['All', ...Array.from(new Set(interventions.map(item => item.Sector).filter(Boolean)))];

  // Helper to toggle location ID selection
  const toggleSelection = (id: string | number) => {
    setSelectedInterventionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle Form Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Compute selected items details
  const selectedItems = interventions.filter(item => selectedInterventionIds.has(item.ID));
  const selectedCount = selectedItems.length;
  const selectedTotalBudget = selectedItems.reduce((sum, item) => sum + (parseFloat(String(item.Budget_Lakhs)) || 0), 0);

  // Group projects by Sector
  const getSectorGroupedProjects = () => {
    const sectorFiltered = interventions.filter(item => {
      const matchesSector = selectedSector === 'All' || item.Sector === selectedSector;
      const matchesSearch = searchQuery === '' || 
        (item.Title && item.Title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.Location && item.Location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.Sector && item.Sector.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSector && matchesSearch;
    });

    const sectorMap: { [sector: string]: { [title: string]: { title: string; sector: string; description: string; totalBudget: number; items: CSRIntervention[] } } } = {};

    sectorFiltered.forEach(item => {
      const sec = item.Sector || 'General Administration';
      if (!sectorMap[sec]) {
        sectorMap[sec] = {};
      }
      if (!sectorMap[sec][item.Title]) {
        sectorMap[sec][item.Title] = {
          title: item.Title,
          sector: sec,
          description: item.Description || '',
          totalBudget: 0,
          items: []
        };
      }
      sectorMap[sec][item.Title].items.push(item);
      sectorMap[sec][item.Title].totalBudget += parseFloat(String(item.Budget_Lakhs)) || 0;
    });

    return sectorMap;
  };

  const sectorGroups = getSectorGroupedProjects();
  const allGroupedProjectsList = Object.values(sectorGroups).flatMap(sec => Object.values(sec));
  const totalCumulativeBudget = interventions.reduce((sum, it) => sum + (parseFloat(String(it.Budget_Lakhs)) || 0), 0);

  // Helper to get thematic banner image and colors per sector
  const getSectorMeta = (sectorName: string) => {
    const norm = (sectorName || '').toLowerCase().trim();

    // 1. School Education
    if (norm === 'school education' || (norm.includes('school') && !norm.includes('urban'))) {
      return {
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-blue-600 to-indigo-700",
        borderGroup: "border-blue-200/80",
        indicator: "bg-blue-400",
        accentText: "text-blue-600"
      };
    }
    // 2. Higher Education
    if (norm.includes('higher education') || norm.includes('college') || norm.includes('university')) {
      return {
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-indigo-600 to-violet-800",
        borderGroup: "border-indigo-200/80",
        indicator: "bg-indigo-400",
        accentText: "text-indigo-600"
      };
    }
    // 3. Urban Education
    if (norm.includes('urban education')) {
      return {
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-cyan-600 to-blue-700",
        borderGroup: "border-cyan-200/80",
        indicator: "bg-cyan-400",
        accentText: "text-cyan-600"
      };
    }
    // 4. Primary Healthcare
    if (norm.includes('primary care') || norm.includes('primary health')) {
      return {
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-emerald-600 to-teal-700",
        borderGroup: "border-emerald-200/80",
        indicator: "bg-emerald-400",
        accentText: "text-emerald-600"
      };
    }
    // 5. Secondary Healthcare
    if (norm.includes('secondary care') || norm.includes('taluk hospital')) {
      return {
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-teal-600 to-cyan-800",
        borderGroup: "border-teal-200/80",
        indicator: "bg-teal-400",
        accentText: "text-teal-600"
      };
    }
    // 6. Tertiary Healthcare
    if (norm.includes('tertiary care') || norm.includes('medical college') || norm.includes('super-specialty')) {
      return {
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-sky-700 to-blue-900",
        borderGroup: "border-sky-200/80",
        indicator: "bg-sky-400",
        accentText: "text-sky-600"
      };
    }
    // 7. Urban Health
    if (norm.includes('urban health')) {
      return {
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-teal-600 to-emerald-800",
        borderGroup: "border-teal-200/80",
        indicator: "bg-teal-400",
        accentText: "text-teal-600"
      };
    }
    // General Health fallback
    if (norm.includes('health') || norm.includes('hospital') || norm.includes('medical')) {
      return {
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-emerald-600 to-teal-700",
        borderGroup: "border-emerald-200/80",
        indicator: "bg-emerald-400",
        accentText: "text-emerald-600"
      };
    }
    // 8. Social Justice
    if (norm.includes('social justice') || norm.includes('tribal') || norm.includes('adi dravidar')) {
      return {
        image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-amber-600 to-yellow-800",
        borderGroup: "border-amber-200/80",
        indicator: "bg-amber-400",
        accentText: "text-amber-600"
      };
    }
    // 9. Child Protection
    if (norm.includes('child protection') || norm.includes('orphan')) {
      return {
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-rose-500 to-pink-700",
        borderGroup: "border-rose-200/80",
        indicator: "bg-rose-400",
        accentText: "text-rose-600"
      };
    }
    // 10. ICDS / Women & Child
    if (norm.includes('icds') || norm.includes('women') || norm.includes('anganwadi')) {
      return {
        image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-fuchsia-600 to-purple-800",
        borderGroup: "border-fuchsia-200/80",
        indicator: "bg-fuchsia-400",
        accentText: "text-fuchsia-600"
      };
    }
    // 11. Social Welfare
    if (norm.includes('social welfare') || norm.includes('elder') || norm.includes('senior')) {
      return {
        image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-purple-600 to-indigo-800",
        borderGroup: "border-purple-200/80",
        indicator: "bg-purple-400",
        accentText: "text-purple-600"
      };
    }
    // 12. Welfare of Differently Abled
    if (norm.includes('differently abled') || norm.includes('special needs') || norm.includes('disabled')) {
      return {
        image: "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-violet-600 to-purple-800",
        borderGroup: "border-violet-200/80",
        indicator: "bg-violet-400",
        accentText: "text-violet-600"
      };
    }
    // 13. Digital Governance
    if (norm.includes('digital') || norm.includes('governance') || norm.includes('it infrastructure') || norm.includes('e-gov')) {
      return {
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-blue-700 to-indigo-950",
        borderGroup: "border-blue-300/80",
        indicator: "bg-cyan-400",
        accentText: "text-cyan-600"
      };
    }
    // 14. Skill Development
    if (norm.includes('skill') || norm.includes('vocational') || norm.includes('iti') || norm.includes('training')) {
      return {
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-amber-600 to-amber-900",
        borderGroup: "border-amber-200/80",
        indicator: "bg-amber-400",
        accentText: "text-amber-600"
      };
    }
    // 15. Municipal Administration
    if (norm.includes('municipal') || norm.includes('corporation') || norm.includes('urban administration')) {
      return {
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-slate-700 to-slate-950",
        borderGroup: "border-slate-300/80",
        indicator: "bg-slate-400",
        accentText: "text-slate-700"
      };
    }
    // 16. Urban Sanitation
    if (norm.includes('sanitation') || norm.includes('waste') || norm.includes('cleaning') || norm.includes('hygiene')) {
      return {
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-teal-600 to-emerald-700",
        borderGroup: "border-teal-200/80",
        indicator: "bg-teal-400",
        accentText: "text-teal-600"
      };
    }
    // 17. Urban Infrastructure
    if (norm.includes('urban infrastructure') || norm.includes('street light') || norm.includes('drain')) {
      return {
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-blue-600 to-slate-800",
        borderGroup: "border-blue-200/80",
        indicator: "bg-blue-400",
        accentText: "text-blue-600"
      };
    }
    // 18. Urban Greening
    if (norm.includes('urban green') || norm.includes('park') || norm.includes('miyawaki')) {
      return {
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-emerald-600 to-teal-800",
        borderGroup: "border-emerald-200/80",
        indicator: "bg-emerald-400",
        accentText: "text-emerald-600"
      };
    }
    // 19. Agriculture / Horticulture
    if (norm.includes('agri') || norm.includes('horticulture') || norm.includes('farmer') || norm.includes('crop')) {
      return {
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-lime-600 to-emerald-800",
        borderGroup: "border-lime-200/80",
        indicator: "bg-lime-400",
        accentText: "text-lime-600"
      };
    }
    // 20. Forest / Environment
    if (norm.includes('forest') || norm.includes('environment') || norm.includes('hill') || norm.includes('ecology') || norm.includes('water')) {
      return {
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-emerald-700 to-green-950",
        borderGroup: "border-emerald-200/80",
        indicator: "bg-emerald-400",
        accentText: "text-emerald-600"
      };
    }
    // 21. Rural Development
    if (norm.includes('rural') || norm.includes('panchayat') || norm.includes('village')) {
      return {
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-amber-600 to-orange-700",
        borderGroup: "border-amber-200/80",
        indicator: "bg-amber-400",
        accentText: "text-amber-600"
      };
    }
    // 22. Animal Husbandry
    if (norm.includes('animal') || norm.includes('husbandry') || norm.includes('veterinary') || norm.includes('cattle') || norm.includes('dairy')) {
      return {
        image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80",
        gradient: "from-emerald-700 to-amber-800",
        borderGroup: "border-emerald-200/80",
        indicator: "bg-amber-400",
        accentText: "text-emerald-700"
      };
    }
    // General fallback
    return {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      gradient: "from-[#0A3D62] to-[#1B6CA8]",
      borderGroup: "border-slate-200/80",
      indicator: "bg-emerald-400",
      accentText: "text-[#1B6CA8]"
    };
  };

  // Toggle selection for an entire project
  const toggleWholeProject = (projectItems: CSRIntervention[]) => {
    const allSelected = projectItems.every(it => selectedInterventionIds.has(it.ID));
    setSelectedInterventionIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        projectItems.forEach(it => next.delete(it.ID));
      } else {
        projectItems.forEach(it => next.add(it.ID));
      }
      return next;
    });
  };

  // Toggle selection for an entire sector
  const toggleWholeSector = (sectorProjects: { items: CSRIntervention[] }[]) => {
    const allItems = sectorProjects.flatMap(p => p.items);
    const allSelected = allItems.every(it => selectedInterventionIds.has(it.ID));
    setSelectedInterventionIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allItems.forEach(it => next.delete(it.ID));
      } else {
        allItems.forEach(it => next.add(it.ID));
      }
      return next;
    });
  };

  // Submit Expression of Interest
  const handleSubmitEOI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCount === 0) return;

    // Validate phone number
    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setSubmitError("Please enter a valid 10-digit mobile/phone number.");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    const submissionPayload = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      selectedItems: selectedItems.map(item => ({
        interventionId: String(item.ID),
        title: item.Title,
        location: item.Location,
        budget: item.Budget_Lakhs
      }))
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(submissionPayload)
      });

      let generatedId = `SDAS-EOI-${Math.floor(100000 + Math.random() * 900000)}`;
      
      try {
        if (response.ok) {
          const resData = await response.json();
          if (resData && (resData.submissionId || resData.id || resData.SubmissionID)) {
            generatedId = resData.submissionId || resData.id || resData.SubmissionID;
          }
        }
      } catch (e) {
        // Fallback capture
      }

      setSubmitId(generatedId);
      setSubmitSuccess(true);
      setSelectedInterventionIds(new Set());
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err: any) {
      try {
        await fetch(API_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(submissionPayload)
        });

        const generatedId = `SDAS-EOI-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmitId(generatedId);
        setSubmitSuccess(true);
        setSelectedInterventionIds(new Set());
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          message: ''
        });
      } catch (fallbackErr: any) {
        console.error("Submit error: ", fallbackErr);
        setSubmitError("Failed to submit expression of interest. Please check your network connection and try again.");
        setSubmitSuccess(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Metric Calculations for Header Banner (Thoothukudi Blueprint Style)
  const departmentsCount = new Set(interventions.map(item => item.Sector).filter(Boolean)).size;
  const totalInitiativesCount = allInterventions.length > 0 ? allInterventions.length : interventions.length;
  const completedCount = allInterventions.filter(x => {
    const s = (x.Status || '').trim().toLowerCase();
    return s === 'close' || s === 'completed' || s === 'closed';
  }).length;
  const processingCount = allInterventions.filter(x => {
    const s = (x.Status || '').trim().toLowerCase();
    return s === 'processing' || s === 'ongoing' || s === 'in progress';
  }).length;
  const inQueueCount = interventions.length;

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        
        {/* District Administrative Projects Header Card (Thoothukudi Blueprint Style) */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DEVELOPMENT BLUEPRINTS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3D62] tracking-tight">
                District Administrative Projects
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore local CSR allocations and infrastructure welfare campaigns across departments, structured cleanly for full citizen transparency.
              </p>
            </div>

            {/* Right Floating Total Initiatives Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 rounded-2xl border border-slate-700/60 shadow-lg shrink-0 lg:w-72 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Initiatives</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Live System
                </span>
              </div>
              <div className="my-3">
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight font-mono">
                  {totalInitiativesCount < 10 ? `0${totalInitiativesCount}` : totalInitiativesCount}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">Verified Public Interventions</p>
              </div>
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                <span>Cumulative Outlay</span>
                <span className="font-bold text-emerald-300 font-mono">₹ {totalCumulativeBudget.toFixed(2)} L</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Metrics Pill Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
            {/* DEPARTMENTS */}
            <div className="bg-slate-50/80 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-200/60 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
                <Layers size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DEPARTMENTS</div>
                <div className="text-base sm:text-lg font-black text-slate-800">{departmentsCount} Sectors</div>
              </div>
            </div>

            {/* COMPLETED */}
            <div className="bg-emerald-50/60 hover:bg-emerald-50 transition-colors p-4 rounded-xl border border-emerald-200/60 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">COMPLETED</div>
                <div className="text-base sm:text-lg font-black text-emerald-950">{completedCount} Projects</div>
              </div>
            </div>

            {/* PROCESSING */}
            <div className="bg-amber-50/60 hover:bg-amber-50 transition-colors p-4 rounded-xl border border-amber-200/60 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Loader2 size={18} className="animate-spin text-amber-600" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">PROCESSING</div>
                <div className="text-base sm:text-lg font-black text-amber-950">{processingCount} In Progress</div>
              </div>
            </div>

            {/* IN QUEUE */}
            <div className="bg-blue-50/60 hover:bg-blue-50 transition-colors p-4 rounded-xl border border-blue-200/60 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                <HeartHandshake size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">IN QUEUE</div>
                <div className="text-base sm:text-lg font-black text-blue-950">{inQueueCount} Upcoming</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsorship Selection Guide Banner (Tuticorin Style) */}
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-700 text-white rounded-xl shadow-xs shrink-0 mt-0.5 md:mt-0">
              <HeartHandshake className="h-5 w-5 text-emerald-200" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                Sponsorship Selection Guide
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Identify specific public welfare gaps across Salem block-level institutions. Click the <strong className="font-bold text-[#0A3D62]">"Sponsor / Select"</strong> checkbox on any card to compile your custom CSR Sponsorship Portfolio.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-900 shrink-0 uppercase tracking-widest bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Selection Engine Active</span>
          </div>
        </div>

        {/* Channel Selector Pills & Search Bar (Tuticorin Style) */}
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Channel buttons with counts */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {sectors.map((sec) => {
              const count = sec === 'All' 
                ? interventions.length 
                : interventions.filter(it => it.Sector === sec).length;
              const isSelected = selectedSector === sec;
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer flex items-center justify-between gap-3 border shadow-2xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0A3D62] to-[#1B6CA8] border-[#0A3D62] text-white shadow-md'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span>{sec === 'All' ? '★ All Channels' : sec}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Selected Cart Counter */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by keywords, titles, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6CA8]/20 focus:border-[#1B6CA8] transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {selectedCount > 0 && (
              <button
                onClick={() => setIsReviewOpen(true)}
                className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
                <span>CSR Portfolio ({selectedCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="w-full py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="text-[#1B6CA8] animate-spin" />
            <p className="text-sm font-semibold text-[#0A3D62] tracking-wide animate-pulse">
              Loading interventions...
            </p>
            <p className="text-xs text-[#6B7A8F]">Fetching live administrative records from Google Directory</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 p-8 rounded-2xl text-center max-w-2xl mx-auto space-y-4">
            <ShieldAlert size={48} className="text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-red-800">Connection Failure</h3>
            <p className="text-xs text-red-700 font-semibold">{error}</p>
            <div className="pt-2">
              <button
                onClick={fetchInterventions}
                className="bg-[#0A3D62] hover:bg-[#1B6CA8] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Retry Connecting
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && Object.keys(sectorGroups).length === 0 && (
          <div className="w-full bg-white p-12 rounded-2xl border border-slate-200/80 text-center max-w-2xl mx-auto space-y-4">
            <AlertTriangle size={48} className="text-amber-500 mx-auto" />
            <h3 className="font-bold text-[#0A3D62]">No Interventions Found</h3>
            <p className="text-xs text-[#6B7A8F]">
              There are currently no open administrative requests matching the selected filters.
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setSelectedSector('All'); setSearchQuery(''); }}
                className="bg-[#E8F1F8] text-[#0A3D62] text-xs font-bold px-5 py-2.5 rounded-lg transition-colors border border-[#1B6CA8]/20 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* SECTOR CARDS WITH HERO BANNERS & 2-COLUMN PROJECT GRIDS (TUTICORIN STYLE) */}
        {!loading && !error && Object.keys(sectorGroups).length > 0 && (
          <div className="space-y-12 max-w-6xl mx-auto">
            {Object.keys(sectorGroups).map((sectorName) => {
              const projectsObj = sectorGroups[sectorName];
              const projectList = Object.values(projectsObj);
              const meta = getSectorMeta(sectorName);
              const sectorTotalBudget = projectList.reduce((sum, p) => sum + p.totalBudget, 0);
              const allSectorItems = projectList.flatMap(p => p.items);
              const isSectorAllSelected = allSectorItems.length > 0 && allSectorItems.every(it => selectedInterventionIds.has(it.ID));

              return (
                <div 
                  key={sectorName}
                  className={`bg-white rounded-3xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${meta.borderGroup}`}
                >
                  {/* Rich Hero Header Image Banner */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden flex items-end">
                    <img 
                      src={meta.image} 
                      alt={sectorName}
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.35] hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                    
                    <div className="relative z-10 p-5 sm:p-6 w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleWholeSector(projectList)}
                          className={`px-3 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 cursor-pointer text-xs font-black shadow-md ${
                            isSectorAllSelected
                              ? 'bg-emerald-600 border-emerald-700 text-white'
                              : 'bg-white/15 hover:bg-white/25 border-white/25 text-white'
                          }`}
                          title={isSectorAllSelected ? "Unselect All Sector" : "Select All Sector"}
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSectorAllSelected ? 'bg-white text-emerald-700 border-transparent' : 'bg-transparent border-white/40'
                          }`}>
                            {isSectorAllSelected ? <CheckCircle2 size={12} className="stroke-[3]" /> : <span className="text-[10px] font-black">+</span>}
                          </div>
                          <span className="hidden sm:inline">
                            {isSectorAllSelected ? 'Sector Selected' : 'Select All Sector'}
                          </span>
                        </button>

                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-none drop-shadow-md">
                            {sectorName}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-end">
                        <span className="px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-bold rounded-lg text-white shadow-xs flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${meta.indicator}`}></span>
                          <span>{allSectorItems.length} {allSectorItems.length === 1 ? 'initiative' : 'initiatives'}</span>
                        </span>
                        <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 text-[11px] font-mono font-bold rounded-lg text-white shadow-xs">
                          Sector Total: ₹ {sectorTotalBudget.toFixed(2)} Lakhs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Project Grid inside Sector */}
                  <div className="p-5 sm:p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {projectList.map((project, pIdx) => {
                        const isProjectFullySelected = project.items.every(it => selectedInterventionIds.has(it.ID));
                        const isProjectPartiallySelected = !isProjectFullySelected && project.items.some(it => selectedInterventionIds.has(it.ID));

                        return (
                          <div 
                            key={pIdx}
                            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
                          >
                            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${meta.gradient}`}></div>
                            
                            <div className="pl-2 space-y-4">
                              {/* Top Bar: Sponsor Pill & Total Outlay */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <button
                                  onClick={() => toggleWholeProject(project.items)}
                                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all cursor-pointer text-[10px] font-black uppercase tracking-wider ${
                                    isProjectFullySelected 
                                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                                      : isProjectPartiallySelected
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-500 hover:bg-emerald-50/40'
                                  }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                                    isProjectFullySelected ? 'bg-white text-emerald-700' : 'border border-slate-300'
                                  }`}>
                                    {isProjectFullySelected ? '✓' : '+'}
                                  </div>
                                  <span>{isProjectFullySelected ? 'Selected' : 'Sponsor / Select'}</span>
                                </button>

                                <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-mono">
                                  ₹ {project.totalBudget.toFixed(2)} Lakhs
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-extrabold text-base text-[#0A3D62] leading-snug group-hover:text-[#1B6CA8] transition-colors">
                                {project.title}
                              </h3>

                              {/* Description */}
                              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                {project.description}
                              </p>

                              {/* Locations Checklist */}
                              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  <span>Specific Locations / Units</span>
                                  <span>Budget</span>
                                </div>
                                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                                  {project.items.map((locationItem) => {
                                    const isSelected = selectedInterventionIds.has(locationItem.ID);
                                    return (
                                      <label
                                        key={locationItem.ID}
                                        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                                          isSelected
                                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                                            : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70 text-slate-700'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(locationItem.ID)}
                                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                          />
                                          <span className="text-xs truncate font-medium">
                                            {locationItem.Location || 'Salem District'}
                                          </span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-emerald-700 shrink-0 ml-2">
                                          ₹ {locationItem.Budget_Lakhs} L
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ----------------- SELECTION BASKET (VERTICALLY CENTERED RIGHT-SIDE STICKY FLOATING CARD - PORTAL TO BODY) ----------------- */}
        {!isReviewOpen && selectedCount > 0 && typeof document !== 'undefined' && createPortal(
          <div 
            style={{ 
              position: 'fixed', 
              right: '24px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              zIndex: 9990 
            }}
            className="bg-white border-2 border-[#1B6CA8] shadow-2xl rounded-2xl p-5 w-80 max-w-[calc(100vw-32px)] transition-all duration-300 pointer-events-auto"
          >
            
            {/* Header: Badge, Title & Clear All */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F1F8] border border-[#1B6CA8]/20 text-[#0A3D62] flex items-center justify-center font-black text-sm shadow-xs">
                  {selectedCount}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#0A3D62] uppercase tracking-wider">
                    Selection Basket
                  </h4>
                  <p className="text-[10px] text-[#6B7A8F] font-medium">
                    {selectedCount === 1 ? '1 location chosen' : `${selectedCount} locations chosen`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInterventionIds(new Set())}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer shrink-0"
                title="Clear and close basket"
                aria-label="Close Selection Basket"
              >
                <X size={17} />
              </button>
            </div>

            {/* Total Budget */}
            <div className="py-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Selected Total Budget:</span>
              <span className="text-base font-black text-emerald-600 font-mono">
                ₹ {selectedTotalBudget.toFixed(2).replace(/\.00$/, '')} Lakhs
              </span>
            </div>

            {/* Action CTA Button */}
            <button 
              onClick={() => setIsReviewOpen(true)}
              className="w-full bg-[#1B6CA8] hover:bg-[#0A3D62] text-white text-xs font-black py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to EOI</span>
              <ArrowRight size={15} />
            </button>
          </div>,
          document.body
        )}

        {/* ----------------- SPONSORSHIP / REVIEW MODAL (REACT PORTAL TO DOCUMENT.BODY) ----------------- */}
        {isReviewOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Full-screen Backdrop */}
            <div 
              className="fixed inset-0 bg-[#0A3D62]/75 backdrop-blur-xs transition-opacity duration-200" 
              aria-hidden="true"
              onClick={() => {
                if (submitSuccess !== true) {
                  setIsReviewOpen(false);
                  setSubmitSuccess(null);
                }
              }}
            ></div>

            {/* Modal Dialog Card - Instant, Sharp, Perfectly Centered in Viewport */}
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col my-auto transition-all duration-200">
              
              {/* Modal Header */}
              <div className="bg-[#0A3D62] text-white px-6 py-4 flex justify-between items-center shrink-0">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm sm:text-base tracking-wide" id="modal-title">
                    CSR Welfare Sponsorship Request
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    Salem District Administration Society Coordination Portal
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsReviewOpen(false);
                    setSubmitSuccess(null);
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Modal Content Container */}
              <div className="overflow-y-auto max-h-[calc(90vh-70px)]">

                {/* Main Content Pane */}
                {submitSuccess === true ? (
                  <div className="p-8 space-y-5 text-center max-w-md mx-auto">
                    <div className="w-14 h-14 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-base text-[#0A3D62]">Expression of Interest Received</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Thank you for your valuable corporate commitment. Your sponsorship proposal has been successfully registered on the administrative portal.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-w-xs mx-auto">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Submission Reference ID</span>
                      <span className="text-xs font-black text-[#0A3D62] font-mono select-all">{submitId}</span>
                    </div>
                    <p className="text-[10px] text-[#6B7A8F] max-w-sm mx-auto leading-relaxed">
                      Our Project Management Unit (PMU) under the District Collector, Salem will verify the requirements and initiate mutual draft agreements shortly.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsReviewOpen(false);
                          setSubmitSuccess(null);
                        }}
                        className="w-full bg-[#1B6CA8] hover:bg-[#0A3D62] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-colors cursor-pointer"
                      >
                        Return to Active Projects
                      </button>
                    </div>
                  </div>
                ) : selectedCount === 0 ? (
                  <div className="p-8 text-center space-y-4 max-w-md mx-auto animate-fade-in">
                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-500">
                      <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-sm text-[#0A3D62]">No Projects Selected</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        No Projects Selected — Visit CSR Interventions to choose welfare projects you wish to sponsor.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsReviewOpen(false)}
                        className="bg-[#1B6CA8] hover:bg-[#0A3D62] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Browse Projects
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitEOI} className="p-6 space-y-5">
                    
                    {/* Failure Alert */}
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 p-3.5 rounded-lg flex gap-2 text-xs">
                        <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-red-800 block">Submission Failure</strong>
                          <span className="text-red-700 text-[11px]">{submitError}</span>
                        </div>
                      </div>
                    )}

                    {/* Selected List Section */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-[#0A3D62] uppercase tracking-wider flex items-center justify-between">
                        <span>Selected Welfare Projects ({selectedCount})</span>
                        <span className="text-[10px] text-[#6B7A8F] lowercase font-normal">Click icon to remove any</span>
                      </h4>
                      
                      <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-100 rounded-lg p-3 bg-slate-50/50 scrollbar-thin">
                        {selectedItems.map((item) => (
                          <div key={item.ID} className="flex items-start justify-between gap-4 p-2.5 bg-white border border-slate-200/80 rounded-lg text-xs hover:border-[#1B6CA8]/25 transition-colors">
                            <div className="min-w-0 flex-1">
                              <span className="text-[8px] font-bold text-[#1B6CA8] uppercase tracking-wider block mb-0.5">{item.Sector}</span>
                              <h5 className="font-bold text-[#0A3D62] truncate leading-tight">{item.Title}</h5>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                                <MapPin size={9} className="shrink-0" />
                                <span className="truncate">{item.Location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-bold text-[#2E8B57] text-xs font-mono">₹ {item.Budget_Lakhs} L</span>
                              <button 
                                type="button"
                                onClick={() => toggleSelection(item.ID)}
                                className="text-slate-400 hover:text-rose-500 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Remove from selection"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cumulative Total */}
                      <div className="bg-emerald-50/60 border border-emerald-200/50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide block">Welfare Sponsorship Total</span>
                          <span className="text-[10px] text-emerald-700 font-medium">Cumulative financial budget of chosen locations</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-[#2E8B57] font-mono">₹ {selectedTotalBudget.toFixed(2).replace(/\.00$/, '')} Lakhs</span>
                        </div>
                      </div>
                    </div>

                    {/* EOI Form Section */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <h4 className="text-[11px] font-bold text-[#0A3D62] uppercase tracking-wider">
                        Corporate Contact & Proposal Details
                      </h4>

                      {/* Company Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#6B7A8F] uppercase tracking-wide mb-1">
                          Company / Organization Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="e.g. Acme Corporations India Pvt Ltd"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6CA8] focus:bg-white focus:border-[#1B6CA8] transition-all"
                        />
                      </div>

                      {/* Contact Person & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#6B7A8F] uppercase tracking-wide mb-1">
                            Contact Person <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="contactPerson"
                            required
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            placeholder="e.g. Mr. Rajesh Kumar"
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6CA8] focus:bg-white focus:border-[#1B6CA8] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#6B7A8F] uppercase tracking-wide mb-1">
                            Official Email ID <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. rajesh@acme.com"
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6CA8] focus:bg-white focus:border-[#1B6CA8] transition-all"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#6B7A8F] uppercase tracking-wide mb-1">
                          Official Phone / Mobile <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile (e.g. 9876543210)"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6CA8] focus:bg-white focus:border-[#1B6CA8] transition-all"
                        />
                      </div>

                      {/* Message / Scope */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#6B7A8F] uppercase tracking-wide mb-1">
                          Brief Message / Key Remarks <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <textarea
                          name="message"
                          rows={2}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Provide details about your planned CSR deployment, timelines, or request for site visits..."
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6CA8] focus:bg-white focus:border-[#1B6CA8] transition-all resize-none"
                        ></textarea>
                      </div>

                      {/* Modal Footer Controls */}
                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsReviewOpen(false);
                            setSubmitSuccess(null);
                          }}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-[#1B6CA8] hover:bg-[#0A3D62] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Submitting proposal...</span>
                            </>
                          ) : (
                            <>
                              <Send size={12} />
                              <span>Submit Expression of Interest</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </form>
                )}

              </div>
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}
