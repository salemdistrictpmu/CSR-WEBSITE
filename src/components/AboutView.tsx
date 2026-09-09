import React, { useState } from 'react';
import { 
  MapPin, Landmark, Layers, HelpCircle, Search, ChevronDown, ChevronUp, 
  Building, Sprout, Hammer, Scissors, Sparkles, Database, FileText, Factory, ArrowRight
} from 'lucide-react';

interface TalukProfile {
  id: string;
  name: string;
  tamilName: string;
  division: string;
  category: 'Industrial & Steel' | 'Hills & Plantations' | 'Agro & Sago Basin' | 'Textile & River Belt';
  primaryResources: string[];
  description: string;
  heritage: string;
  stats: string;
  gps: string;
}

const SALEM_TALUKS_DATA: TalukProfile[] = [
  {
    id: 'salem',
    name: 'Salem (Salem City)',
    tamilName: 'சேலம்',
    division: 'Salem Division',
    category: 'Industrial & Steel',
    primaryResources: ['Salem Steel Plant (SAIL)', 'Salem Kolusu (GI Tag)', 'Sago & Starch Hub', 'Govt Medical College'],
    description: 'The administrative headquarters and premier economic engine of the district. Renowned as the "Steel City" of Tamil Nadu, hosting the massive Salem Steel Plant (SAIL), major SAGOSERVE starch processing networks, and India\'s largest handcrafted silver anklet manufacturing industry.',
    heritage: 'Famous for the historical Sugavaneswarar Temple, Fort Salem, Kottai Mariamman, and GI-registered Salem Silk and Cotton Handloom weaves.',
    stats: 'Produces over 60% of India\'s silver anklets and silver hand-crafted jewellery.',
    gps: '11.6643° N, 78.1460° E'
  },
  {
    id: 'yercaud',
    name: 'Yercaud',
    tamilName: 'ஏற்காடு',
    division: 'Salem Division',
    category: 'Hills & Plantations',
    primaryResources: ['Shevaroy Arabica Coffee', 'Black Pepper & Spices', 'Orange Orchards', 'Tribal Welfare Belts'],
    description: 'Celebrated as the "Jewel of the South", situated in the Shevaroy Hills at an elevation of 1,515 meters. Famous for rich shade-grown Arabica coffee plantations, exotic spices, horticulture research stations, and indigenous Malayali tribal settlements.',
    heritage: 'Historical summer sanctuary, ancient Servaroyan Cave Temple, and centuries-old botanical biodiversity parks.',
    stats: 'Spans across 383 sq.km of pristine hill terrain supporting 67 tribal habitations.',
    gps: '11.7753° N, 78.2093° E'
  },
  {
    id: 'mettur',
    name: 'Mettur',
    tamilName: 'மேட்டூர்',
    division: 'Mettur Division',
    category: 'Industrial & Steel',
    primaryResources: ['Stanley Dam Reservoir', 'Hydel & Thermal Power (840 MW)', 'MALCO Aluminium', 'Chemical Complexes'],
    description: 'Home to the monumental Mettur Dam (Stanley Reservoir), the agricultural lifeline of the Cauvery Delta. Houses major hydro-electric power stations, 840 MW coal thermal plants, aluminium smelters, and heavy petrochemical industries.',
    heritage: 'The historic Stanley Dam constructed in 1934, one of the oldest and largest multi-purpose dams in India.',
    stats: 'Provides drinking water and irrigation for over 12 downstream Tamil Nadu districts.',
    gps: '11.7962° N, 77.8011° E'
  },
  {
    id: 'attur',
    name: 'Attur',
    tamilName: 'ஆத்தூர்',
    division: 'Attur Division',
    category: 'Agro & Sago Basin',
    primaryResources: ['SAGOSERVE Sago Mills', 'Attur Kichili Samba Rice', 'Tapioca Cultivation', 'Handloom Weaving'],
    description: 'A vibrant agro-industrial heartland along the Vashista River basin. Celebrated as the epicentre of Tapioca cultivation and sago processing mills, alongside heritage Kichili Samba paddy fields and cotton ginning units.',
    heritage: '16th-century historic Attur Fort built by Gatti Mudaliar chieftains on the banks of River Vashista.',
    stats: 'Processes over 40% of Tamil Nadu\'s commercial tapioca sago and starch output.',
    gps: '11.5977° N, 78.5967° E'
  },
  {
    id: 'sankari',
    name: 'Sankari (Sankagiri)',
    tamilName: 'சங்ககிரி',
    division: 'Sankari Division',
    category: 'Industrial & Steel',
    primaryResources: ['Historic Sankari Fort', 'India Cements Industry', 'Heavy Lorry Body Building', 'Limestone Mining'],
    description: 'A strategic heavy-industry and logistics hub in western Tamil Nadu. Known for vast limestone mineral reserves, India Cements manufacturing facilities, and South India\'s largest commercial truck/lorry body building cluster.',
    heritage: 'The formidable Sankari Fort built atop a 400-meter sheer cliff, historically fortified by Tipu Sultan and Dheeran Chinnamalai.',
    stats: 'Operational nerve center for 15,000+ commercial freight carrier fleets.',
    gps: '11.4839° N, 77.8681° E'
  },
  {
    id: 'edappadi',
    name: 'Edappadi',
    tamilName: 'எடப்பாடி',
    division: 'Sankari Division',
    category: 'Textile & River Belt',
    primaryResources: ['Cauvery River Lift Irrigation', 'Powerloom Textile Weaving', 'Granite Processing', 'Paddy Agriculture'],
    description: 'A thriving textile and agrarian center bordering the Cauvery River. Boasts high-density automated powerloom textile units manufacturing gray fabric, lungis, and bedsheets for statewide and international distribution.',
    heritage: 'Historic rural handloom-to-powerloom weaving societies and scenic Cauvery check-dam riverfronts.',
    stats: 'Houses 20,000+ powerlooms driving vibrant rural household employment.',
    gps: '11.5833° N, 77.8483° E'
  },
  {
    id: 'omalur',
    name: 'Omalur',
    tamilName: 'ஓமலூர்',
    division: 'Mettur Division',
    category: 'Textile & River Belt',
    primaryResources: ['Salem Airport (Kamalapuram)', 'Mulberry Sericulture', 'Turmeric Wholesale Mandi', 'Engineering Colleges'],
    description: 'A key connectivity corridor hosting the Salem Domestic Airport. Highly reputed for mulberry silk cocoon farming (sericulture), vibrant turmeric trade markets, and distinguished technological universities.',
    heritage: 'The ancient Kottai Mariamman Temple and multi-generational farmer sericulture federations.',
    stats: 'Ranked top in silk cocoon auction turnover across north-western Tamil Nadu.',
    gps: '11.7410° N, 78.0410° E'
  },
  {
    id: 'thalaivasal',
    name: 'Thalaivasal',
    tamilName: 'தலைவாசல்',
    division: 'Attur Division',
    category: 'Agro & Sago Basin',
    primaryResources: ['Asia\'s Largest Livestock Park (AIIRLAS)', 'Daily Vegetable Mandi', 'Dairy Farms', 'Maize & Grain Belt'],
    description: 'Home to the Advanced Institute for Integrated Research on Livestock and Animal Sciences (AIIRLAS), the largest livestock research park in Asia. Functions as the premier regional vegetable market supplying fresh farm produce across South India.',
    heritage: 'Modern veterinary biotechnology research campus and ancient gateway pass into the Eastern Ghats.',
    stats: 'AIIRLAS research and livestock park spans over 1,100 sprawling acres.',
    gps: '11.5802° N, 78.7562° E'
  },
  {
    id: 'valapady',
    name: 'Valapady',
    tamilName: 'வாழப்பாடி',
    division: 'Salem Division',
    category: 'Agro & Sago Basin',
    primaryResources: ['Arecanut Plantations', 'Sago Roasting Units', 'Mango Groves', 'Poultry Hatcheries'],
    description: 'A prosperous agricultural valley nestled beneath the Kalrayan foothills. Renowned for lush arecanut farms, tapioca processing factories, poultry hatcheries, and organic mango cultivation.',
    heritage: 'Foothill tribal heritage, ancient rock-cut inscriptions, and indigenous wild honey harvesting traditions.',
    stats: 'Produces over 15,000 tonnes of commercial grade tapioca tuber annually.',
    gps: '11.6547° N, 78.3972° E'
  },
  {
    id: 'pethanaickenpalayam',
    name: 'Pethanaickenpalayam',
    tamilName: 'பெத்தநாயக்கன்பாளையம்',
    division: 'Attur Division',
    category: 'Agro & Sago Basin',
    primaryResources: ['Kalrayan Foothill Farms', 'Sugarcane Agriculture', 'Betel Leaf Vineyards', 'Forest Produce'],
    description: 'An agro-forest belt in eastern Salem blessed with rich soil nourishing sugarcane, spicy betel vine plantations, maize crops, and non-timber forest produce gathered from the Kalrayan hills.',
    heritage: 'Strategic gateway to the Kalrayan tribal villages, wildlife corridors, and natural water reservoirs.',
    stats: 'Supplies premium betel leaves to major wholesale markets across South India.',
    gps: '11.6425° N, 78.5028° E'
  },
  {
    id: 'salem_south',
    name: 'Salem South',
    tamilName: 'சேலம் தெற்கு',
    division: 'Salem Division',
    category: 'Textile & River Belt',
    primaryResources: ['Kondalampatti Silk Sarees (GI)', 'Auto Ancillary Workshops', 'Silver Smelting', 'Dyeing Units'],
    description: 'The world-renowned silk weaving capital of Salem. Home to Kondalampatti pure silk handloom sarees, modern textile dye houses, precision automotive workshops, and specialized silver bullion smelting.',
    heritage: 'Renowned for the GI-certified Kondalampatti Handloom Silk Saree master weaving traditions.',
    stats: 'More than 10,000 master artisan families actively engaged in silk handloom weaving.',
    gps: '11.6214° N, 78.1384° E'
  },
  {
    id: 'salem_west',
    name: 'Salem West',
    tamilName: 'சேலம் மேற்கு',
    division: 'Salem Division',
    category: 'Industrial & Steel',
    primaryResources: ['Salem Railway Junction', 'Steel Fabrication Yards', 'Logistics Depots', 'Higher Education Hub'],
    description: 'The multimodal transit and freight backbone of Salem District. Suramangalam serves as the principal railway junction, surrounded by heavy steel fabrication yards, dry container depots, and premier engineering institutes.',
    heritage: 'Historic Suramangalam junction established in the 1860s as a vital colonial transit and trade corridor.',
    stats: 'Manages 100+ express freight and passenger train movements every single day.',
    gps: '11.6789° N, 78.1158° E'
  },
  {
    id: 'kadayampatti',
    name: 'Kadayampatti',
    tamilName: 'காடையாம்பட்டி',
    division: 'Mettur Division',
    category: 'Agro & Sago Basin',
    primaryResources: ['Salem Mango Orchards', 'Pannikaradu Foothills', 'Jasmine Floriculture', 'Clay Tile Kilns'],
    description: 'Situated in northern Salem, celebrated for sweet Malgova and Salem Gundu mango orchards, fragrant jasmine and rose floriculture, and eco-friendly terracotta clay tile works.',
    heritage: 'Scenic Pannikaradu hill range, tribal shrines, and age-old village irrigation storage ponds.',
    stats: 'Harvests over 8,000 tonnes of export-grade table mangoes each summer season.',
    gps: '11.8386° N, 78.0922° E'
  },
  {
    id: 'gangavalli',
    name: 'Gangavalli',
    tamilName: 'கங்கவல்லி',
    division: 'Attur Division',
    category: 'Agro & Sago Basin',
    primaryResources: ['Tapioca Sago Mills', 'Sweet Corn & Maize Farming', 'Pachamalai Foothills', 'Handloom Weaving'],
    description: 'A fertile agricultural and agro-industrial valley situated along the south-eastern border of Salem district. Prominently known for extensive tapioca tuber cultivation supplying regional sago factories, sweet corn farming, and traditional handloom weaving clusters.',
    heritage: 'Heritage temples of Kongu Nadu, sacred village groves, and foothill freshwater streams originating from the Pachamalai hills.',
    stats: 'Over 80% of local rural population engaged in agriculture and tapioca agro-processing industries.',
    gps: '11.4883° N, 78.6534° E'
  }
];

export default function AboutView() {
  const [expandedTaluks, setExpandedTaluks] = useState<Set<string>>(new Set(['salem']));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Divisions');

  const toggleTaluk = (id: string) => {
    const next = new Set(expandedTaluks);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedTaluks(next);
  };

  const expandAll = (taluks: TalukProfile[]) => {
    setExpandedTaluks(new Set(taluks.map(t => t.id)));
  };

  const collapseAll = () => {
    setExpandedTaluks(new Set());
  };

  const filteredTaluks = SALEM_TALUKS_DATA.filter(t => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(q) ||
      t.tamilName.toLowerCase().includes(q) ||
      t.division.toLowerCase().includes(q) ||
      t.primaryResources.some(r => r.toLowerCase().includes(q)) ||
      t.description.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'All Divisions' || t.category === selectedCategory || t.division === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categoryFilters = [
    'All Divisions',
    'Salem Division',
    'Attur Division',
    'Mettur Division',
    'Sankari Division',
    'Industrial & Steel',
    'Hills & Plantations',
    'Agro & Sago Basin',
    'Textile & River Belt'
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pb-32 space-y-16 animate-fade-in">
      
      <section className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-8 bg-[#1B6CA8]"></span>
            <span className="text-xs font-bold text-[#1B6CA8] uppercase tracking-widest">Administrative Body</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-[#0A3D62] tracking-tight sm:text-4xl">
            About Our Society
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-[#2C3E50] leading-relaxed text-justify">
            <p>
              The Salem District Administration Society (SDAS) is a district-level institution established to streamline Corporate Social Responsibility (CSR) initiatives by creating a single, coordinated platform that brings together government departments, corporate organizations, NGOs, philanthropic institutions, and community stakeholders.
            </p>
            <p>
              The Society's primary objective is to serve as the central nodal agency for identifying, prioritizing, and facilitating CSR investments based on the district's most pressing developmental needs. By aligning corporate resources with evidence-based priorities identified by the District Administration, SDAS ensures that CSR interventions are strategic, impactful, and responsive to grassroots requirements.
            </p>
            <p>
              Working under the guidance of the Salem District Administration, SDAS mobilizes and channels CSR resources towards key sectors such as quality education, accessible healthcare, sustainable livelihoods, climate-resilient agriculture, environmental conservation, women and youth empowerment, rural infrastructure, and other priority development initiatives.
            </p>
            <p>
              Committed to transparency, accountability, and measurable outcomes, SDAS follows a structured framework for project identification, partner engagement, implementation, monitoring, and impact assessment. Through this unified approach, the Society seeks to eliminate fragmented CSR efforts, optimize resource utilization, foster meaningful public-private partnerships, and accelerate inclusive, sustainable development across Salem district.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto pt-6 border-t border-slate-200 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F1F8] border border-[#1B6CA8]/10 text-[#0A3D62] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-2xs">
            <Landmark size={13} className="text-[#1B6CA8]" />
            <span>Official Governance Roster</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A3D62] tracking-tight">
            List of Executive Committee Members
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A8F] leading-relaxed max-w-2xl mx-auto font-medium">
            The following are the Executive Members of the <strong className="text-[#0A3D62]">SALEM DISTRICT ADMINISTRATION SOCIETY (SDAS)</strong> entrusted with policy steering and CSR initiative execution.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#2B2D42] text-white px-6 py-3.5 flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
              <span>District Level Officers</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
              10 Key Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 sm:px-6 w-16 text-center whitespace-nowrap">S.No</th>
                  <th className="py-3 px-4 sm:px-6">Name of the Post</th>
                  <th className="py-3 px-4 sm:px-6">Designation in Society</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {[
                  { sno: 1, post: 'DISTRICT COLLECTOR', role: 'PRESIDENT', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { sno: 2, post: 'DISTRICT REVENUE OFFICER', role: 'VICE PRESIDENT', badgeBg: 'bg-sky-50 text-sky-800 border-sky-300' },
                  { sno: 3, post: 'ADDITIONAL COLLECTOR (Dev) / PROJECT DIRECTOR', role: 'SECRETARY', badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
                  { sno: 4, post: 'APO ACCOUNTS', role: 'TREASURER', badgeBg: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { sno: 5, post: 'APO-INFRA-II', role: 'COMMITTEE MEMBER', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
                  { sno: 6, post: 'DPS', role: 'COMMITTEE MEMBER', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
                  { sno: 7, post: 'PA TO COLLECTOR (GENERAL)', role: 'COMMITTEE MEMBER', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
                  { sno: 8, post: 'AD PANCHAYAT (P&A) Central', role: 'COMMITTEE MEMBER', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
                  { sno: 9, post: 'AD PANCHAYAT (P&A) EAST', role: 'COMMITTEE MEMBER', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
                  { sno: 10, post: 'AD PANCHAYAT (P&A) WEST', role: 'COMMITTEE MEMBER', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' },
                ].map((member) => (
                  <tr 
                    key={member.sno} 
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 sm:px-6 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                      {member.sno}
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-[#0A3D62]">
                      {member.post}
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${member.badgeBg}`}>
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto pt-6 border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#1B6CA8] uppercase tracking-wider">Salem At A Glance</span>
          <h2 className="text-2xl font-extrabold text-[#0A3D62] tracking-tight">Administrative Dimensions</h2>
          <p className="text-xs text-[#6B7A8F]">Key administrative figures representing the scale of Salem District.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "14", label: "Revenue Taluks", desc: "Official grassroots administrative units across 4 divisions" },
            { value: "4", label: "Revenue Divisions", desc: "Salem, Attur, Mettur, and Sankari executive divisions" },
            { value: "44", label: "Revenue Firkas", desc: "Zonal administrative firka clusters under Revenue Inspectors" },
            { value: "640", label: "Revenue Villages", desc: "Village panchayats facilitating targeted grassroots rural welfare" }
          ].map((card, i) => (
            <div 
              key={i} 
              id={`stat-card-${i}`}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center cursor-default group space-y-4"
            >
              <div className="text-4xl font-black text-[#0A3D62] group-hover:text-emerald-500 transition-colors duration-300 font-sans">
                {card.value}
              </div>
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {card.label}
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto pt-6 border-t border-slate-200 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
            Official Administrative Setup (NIC Portal)
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            The Fourteen Taluks of Salem
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Salem District is divided into 4 Revenue Divisions (Salem, Attur, Mettur, Sankari) and 14 Revenue Taluks. Each region offers unique industrial clusters, mineral wealth, and agricultural assets.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 mb-8 max-w-5xl mx-auto space-y-5">
          <div className="flex flex-col md:flex-row gap-3.5 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/70" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search administrative Taluk, crops, minerals, resources..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 bg-slate-50 p-3 sm:px-4 sm:py-2 rounded-xl border border-slate-200 w-full md:w-auto">
              <span className="text-xs font-mono text-slate-600 font-bold flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>{filteredTaluks.length} of {SALEM_TALUKS_DATA.length} Regions</span>
              </span>
              <div className="hidden sm:block h-4 w-[1px] bg-slate-200 shrink-0"></div>
              <div className="flex justify-center gap-3 whitespace-nowrap text-xs">
                <button 
                  onClick={() => expandAll(filteredTaluks)}
                  className="font-bold text-emerald-700 hover:text-emerald-950 cursor-pointer transition-colors"
                >
                  Expand All
                </button>
                <span className="text-slate-300">•</span>
                <button 
                  onClick={collapseAll}
                  className="font-bold text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              FILTER BY ADMINISTRATIVE CLASSIFICATION
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredTaluks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-2">
            <HelpCircle className="text-amber-500 mx-auto" size={40} />
            <h4 className="font-bold text-[#0A3D62] text-sm">No Taluks Match Your Search</h4>
            <p className="text-xs text-[#6B7A8F]">Try adjusting your search keywords or switching the classification filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTaluks.map((taluk) => {
              const isExpanded = expandedTaluks.has(taluk.id);
              const isHill = taluk.category === 'Hills & Plantations';
              const isIndustry = taluk.category === 'Industrial & Steel';
              const isAgro = taluk.category === 'Agro & Sago Basin';

              const iconBg = isHill 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : isIndustry 
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : isAgro
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-teal-50 text-teal-700 border-teal-200';

              const isSalemHQ = taluk.id === 'salem';

              const cardBorder = isExpanded 
                ? 'border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20' 
                : 'border-slate-200 hover:border-emerald-400/60 shadow-xs';

              return (
                <div 
                  key={taluk.id}
                  id={`taluk-card-${taluk.id}`}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${cardBorder} ${
                    isSalemHQ ? 'col-span-1 lg:col-span-2' : 'col-span-1'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div 
                    onClick={() => toggleTaluk(taluk.id)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/70 select-none transition-colors space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${iconBg}`}>
                          {isHill ? <Sprout size={20} /> : isIndustry ? <Building size={20} /> : isAgro ? <Layers size={20} /> : <Factory size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                              {taluk.name}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-sans">
                              {taluk.tamilName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {taluk.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              • {taluk.gps.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-400 pt-1 shrink-0">
                        {isExpanded ? <ChevronUp size={18} className="text-emerald-600" /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {taluk.primaryResources.map((res, rIdx) => (
                        <span key={rIdx} className="text-[11px] font-medium text-slate-700 bg-slate-100/90 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <span className="text-emerald-600 font-bold text-[10px]">+</span>
                          <span>{res}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Profile Body */}
                  {isExpanded && (
                    <div className="bg-slate-50/70 border-t border-slate-150 p-5 sm:p-6 animate-fade-in text-xs">
                      {isSalemHQ ? (
                        /* Wide 2-Column Layout for Salem Headquarters (Matching Tuticorin Screenshot) */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left Column: Economic Potential & Regional Stat Baseline */}
                          <div className="space-y-4 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                                ECONOMIC POTENTIAL & RESOURCES
                              </div>
                              <p className="text-slate-700 leading-relaxed font-sans text-xs sm:text-[13px]">
                                {taluk.description}
                              </p>
                            </div>

                            <div className="bg-[#0A3D62] text-white p-4 rounded-xl shadow-xs flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                                <Sparkles size={16} />
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300 block">
                                  REGIONAL STAT BASELINE
                                </span>
                                <p className="text-xs sm:text-sm font-bold text-white font-sans leading-snug">
                                  {taluk.stats}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Heritage & Culture + GPS + Welfare Needs */}
                          <div className="space-y-4 flex flex-col justify-between">
                            <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-200/80">
                              <div className="flex items-center gap-1.5 text-slate-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                                <Landmark size={12} className="text-amber-600" />
                                <span>HERITAGE & CULTURE</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed font-sans text-xs">
                                {taluk.heritage}
                              </p>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                                <MapPin size={13} className="text-emerald-600 shrink-0" />
                                <span>GPS: {taluk.gps}</span>
                              </div>
                              <a href="#interventions" className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                                <span>Welfare Needs</span>
                                <ArrowRight size={13} />
                              </a>
                            </div>
                          </div>

                        </div>
                      ) : (
                        /* Standard Layout for other 12 Taluks */
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                              ECONOMIC POTENTIAL & RESOURCES
                            </div>
                            <p className="text-slate-700 leading-relaxed font-sans text-xs sm:text-[13px]">
                              {taluk.description}
                            </p>
                          </div>
                          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/80">
                            <div className="flex items-center gap-1.5 text-slate-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                              <Landmark size={12} className="text-amber-600" />
                              <span>HERITAGE & CULTURE</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-sans text-xs">
                              {taluk.heritage}
                            </p>
                          </div>
                          <div className="bg-[#0A3D62] text-white p-4 rounded-xl shadow-xs flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                              <Sparkles size={16} />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300 block">
                                REGIONAL STAT BASELINE
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-white font-sans leading-snug">
                                {taluk.stats}
                              </p>
                            </div>
                          </div>
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                              <MapPin size={13} className="text-emerald-600 shrink-0" />
                              <span>GPS: {taluk.gps}</span>
                            </div>
                            <a href="#interventions" className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                              <span>Welfare Needs</span>
                              <ArrowRight size={13} />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto pt-6 border-t border-slate-200 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#1B6CA8] uppercase tracking-wider">Economic Foundation</span>
          <h2 className="text-2xl font-extrabold text-[#0A3D62] tracking-tight">Salem's Economic Strengths</h2>
          <p className="text-xs text-[#6B7A8F]">Key industries and resources driving the district's economy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Salem Steel Plant & Heavy Industry",
              desc: "Home to SAIL Salem Steel Plant, renowned globally for producing world-class special-grade stainless steel and cold-rolled alloy coils.",
              tag: "HEAVY INDUSTRY",
              image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
              fallbackIcon: <Building size={28} className="text-[#0A3D62]" />,
              alt: "Steel Industry"
            },
            {
              title: "Mango Cultivation & Agro-Exports",
              desc: "Renowned as the 'Mango City' of Tamil Nadu, producing premium Malgoa, Salem Gundu, and Imam Pasand varieties across 8,000+ hectares.",
              tag: "HORTICULTURE",
              image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600",
              fallbackIcon: <Sprout size={28} className="text-[#0A3D62]" />,
              alt: "Mango Cultivation"
            },
            {
              title: "Textile, Sago & Powerloom Hub",
              desc: "Major export hub for handloom silk, automated powerlooms, and SAGOSERVE starch processing supplying 80% of India's sago demand.",
              tag: "TEXTILE & SAGO",
              image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600",
              fallbackIcon: <Scissors size={28} className="text-[#0A3D62]" />,
              alt: "Textile Loom"
            },
            {
              title: "Magnesite & Mineral Reserves",
              desc: "Abundant mineral wealth with expansive reserves of high-grade cryptocrystalline magnesite, dunite, and bauxite mined by TANMAG.",
              tag: "MINERAL RESERVES",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600",
              fallbackIcon: <Hammer size={28} className="text-[#0A3D62]" />,
              alt: "Mineral Mining"
            }
          ].map((item, i) => (
            <div 
              key={i} 
              id={`economic-card-${i}`}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#1B6CA8]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-default group"
            >
              {/* Photo Area */}
              <div>
                <div className="h-44 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-white/60 shadow-xs text-slate-800 group-hover:text-[#1B6CA8] transition-colors">
                    {item.fallbackIcon}
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-5 sm:p-6 space-y-2">
                  <div className="inline-block bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200">
                    {item.tag}
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
              
              <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>District Asset #{i+1}</span>
                <span className="text-emerald-600 font-bold">Key Economic Pillar</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
