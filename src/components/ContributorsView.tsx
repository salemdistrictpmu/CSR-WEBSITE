import React, { useState, useEffect } from 'react';
import { 
  Trophy, Building, Search, ChevronDown, ChevronUp, 
  Layers, CheckCircle2, IndianRupee, Sparkles, ArrowRight,
  TrendingUp, Award, Activity, ShieldCheck
} from 'lucide-react';
import { ActivePage } from '../types';

interface SanctionedWork {
  heading: string;
  works: string;
  amountLakhs: number;
}

interface ContributorEntity {
  id: string | number;
  companyName: string;
  logo?: string;
  totalOutlayLakhs: number;
  works: SanctionedWork[];
  sector?: string;
}

interface ContributorsViewProps {
  setActivePage?: (page: ActivePage) => void;
  initialExpandedId?: string | number | null;
}

const DEFAULT_SALEM_CONTRIBUTORS: ContributorEntity[] = [
  {
    id: 1,
    companyName: "Steel Authority of India Ltd (SAIL - Salem Steel Plant)",
    logo: "/images/sail-logo.png",
    totalOutlayLakhs: 185.00,
    sector: "Healthcare & Education",
    works: [
      {
        heading: "CRITICAL HEALTHCARE INFRASTRUCTURE - SALEM GH",
        works: "Procurement of specialized medical equipment, hemodialysis units, and modern diagnostic ICU beds for Mohan Kumaramangalam Govt Medical College Hospital.",
        amountLakhs: 110.00
      },
      {
        heading: "GOVERNMENT HIGH SCHOOL MODERNIZATION - STEEL PLANT CAMPUS",
        works: "Construction of additional classrooms, smart STEM science laboratories, and modern sanitation blocks at Salem Steel Plant Govt HSS.",
        amountLakhs: 50.00
      },
      {
        heading: "RURAL HIGH MAST SOLAR LIGHTING - COLLECTORATE CORRIDOR",
        works: "Installation of solar high-mast illumination systems across critical rural transit intersections and panachayat junctions.",
        amountLakhs: 25.00
      }
    ]
  },
  {
    id: 2,
    companyName: "Tamil Nadu Magnesite Limited (TANMAG)",
    logo: "/images/tanmag-logo.png",
    totalOutlayLakhs: 120.00,
    sector: "Environment & Water",
    works: [
      {
        heading: "GREEN BELT AFFORESTATION - KURUMBAPATTI FOOTHILLS",
        works: "Deployment of 15,000+ native sapling dense afforestation with solar drip irrigation systems around Kurumbapatti reserve foothills.",
        amountLakhs: 75.00
      },
      {
        heading: "CHECK DAM & PERCOLATION POND REJUVENATION - OMALUR",
        works: "Desilting, deepening, and stone-pitching of community percolation ponds across the Omalur watershed catchment belt.",
        amountLakhs: 45.00
      }
    ]
  },
  {
    id: 3,
    companyName: "Southern Iron & Steel Company Ltd (SISCOL / JSW Salem)",
    logo: "/images/siscol-logo.png",
    totalOutlayLakhs: 95.00,
    sector: "Education & Water",
    works: [
      {
        heading: "SMART SCIENCE & DIGITAL LABS - 6 GOVT SCHOOLS",
        works: "Setting up interactive digital learning centers, science discovery kits, and modern computer labs across 6 Govt Higher Secondary Schools.",
        amountLakhs: 60.00
      },
      {
        heading: "COMMUNITY RO DRINKING WATER PLANTS - MECHERI",
        works: "Installation of automated 1000 LPH RO water purification plants in Mecheri and Nangavalli rural panchayats.",
        amountLakhs: 35.00
      }
    ]
  },
  {
    id: 4,
    companyName: "Salem Starch & Sago Manufacturers Service (SAGOSERVE)",
    logo: "/images/sago-logo.png",
    totalOutlayLakhs: 75.00,
    sector: "Women Livelihood",
    works: [
      {
        heading: "WOMEN ARTISAN POWERLOOM & SKILL CENTER - ATTUR",
        works: "Modern automated powerlooms, industrial tailoring stations, and food processing skill units empowering 120+ rural women self-help group members.",
        amountLakhs: 75.00
      }
    ]
  },
  {
    id: 5,
    companyName: "JSW Foundation (Salem Works)",
    logo: "/images/jsw.jpg",
    totalOutlayLakhs: 45.00,
    sector: "Maternal Health",
    works: [
      {
        heading: "PRIMARY HEALTHCARE NUTRITION & CHILDCARE - METTUR",
        works: "Pediatric diagnostic apparatus and maternal nutrition supplementation support across Primary Health Centers in Mettur taluk.",
        amountLakhs: 45.00
      }
    ]
  }
];

// Helper to format Lakhs into Crore / Lakh exactly like Tuticorin
const formatCurrencyDisplay = (lakhs: number): string => {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${crores.toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  return `₹${lakhs.toFixed(0)} Lakh`;
};

const CACHE_KEY_CONTRIBUTORS = 'SDAS_CONTRIBUTORS_CACHE';

export default function ContributorsView({ setActivePage, initialExpandedId }: ContributorsViewProps) {
  const [contributors, setContributors] = useState<ContributorEntity[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_CONTRIBUTORS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SALEM_CONTRIBUTORS;
  });
  const [expandedId, setExpandedId] = useState<string | number | null>(() => initialExpandedId ?? null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const API_ENDPOINT = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbz_OL6IbMhJy0dtEXqODK20d1LhbaNJ_ZvuIqAdbzU9vvwi2x_ZUGA-FcWZ25KnvXfW/exec';

  // Live Sync Attempt with Google Sheet API if available
  useEffect(() => {
    fetchLiveContributors();
  }, []);

  const resolveTargetId = (target: string | number | null, list: ContributorEntity[]): string | number | null => {
    if (target === null || target === undefined) return null;
    const directMatch = list.find(c => String(c.id) === String(target));
    if (directMatch) return directMatch.id;
    
    // Fallback match by keyword
    const targetStr = String(target).toLowerCase();
    const nameMatch = list.find(c => {
      const cName = c.companyName.toLowerCase();
      if (target === 1 || target === '1' || targetStr.includes('sail')) return cName.includes('sail') || cName.includes('steel plant');
      if (target === 2 || target === '2' || targetStr.includes('tanmag')) return cName.includes('tanmag') || cName.includes('magnesite');
      if (target === 3 || target === '3' || targetStr.includes('siscol')) return cName.includes('siscol') || cName.includes('southern iron');
      if (target === 4 || target === '4' || targetStr.includes('sago')) return cName.includes('sago') || cName.includes('starch');
      if (target === 5 || target === '5' || targetStr.includes('jsw')) return cName.includes('jsw');
      return false;
    });
    return nameMatch ? nameMatch.id : target;
  };

  // Handle external selection & auto-scroll (e.g. from Home page View Profile)
  useEffect(() => {
    if (initialExpandedId !== undefined && initialExpandedId !== null) {
      const targetId = resolveTargetId(initialExpandedId, contributors);
      if (targetId !== null) {
        setExpandedId(targetId);
        
        const scrollToElement = () => {
          const el = document.getElementById(`contributor-row-${targetId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };

        const timer1 = setTimeout(scrollToElement, 150);
        const timer2 = setTimeout(scrollToElement, 500);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
  }, [initialExpandedId, contributors]);

  const fetchLiveContributors = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}?action=getContributors`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const isRealContributorData = data.some(it => it.companyName || it.Company_Name || it['Name of the company']);
          if (isRealContributorData) {
            // Group flat rows into company entity hierarchy with works array
            const companyMap: { [compName: string]: ContributorEntity } = {};
            data.forEach((row, idx) => {
              const comp = row.companyName || row.Company_Name || row['Name of the company'] || 'Corporate Partner';
              const amt = parseFloat(String(row.sanctionedAmountLakhs || row.Sanctioned_Amount || row['Sanctioned Amount'] || row.Budget_Lakhs || 0)) || 0;
              const head = row.heading || row.Heading || row['Heading of the work'] || 'CSR Welfare Initiative';
              const workDesc = row.works || row.Works || row['Name of the works'] || row.Description || '';

              if (!companyMap[comp]) {
                companyMap[comp] = {
                  id: idx + 1,
                  companyName: comp,
                  logo: row.logo || row.Logo || '',
                  totalOutlayLakhs: 0,
                  works: [],
                  sector: row.sector || row.Sector || 'General'
                };
              }
              companyMap[comp].totalOutlayLakhs += amt;
              companyMap[comp].works.push({
                heading: head,
                works: workDesc,
                amountLakhs: amt
              });
            });
            const list = Object.values(companyMap).sort((a, b) => b.totalOutlayLakhs - a.totalOutlayLakhs);
            if (list.length > 0) {
              setContributors(list);
              try {
                localStorage.setItem(CACHE_KEY_CONTRIBUTORS, JSON.stringify(list));
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      console.log("Using cached contributors registry");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Accordion Row
  const toggleRow = (id: string | number) => {
    setExpandedId(prev => {
      const nextId = String(prev) === String(id) ? null : id;
      if (nextId !== null) {
        setTimeout(() => {
          const el = document.getElementById(`contributor-row-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      return nextId;
    });
  };

  // Calculations
  const totalOutlaySum = contributors.reduce((sum, c) => sum + (c.totalOutlayLakhs || 0), 0);
  const totalEntitiesCount = contributors.length;
  const totalWorksExecutedCount = contributors.reduce((sum, c) => sum + (c.works ? c.works.length : 0), 0);

  // Top 3 Podium Winners (Sorted descending by Outlay)
  const sortedContributors = [...contributors].sort((a, b) => b.totalOutlayLakhs - a.totalOutlayLakhs);
  const top1 = sortedContributors[0];
  const top2 = sortedContributors[1];
  const top3 = sortedContributors[2];

  // Filtered contributors for search
  const filteredContributors = sortedContributors.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesName = (c.companyName || '').toLowerCase().includes(q);
    const matchesWorks = c.works?.some(w => 
      (w.heading || '').toLowerCase().includes(q) || 
      (w.works || '').toLowerCase().includes(q)
    );
    return matchesName || matchesWorks;
  });

  return (
    <div className="w-full min-h-screen bg-[#FAFCFF] py-12 px-4 sm:px-6 lg:px-8 pb-32 space-y-12 animate-fade-in">
      
      {/* 1. TOP TITLE & CONTEXT */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#FFF8E6] border border-[#F5A623]/30 text-[#D97706] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xs">
          <Trophy size={13} className="text-[#F5A623]" />
          <span>OFFICIAL DISTRICT HONOR BOARD</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#0B1A2C] tracking-tight">
          Partners in Development
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
          Sustaining state welfare works and district infrastructures through active, high-impact public-private partnerships and CSR investment programs.
        </p>
      </div>

      {/* 2. THREE SUMMARY STAT CARDS (TUTICORIN FLOATING CARD STYLE) */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* Metric 1 */}
        <div className="flex items-center gap-4 px-2 py-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL CORPORATE OUTLAY
            </span>
            <span className="text-2xl font-black text-[#0B1A2C] tracking-tight block mt-0.5">
              {formatCurrencyDisplay(totalOutlaySum)}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex items-center gap-4 px-2 md:pl-8 py-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1B6CA8] flex items-center justify-center shrink-0">
            <Building size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ACTIVE CORPORATE SPONSORS
            </span>
            <span className="text-2xl font-black text-[#0B1A2C] tracking-tight block mt-0.5">
              {totalEntitiesCount} Major Entities
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex items-center gap-4 px-2 md:pl-8 py-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL SANCTIONED PROJECTS
            </span>
            <span className="text-2xl font-black text-[#0B1A2C] tracking-tight block mt-0.5">
              {totalWorksExecutedCount} Works Executed
            </span>
          </div>
        </div>

      </div>

      {/* 3. HONORABLE TOP PILLARS OF SALEM (PODIUM STYLE) */}
      <div className="max-w-5xl mx-auto space-y-6 pt-4">
        <div className="text-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
            HONORABLE TOP PILLARS OF SALEM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* Rank #2 (Left Podium) */}
          {top2 && (
            <div 
              onClick={() => toggleRow(top2.id)}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm relative flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-[#1B6CA8]/30 hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center group-hover:bg-[#1B6CA8] group-hover:text-white transition-colors">
                2
              </div>
              <div className="w-16 h-16 flex items-center justify-center p-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform">
                {top2.logo ? (
                  <img src={top2.logo} alt={top2.companyName} className="w-full h-full object-contain" />
                ) : (
                  <Building size={28} className="text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                  {top2.companyName}
                </h3>
                <span className="inline-block text-[9px] font-bold text-emerald-700 uppercase tracking-widest mt-1">
                  CSR PARTNER
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {formatCurrencyDisplay(top2.totalOutlayLakhs)}
              </div>
              <div className="w-full pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 group-hover:text-[#1B6CA8]">
                <span>{top2.works.length} {top2.works.length === 1 ? 'INITIATIVE' : 'INITIATIVES'}</span>
                <span>• View Details ↓</span>
              </div>
            </div>
          )}

          {/* Rank #1 (Center Tallest Podium with Trophy) */}
          {top1 && (
            <div 
              onClick={() => toggleRow(top1.id)}
              className="bg-white rounded-3xl p-8 sm:p-9 border-2 border-amber-200/70 shadow-lg relative flex flex-col items-center text-center space-y-4 transform md:-translate-y-4 hover:shadow-2xl hover:border-amber-400 transition-all cursor-pointer group"
            >
              {/* Trophy on Top */}
              <div className="w-12 h-12 rounded-full bg-[#FFF8E6] text-amber-500 border border-amber-200 flex items-center justify-center shadow-xs -mt-14 mb-1 group-hover:scale-110 transition-transform">
                <Trophy size={24} className="stroke-[2.5]" />
              </div>

              <div className="w-20 h-20 flex items-center justify-center p-2.5 bg-amber-50/50 rounded-2xl border border-amber-100 group-hover:scale-105 transition-transform">
                {top1.logo ? (
                  <img src={top1.logo} alt={top1.companyName} className="w-full h-full object-contain" />
                ) : (
                  <Building size={34} className="text-amber-600" />
                )}
              </div>
              
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                  {top1.companyName}
                </h3>
                <span className="inline-block text-[10px] font-black text-emerald-700 uppercase tracking-widest mt-1">
                  CSR PARTNER
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {formatCurrencyDisplay(top1.totalOutlayLakhs)}
              </div>

              <div className="w-full pt-3 border-t border-amber-100 bg-amber-50/50 -mx-8 px-6 py-2 rounded-b-2xl">
                <span className="block text-[10px] font-black text-amber-800 uppercase tracking-wider">
                  Top Contributor
                </span>
                <span className="text-[10px] text-slate-600 font-bold group-hover:text-amber-800">
                  {top1.works.length} MAJOR WORKS • Click to View ↓
                </span>
              </div>
            </div>
          )}

          {/* Rank #3 (Right Podium) */}
          {top3 && (
            <div 
              onClick={() => toggleRow(top3.id)}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm relative flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-[#1B6CA8]/30 hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center group-hover:bg-[#1B6CA8] group-hover:text-white transition-colors">
                3
              </div>
              <div className="w-16 h-16 flex items-center justify-center p-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform">
                {top3.logo ? (
                  <img src={top3.logo} alt={top3.companyName} className="w-full h-full object-contain" />
                ) : (
                  <Building size={28} className="text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                  {top3.companyName}
                </h3>
                <span className="inline-block text-[9px] font-bold text-emerald-700 uppercase tracking-widest mt-1">
                  CSR PARTNER
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {formatCurrencyDisplay(top3.totalOutlayLakhs)}
              </div>
              <div className="w-full pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 group-hover:text-[#1B6CA8]">
                <span>{top3.works.length} {top3.works.length === 1 ? 'INITIATIVE' : 'INITIATIVES'}</span>
                <span>• View Details ↓</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 4. SEARCH BAR */}
      <div className="max-w-4xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Sponsor by name, heading, or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6CA8]/20 focus:border-[#1B6CA8] transition-all shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* 5. EXPANDABLE ACCORDION LEADERBOARD (TUTICORIN STYLE TABLE ROWS) */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredContributors.map((entity, idx) => {
          const isExpanded = String(expandedId) === String(entity.id);
          return (
            <div 
              key={entity.id}
              id={`contributor-row-${entity.id}`}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-[#1B6CA8] shadow-xl ring-2 ring-[#1B6CA8]/20 scale-[1.01]' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Main Accordion Row Header */}
              <div 
                onClick={() => toggleRow(entity.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <span className="text-xs font-bold text-slate-400 w-6">
                    #{idx + 1}
                  </span>

                  {/* Logo */}
                  <div className="w-12 h-12 rounded-xl p-1.5 bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {entity.logo ? (
                      <img src={entity.logo} alt={entity.companyName} className="w-full h-full object-contain" />
                    ) : (
                      <Building size={20} className="text-slate-400" />
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {entity.companyName}
                      </h4>
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-200">
                        CSR PARTNER
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span>{entity.works.length} {entity.works.length === 1 ? 'Initiative' : 'Initiatives'}</span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold hover:underline">List sanctioned works →</span>
                    </div>
                  </div>
                </div>

                {/* Right: Total Funding & Chevron */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      TOTAL FUNDING
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      {formatCurrencyDisplay(entity.totalOutlayLakhs)}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Works Table (Screenshot 4 Style) */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 bg-white border-t border-slate-100 space-y-4 animate-fade-in">
                  
                  {/* Table Column Headers */}
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">
                    <span>DETAIL LIST OF SANCTIONED ACTIVITIES</span>
                    <span>ALLOCATED SANC. AMOUNT</span>
                  </div>

                  {/* Works List */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {entity.works.map((work, wIdx) => (
                      <div 
                        key={wIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors"
                      >
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                            <span>🏷️</span>
                            <span>{work.heading}</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {work.works}
                          </p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                          <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            Rs. {work.amountLakhs} Lakhs
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}


