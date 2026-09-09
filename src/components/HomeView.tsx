import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);
import { 
  ArrowRight, Award, Landmark, TrendingUp, CheckCircle, 
  MapPin, Heart, BookOpen, Stethoscope, Sprout, ShieldAlert, HeartHandshake,
  ArrowRightCircle, Facebook, Instagram, Twitter, Linkedin, Youtube, Building,
  Compass, Image as ImageIcon, ZoomIn, Eye, X, Calendar, Sparkles, ChevronRight,
  Camera
} from 'lucide-react';
import { ActivePage } from '../types';

/* ========================================================================================
 * 📸 PHOTO GALLERY & RECENT INITIATIVES CONFIGURATION GUIDE
 * ========================================================================================
 * HOW TO UPLOAD AND DISPLAY YOUR OWN PHOTOS:
 * 
 * 1. FOLDER LOCATION:
 *    Place your photos inside either of these standard project directories:
 *    👉 /public/assets/gallery/  (Recommended for public web assets)
 *       or
 *    👉 /src/assets/gallery/
 * 
 * 2. NAMING YOUR FILES:
 *    Name your photos e.g. img1.jpg, img2.jpg, img3.jpg, img4.jpg, etc.
 *    (Supported formats: .jpg, .jpeg, .png, .webp, .svg)
 * 
 * 3. HOW TO ADD MORE PHOTOS TO THE ARRAY BELOW:
 *    Simply copy & paste one of the objects below and increment the id and filename:
 *    {
 *      id: 9,
 *      localPath: "assets/gallery/img9.jpg", // Path to your local photo in /assets/gallery/
 *      previewFallback: "https://images.unsplash.com/...", // Fallback URL for web preview
 *      title: "Title of your new project / event",
 *      category: "Education" | "Healthcare" | "Environment" | "Infrastructure" | "Livelihood",
 *      location: "Specific location / Block in Salem",
 *      date: "Month Year",
 *      description: "Brief summary of the initiative..."
 *    }
 * ======================================================================================== */

export interface InitiativePhoto {
  id: number;
  localPath: string;        // Local file path (e.g. assets/gallery/img1.jpg)
  previewFallback: string;  // Graceful fallback URL for live preview
  title: string;
  category: 'Education' | 'Healthcare' | 'Environment' | 'Infrastructure' | 'Livelihood' | 'General';
  location: string;
  date: string;
  description: string;
}

export const RECENT_INITIATIVES_GALLERY: InitiativePhoto[] = [
  {
    id: 1,
    localPath: "/assets/gallery/img1.jpg",
    previewFallback: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    title: "Smart Classroom Digital Labs",
    category: "Education",
    location: "Govt Hr Sec School, Omalur",
    date: "Feb 2026",
    description: "Installation of smart interactive boards, digital e-learning kiosks, and student science kits."
  },
  {
    id: 2,
    localPath: "/assets/gallery/img2.jpg",
    previewFallback: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    title: "Advanced Primary Healthcare Wing",
    category: "Healthcare",
    location: "Primary Health Centre, Valapady",
    date: "Jan 2026",
    description: "Equipped with modern clinical diagnostics, hematology analyzers, and emergency oxygen beds."
  },
  {
    id: 3,
    localPath: "/assets/gallery/img3.jpg",
    previewFallback: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    title: "Mettur Foothills Afforestation Drive",
    category: "Environment",
    location: "Mettur Bypass Foothills",
    date: "Jan 2026",
    description: "Community-driven planting of 10,000+ indigenous saplings with drip irrigation support."
  },
  {
    id: 4,
    localPath: "/assets/gallery/img4.jpg",
    previewFallback: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800",
    title: "Panamarathupatti Lake Restoration",
    category: "Environment",
    location: "Panamarathupatti Block",
    date: "Dec 2025",
    description: "Comprehensive lake bed desilting and bund reinforcement restoring 4.5 lakh cubic meters of water retention."
  },
  {
    id: 5,
    localPath: "/assets/gallery/img5.jpg",
    previewFallback: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
    title: "Women's Powerloom & Apparel Center",
    category: "Livelihood",
    location: "Thalaivasal Block",
    date: "Nov 2025",
    description: "Modern automated looms and entrepreneurship training empowering 120+ rural women artisans."
  },
  {
    id: 6,
    localPath: "/assets/gallery/img6.jpg",
    previewFallback: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    title: "High-Altitude Solar Micro-Grids",
    category: "Infrastructure",
    location: "Yercaud Tribal Hamlets",
    date: "Oct 2025",
    description: "Solar-powered street lighting and community battery stations for remote hill settlements."
  },
  {
    id: 7,
    localPath: "/assets/gallery/img7.jpg",
    previewFallback: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80&w=800",
    title: "Mobile Healthcare Diagnostics Unit",
    category: "Healthcare",
    location: "Attur Rural Belt",
    date: "Sep 2025",
    description: "Specialized medical van equipped with ECG, eye screening, and telemedicine connectivity."
  },
  {
    id: 8,
    localPath: "/assets/gallery/img8.jpg",
    previewFallback: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800",
    title: "Model Anganwadi Upgradation",
    category: "Education",
    location: "Sankari Block",
    date: "Aug 2025",
    description: "Child-friendly learning spaces, nutrition supply corners, and safe sanitary drinking water infrastructure."
  }
];

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  onSelectContributor?: (contributorId: string | number) => void;
}

export default function HomeView({ setActivePage, onSelectContributor }: HomeViewProps) {
  // Setup Animated Stats Counters
  const [totalProjects, setTotalProjects] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Dynamic Metrics Targets (Calculated from Google Sheets / Portal Interventions)
  const [targetMetrics, setTargetMetrics] = useState(() => {
    try {
      const cachedAll = localStorage.getItem('SDAS_ALL_INTERVENTIONS_CACHE');
      const cachedOpen = localStorage.getItem('SDAS_INTERVENTIONS_CACHE');
      const data = cachedAll ? JSON.parse(cachedAll) : (cachedOpen ? JSON.parse(cachedOpen) : []);
      if (Array.isArray(data) && data.length > 0) {
        const total = data.length;
        const ongoing = data.filter((x: any) => (x.Status || '').trim().toLowerCase() === 'open').length;
        const completed = data.filter((x: any) => {
          const s = (x.Status || '').trim().toLowerCase();
          return s === 'close' || s === 'completed' || s === 'closed';
        }).length;
        const budget = data.reduce((acc: number, x: any) => acc + (parseFloat(x.Budget_Lakhs) || 0), 0);
        return {
          total,
          ongoing,
          completed,
          totalValue: Math.round(budget)
        };
      }
    } catch (e) {}
    return {
      total: 7,
      ongoing: 6,
      completed: 1,
      totalValue: 495
    };
  });

  const API_ENDPOINT = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbz_OL6IbMhJy0dtEXqODK20d1LhbaNJ_ZvuIqAdbzU9vvwi2x_ZUGA-FcWZ25KnvXfW/exec';

  // Dynamic Fast-Cached Initiatives & Contributors
  const [homeInitiatives] = useState<InitiativePhoto[]>(() => {
    try {
      const cached = localStorage.getItem('SDAS_GALLERY_PHOTOS_CACHE');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return RECENT_INITIATIVES_GALLERY;
  });

  const [homeContributors] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('SDAS_CONTRIBUTORS_CACHE');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Gallery state for filtering and modal lightbox view
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<InitiativePhoto | null>(null);

  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const container = useRef<HTMLDivElement>(null);

  // Fetch real metrics from Live Google Sheet
  useEffect(() => {
    const fetchLiveMetrics = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            try {
              localStorage.setItem('SDAS_ALL_INTERVENTIONS_CACHE', JSON.stringify(data));
              const openOnly = data.filter((item: any) => item.Status && item.Status.trim().toLowerCase() === 'open');
              localStorage.setItem('SDAS_INTERVENTIONS_CACHE', JSON.stringify(openOnly));
            } catch (e) {}

            const total = data.length;
            const ongoing = data.filter((x: any) => (x.Status || '').trim().toLowerCase() === 'open').length;
            const completed = data.filter((x: any) => {
              const s = (x.Status || '').trim().toLowerCase();
              return s === 'close' || s === 'completed' || s === 'closed';
            }).length;
            const budget = data.reduce((acc: number, x: any) => acc + (parseFloat(x.Budget_Lakhs) || 0), 0);
            
            const updated = {
              total,
              ongoing,
              completed,
              totalValue: Math.round(budget)
            };
            setTargetMetrics(updated);

            if (hasAnimated) {
              setTotalProjects(updated.total);
              setOngoingProjects(updated.ongoing);
              setCompletedProjects(updated.completed);
              setTotalValue(updated.totalValue);
            }
          }
        }
      } catch (err) {
        console.warn('Could not refresh live statistics:', err);
      }
    };

    fetchLiveMetrics();
  }, [hasAnimated]);

  useGSAP(() => {
    // Advanced Hero Animations (clean fromTo with clearProps)
    gsap.fromTo('.hero-element', 
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );

    // Advanced Scroll Animations for Sections
    const triggers: ScrollTrigger[] = [];
    gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((elem) => {
      const anim = gsap.fromTo(elem, 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: elem,
            start: 'top 90%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, { scope: container });

  useEffect(() => {
    // Ultra smooth deceleration easing (easeOutQuart)
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const animateCounter = (
      start: number,
      end: number,
      duration: number,
      setter: React.Dispatch<React.SetStateAction<number>>
    ) => {
      let startTime: number | null = null;

      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = Math.round(start + eased * (end - start));
        
        setter(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setter(end);
        }
      };

      requestAnimationFrame(step);
    };

    const startAllAnimations = () => {
      setHasAnimated(true);
      animateCounter(0, targetMetrics.total, 2000, setTotalProjects);
      animateCounter(0, targetMetrics.ongoing, 1800, setOngoingProjects);
      animateCounter(0, targetMetrics.completed, 1600, setCompletedProjects);
      animateCounter(0, targetMetrics.totalValue, 2200, setTotalValue);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          startAllAnimations();
        }
      },
      { threshold: 0.15 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, targetMetrics]);

  return (
    <div ref={container} className="w-full flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full flex items-center justify-center overflow-hidden bg-[#0A3D62]">
        {/* Dynamic Image Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-[#0A3D62]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B6CA8]/40 via-[#0A3D62]/80 to-[#0A3D62]" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-8 sm:pt-10 pb-16 flex flex-col items-center justify-center text-center">
          
          {/* Top Pill Badge */}
          <div className="hero-element inline-flex items-center gap-2.5 bg-white/10 border border-white/20 backdrop-blur-md text-emerald-300 text-xs font-bold px-5 py-2.5 rounded-full shadow-xl mb-7 cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="tracking-widest uppercase text-[10px] sm:text-xs text-white font-semibold">Coordinating Development, Enriching Lives</span>
          </div>
          
          {/* Main Title - Proportional Size & Brand Colors */}
          <h1 className="hero-element text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-xl mb-4 max-w-4xl">
            Salem District <br />
            <span className="text-sky-300">Administration</span>{' '}
            <span className="text-emerald-400">Society</span>
          </h1>

          {/* Tamil Title */}
          <h2 className="hero-element text-lg sm:text-xl md:text-2xl font-bold text-sky-100/90 tracking-wide mb-6 font-sans drop-shadow-md">
            சேலம் மாவட்ட நிர்வாகச் சமூகம்
          </h2>

          {/* Subtitle Badge */}
          <div className="hero-element inline-flex items-center justify-center bg-black/40 border border-white/15 backdrop-blur-md text-slate-200 text-xs sm:text-sm font-medium px-6 py-2.5 rounded-2xl shadow-xl mb-9 max-w-3xl leading-relaxed">
            <span>Government of Tamil Nadu • Transparent CSR Management For Ground Welfare Operations • Serving Local Demographics</span>
          </div>

          {/* Action Buttons */}
          <div className="hero-element flex flex-col sm:flex-row gap-5 items-center justify-center">
            <button 
              onClick={() => {
                setActivePage('interventions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative">View CSR Interventions</span>
              <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 backdrop-blur-md font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <span>About Our Society</span>
            </button>
          </div>
        </div>
      </section>


      {/* 2. ABOUT US SECTION */}
      {/* 2. ABOUT US SECTION (Tuticorin Layout) */}
      {false && (
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start gsap-fade-up">
          
          {/* Left: Map Image Container */}
          <div className="lg:col-span-5">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm border border-gray-100 z-10 text-emerald-600">
                <Compass size={22} />
              </div>
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/5] flex items-center justify-center border border-slate-200/50">
                {/* Fallback image representing a map */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                  alt="Salem District Map" 
                  className="w-full h-full object-cover opacity-70 mix-blend-multiply transition-transform hover:scale-105 duration-700"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-8 text-center w-full z-10">
                  <h3 className="font-black text-slate-800 text-xl tracking-tight drop-shadow-md">SALEM DISTRICT</h3>
                  <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase drop-shadow-sm">Tamil Nadu, India</p>
                </div>

                <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md rounded-xl px-4 py-2.5 flex items-center gap-2 border border-slate-700/50 shadow-lg z-10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-white text-xs font-mono font-medium">GPS Core: 11.66° N, 78.14° E</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 text-center italic mt-4 font-medium leading-relaxed px-4">
                Figure: General Map of Salem District showcasing its prominent geographical positioning.
              </p>
            </div>
          </div>

          {/* Right: Text & Stats Cards */}
          <div className="lg:col-span-7 space-y-8 mt-4 lg:mt-6">
            
            <div className="space-y-6 text-[15px] text-gray-600 leading-relaxed text-justify">
              <p>
                <strong className="text-gray-900">Salem</strong> is a major city located in the north-central part of Tamil Nadu. Widely known as the 'Steel City' due to its illustrious steel manufacturing background, it is a bustling industrial hub with a rich cultural heritage, acting as the gateway to the western and southern regions of the state.
              </p>
              <p>
                The district comprises a vibrant economy powered by key steel industries, textile manufacturing, agriculture (especially Mango cultivation), and mineral mining. Characterized by its welcoming communities, Salem remains a prominent center of education, historic trade, and sustainable infrastructure developments under active state guidance.
              </p>
            </div>

            {/* 3 Horizontal Pill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Total Area</span>
                  <strong className="text-sm font-black text-gray-900">5,245 SQ KM</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Taluks & Blocks</span>
                  <strong className="text-sm font-black text-gray-900">14 Taluks, 20 Blks</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Industrial Rank</span>
                  <strong className="text-sm font-black text-gray-900">Steel City Hub</strong>
                </div>
              </div>

            </div>
            
          </div>
        </div>
      </section>
      )}


      {/* 3. WHAT IS CSR SECTION */}
      <section className="py-20 bg-white border-y border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-block bg-[#E8F1F8] text-[#0A3D62] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Regulatory Framework
            </div>
            <h2 className="text-3xl font-extrabold text-[#0A3D62] tracking-tight">
              What is Corporate Social Responsibility (CSR)?
            </h2>
            <p className="text-sm text-[#6B7A8F] leading-relaxed">
              India is one of the first countries to mandate Corporate Social Responsibility (CSR) through legislation, encouraging inclusive growth and responsible corporate participation in national development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gsap-fade-up">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-default group">
              <div>
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
                  <Landmark size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Legal Framework
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  CSR in India is governed by the Companies Act, 2013, under Section 135. It applies to companies meeting any one of: net worth ₹500 crore+, turnover ₹1,000 crore+, or net profit ₹5 crore+. Eligible companies must constitute a formal CSR Committee.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Section 135 • Companies Act, 2013
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-default group">
              <div>
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  CSR Spending Requirement
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Eligible companies must spend at least 2% of their average net profits of the preceding three financial years on CSR activities. Any unspent amounts in a financial year must be formally disclosed and transferred as prescribed under the Companies Act guidelines.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Mandatory 2% Net Profit Allocation
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-default group">
              <div>
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
                  <Award size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Areas of CSR Activities
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  CSR activities must strictly align with Schedule VII of the Companies Act. Key segments include Education & Skill Development, Public Healthcare & Sanitation, Environmental Sustainability, Rural Infrastructure, Women Empowerment, Poverty Alleviation, and Disaster Relief.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Schedule VII Core Priorities
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* 5. DISTRICT PROFILE SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
          
          {/* Top Centered Header (Full Width) */}
          <div className="w-full text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 justify-center mb-2.5">
              <span className="h-0.5 w-6 bg-[#1B6CA8]"></span>
              <span className="text-xs font-bold text-[#1B6CA8] uppercase tracking-widest">
                Regional Demography
              </span>
              <span className="h-0.5 w-6 bg-[#1B6CA8]"></span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A3D62] tracking-tight leading-tight">
              Salem District Profile
            </h2>

            <p className="text-sm sm:text-base font-bold text-[#1B6CA8] tracking-wider uppercase mt-2">
              SALEM - "THE STEEL CITY"
            </p>
            <div className="w-20 h-1 bg-[#1B6CA8] mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Custom Illustrated Map Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute -inset-1.5 bg-[#E8F1F8] rounded-2xl transform -rotate-1"></div>
              <div className="relative bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-[#D9E2EC] w-full flex flex-col items-center">
                
                {/* Map Container with Overlays */}
                <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-[#D9E2EC] shadow-inner bg-slate-100">
                  <iframe
                    title="Salem District Live Interactive Map"
                    src="https://maps.google.com/maps?q=Salem,Tamil+Nadu,India&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full block"
                  />

                  {/* Top-Right Circular Icon Button */}
                  <div className="absolute top-3 right-3 bg-white/95 text-[#0A3D62] p-2 rounded-full shadow-md border border-slate-200/60 backdrop-blur-xs flex items-center justify-center pointer-events-none z-10">
                    <Compass size={16} className="text-[#0A3D62]" />
                  </div>

                  {/* Floating GPS Badge (Bottom-Left) */}
                  <div className="absolute bottom-3 left-3 bg-[#0A3D62] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-[#1B6CA8]/40 flex items-center gap-2 backdrop-blur-xs pointer-events-none z-10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]"></span>
                    </span>
                    <span className="font-mono tracking-tight text-[10px] sm:text-[11px]">GPS Core: 11.66°N, 78.14°E</span>
                  </div>
                </div>

                {/* Italicized Figure Caption */}
                <p className="mt-3.5 text-center text-xs text-[#6B7A8F] italic leading-snug px-2">
                  Figure: General Map of Salem District showcasing its prominent industrial and geographic positioning.
                </p>
              </div>
            </div>

            {/* Right Text Content & Horizontal Stats */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4 text-sm sm:text-base text-[#2C3E50] leading-relaxed">
                <p>
                  Salem is a Geologist's paradise, surrounded by hills and the landscape dotted with hillocks. Salem has a vibrant culture dating back to the ancient Kongu Nadu. As a district, Salem has its significance in various aspects.
                </p>
                <p>
                  The Salem Steel Plant was an ambitious project started with a view to utilise the locally available iron-ore from Kanchamalai to produce steel. This public sector company is engaged in rolling out cast steel blanks into sheets of required dimensions by cold and hot extrusion methods.
                </p>
                <p>
                  Mango fruits from Salem are enjoyed and much sought after, specially the variety Malgoa - which is the pride of Salem. Surrounded by majestic hills and rich mineral reserves, Salem represents a unique blend of heritage, industrial prowess, and agricultural excellence.
                </p>
              </div>

              {/* Three Horizontal Stat Cards */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-[#F8FAFC] border border-[#D9E2EC] p-4 rounded-xl text-center shadow-2xs hover:border-[#1B6CA8]/40 transition-colors">
                  <span className="text-[10px] font-extrabold text-[#6B7A8F] uppercase tracking-wider block mb-1">
                    Geographic Area
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#0A3D62]">
                    5,245 km²
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Western Tamil Nadu</span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#D9E2EC] p-4 rounded-xl text-center shadow-2xs hover:border-[#1B6CA8]/40 transition-colors">
                  <span className="text-[10px] font-extrabold text-[#6B7A8F] uppercase tracking-wider block mb-1">
                    District Population
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#0A3D62]">
                    34.8+ Lakhs
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Diverse Demography</span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#D9E2EC] p-4 rounded-xl text-center shadow-2xs hover:border-[#1B6CA8]/40 transition-colors">
                  <span className="text-[10px] font-extrabold text-[#6B7A8F] uppercase tracking-wider block mb-1">
                    Industrial Hub
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#1B6CA8]">
                    Steel & Textiles
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Major Manufacturing Hub</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* 6. PHOTO GALLERY & RECENT INITIATIVES SECTION (Responsive 4-Column Grid) */}
      {false && (
      <section className="py-20 bg-slate-50 border-t border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-0.5 w-6 bg-[#1B6CA8]"></span>
                <span className="text-xs font-bold text-[#1B6CA8] uppercase tracking-widest flex items-center gap-1.5">
                  <Camera size={13} />
                  <span>On-Ground Impact</span>
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A3D62] tracking-tight">
                Recent Initiatives & Photo Gallery
              </h2>
              <p className="text-sm text-[#6B7A8F] max-w-2xl">
                Visual documentation of ongoing and completed developmental projects transformed through CSR partnerships across Salem District.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-xl border border-[#D9E2EC] shadow-2xs shrink-0 self-start md:self-auto">
              {['All', 'Education', 'Healthcare', 'Environment', 'Infrastructure', 'Livelihood'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0A3D62] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0A3D62] hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================================
           * 🖼️ RESPONSIVE PHOTO GALLERY GRID (Mapping through RECENT_INITIATIVES_GALLERY)
           * To display your uploaded photos, drop your images in /public/assets/gallery/
           * and reference their filenames in RECENT_INITIATIVES_GALLERY at the top of this file.
           * ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {homeInitiatives
              .filter(item => selectedCategory === 'All' || (item?.category || '').toLowerCase() === selectedCategory.toLowerCase())
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxImage(item)}
                  className="bg-white rounded-2xl border border-[#D9E2EC] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 hover:border-[#1B6CA8]/40 flex flex-col group cursor-pointer"
                >
                  {/* Image Container with Hover Overlay & Local Path Loader */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.localPath || item.previewFallback}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Gracefully falls back to previewFallback URL when local file isn't uploaded yet
                        const target = e.currentTarget;
                        if (target.src !== item.previewFallback) {
                          target.src = item.previewFallback;
                        }
                      }}
                    />

                    {/* Category Badge */}
                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#0A3D62] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs border border-slate-200 uppercase tracking-wider">
                      {item.category}
                    </span>

                    {/* Hover Zoom Icon overlay */}
                    <div className="absolute inset-0 bg-[#0A3D62]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/95 text-[#0A3D62] p-2 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn size={18} />
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-[#0A3D62]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 font-mono">
                      <Calendar size={10} />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-[#1B6CA8] font-semibold mb-1">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#0A3D62] line-clamp-1 group-hover:text-[#1B6CA8] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#6B7A8F] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-[#1B6CA8]">
                      <span>View details</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Action Bar: View All Gallery Link */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-2xl border border-[#D9E2EC] shadow-xs gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1F8] border border-[#1B6CA8]/20 flex items-center justify-center text-[#0A3D62] shrink-0">
                <ImageIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A3D62]">Explore Complete Media & Video Archives</h4>
                <p className="text-xs text-[#6B7A8F]">Access high-resolution project documentation, ceremony videos, and progress metrics.</p>
              </div>
            </div>
            <button
              onClick={() => setActivePage('gallery')}
              className="inline-flex items-center gap-2 bg-[#0A3D62] hover:bg-[#1B6CA8] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>Visit Full Gallery</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>
      )}


      {/* 7. DISTRICT COLLECTOR / EX-OFFICIO PRESIDENT SECTION */}
      <section className="py-20 bg-white border-t border-[#D9E2EC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          
          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#e8f5e9] text-[#0a662e] border border-[#c8e6c9] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
              <CheckCircle size={12} className="text-[#0a662e]" />
              <span>President Message</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A3D62] tracking-tight">
              A Message from our President
            </h2>
          </div>

          {/* Quote Card */}
          <div className="bg-[#f8fafc] border border-slate-200/80 p-6 sm:p-10 rounded-3xl relative shadow-xs space-y-6">
            <div className="text-emerald-500/20 text-7xl font-serif font-black leading-none select-none -mb-5">“</div>
            
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed italic space-y-4 font-medium">
              <p>
                "The Salem District Administration Society serves as a unified force for localized advancement. By streamlining corporate CSR programs, we focus on impactful programs that foster inclusive growth."
              </p>
              <p>
                "Our current initiatives are centered on digitizing educational spaces, building sustainable water resources, and supplying top-tier resources to public hospitals. Together with corporate partners, we ensure an empowering, healthy, and progressive environment for every citizen."
              </p>
            </div>

            {/* Signature Bar */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="border-l-4 border-emerald-600 pl-4 py-1 space-y-0.5">
                <h4 className="font-extrabold text-base sm:text-lg text-[#0A3D62]">
                  Thiru. K. Elambahavath, I.A.S.
                </h4>
                <p className="text-xs font-semibold text-slate-500">
                  District Collector, Salem & President, SDAS
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 7. EXECUTIVE COMMITTEE SECTION */}
      <section className="py-24 bg-[#f8fafc] border-t border-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold text-[#0a662e] uppercase tracking-[0.15em]">Administrative Governance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Executive Committee
            </h2>
            <p className="text-[13px] text-[#64748b] leading-relaxed font-medium">
              Steered by dedicated administrative officers managing various government sectors for systematic CSR implementations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Committee Card 1 */}
            <div className="bg-white rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full cursor-default">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-green-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="bg-[#e8f5e9] text-[#0a662e] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded w-max mb-6">
                EXECUTIVE MEMBER
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-extrabold text-gray-900 leading-tight">Mr. Sivanandham, I.A.S.</h4>
                <p className="text-[13px] text-gray-500 font-medium mt-2 leading-relaxed">Additional Collector (DRDA), Salem</p>
              </div>
              
              <div className="mt-10 flex justify-between items-end border-t border-gray-50 pt-5">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  SDAS BOARD
                </span>
                <HeartHandshake size={20} className="text-[#0a662e]/30 group-hover:text-[#0a662e] transition-colors duration-300" />
              </div>
            </div>

            {/* Committee Card 2 */}
            <div className="bg-white rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full cursor-default">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-green-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="bg-[#e8f5e9] text-[#0a662e] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded w-max mb-6">
                EXECUTIVE MEMBER
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-extrabold text-gray-900 leading-tight">Mr. R. Ravikumar</h4>
                <p className="text-[13px] text-gray-500 font-medium mt-2 leading-relaxed">District Revenue Officer, Salem</p>
              </div>
              
              <div className="mt-10 flex justify-between items-end border-t border-gray-50 pt-5">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  SDAS BOARD
                </span>
                <HeartHandshake size={20} className="text-[#0a662e]/30 group-hover:text-[#0a662e] transition-colors duration-300" />
              </div>
            </div>

            {/* Committee Card 3 */}
            <div className="bg-white rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full cursor-default">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-green-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="bg-[#e8f5e9] text-[#0a662e] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded w-max mb-6">
                EXECUTIVE MEMBER
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-extrabold text-gray-900 leading-tight">Mrs. Shalini</h4>
                <p className="text-[13px] text-gray-500 font-medium mt-2 leading-relaxed">Personal Assistant (General) to the Collector, Salem</p>
              </div>
              
              <div className="mt-10 flex justify-between items-end border-t border-gray-50 pt-5">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  SDAS BOARD
                </span>
                <HeartHandshake size={20} className="text-[#0a662e]/30 group-hover:text-[#0a662e] transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 8. OUR JOURNEY SO FAR (Animated stats counter on scroll) */}
      <section 
        ref={statsSectionRef}
        className="py-16 bg-[#0A3D62] text-white"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our Journey So Far</h2>
            <p className="text-xs text-slate-300 uppercase tracking-widest mt-2">Quantitative impact metrics across Salem district</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Counter 1 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-md">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-300 font-mono tracking-tight">
                {totalProjects}
              </span>
              <span className="block text-[11px] sm:text-xs uppercase font-bold text-slate-200 mt-2.5 tracking-wider">
                Total Projects
              </span>
            </div>

            {/* Counter 2 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-md">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-300 font-mono tracking-tight">
                {ongoingProjects}
              </span>
              <span className="block text-[11px] sm:text-xs uppercase font-bold text-slate-200 mt-2.5 tracking-wider">
                Ongoing Projects
              </span>
            </div>

            {/* Counter 3 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-md">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-300 font-mono tracking-tight">
                {completedProjects}
              </span>
              <span className="block text-[11px] sm:text-xs uppercase font-bold text-slate-200 mt-2.5 tracking-wider">
                Completed Projects
              </span>
            </div>

            {/* Counter 4 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-md">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sky-200 font-mono tracking-tight">
                ₹ {totalValue} Lakhs
              </span>
              <span className="block text-[11px] sm:text-xs uppercase font-bold text-slate-200 mt-2.5 tracking-wider">
                Total Project Value
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* 9. OUR CONTRIBUTORS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-[#0a662e] uppercase tracking-[0.15em]">CSR CORPORATE PARTNERSHIPS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">Our Contributors</h2>
            <p className="text-[13px] sm:text-sm text-[#64748b] leading-relaxed">
              Click on any corporate partner listed below to view their detailed CSR profile, total sanctioned works, and complete list of public welfare schemes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                id: 1,
                name: 'Steel Authority of India Ltd (SAIL)',
                logo: '/images/sail-logo.png',
                desc: 'Supporting Salem\'s community healthcare, education, and rural development through sustained CSR initiatives from the Salem Steel Plant.' 
              },
              { 
                id: 4,
                name: 'Salem Starch & Sago Manufacturers (SAGOSERVE)',
                logo: '/images/sago-logo.png',
                desc: 'Enhancing women empowerment and artisan livelihoods with modern automated powerlooms and food processing units.' 
              },
              { 
                id: 3,
                name: 'Southern Iron & Steel Company (SISCOL / JSW)',
                logo: '/images/siscol-logo.png',
                desc: 'Strengthening rural education with smart science labs and community RO drinking water plants across Salem district.' 
              },
              { 
                id: 5,
                name: 'JSW Foundation (Salem Works)', 
                logo: '/images/jsw.jpg',
                desc: 'Upgrading community healthcare resources by supplying specialized medical diagnostic equipment to government hospitals.' 
              },
              { 
                id: 2,
                name: 'Tamil Nadu Magnesite Limited (TANMAG)',
                logo: '/images/tanmag-logo.png',
                desc: 'Empowering agricultural communities and environmental conservation through green belt afforestation and water rejuvenation.' 
              }
            ].map((company) => (
              <div 
                key={company.id} 
                onClick={() => {
                  if (onSelectContributor) {
                    onSelectContributor(company.id);
                  } else {
                    setActivePage('contributors');
                  }
                }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-green-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-20 h-20 bg-white border border-gray-100 shadow-sm rounded-xl flex items-center justify-center mb-6 text-gray-400 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building size={24} />
                  )}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">{company.name}</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-8 flex-1">
                  {company.desc}
                </p>
                <div className="text-[11px] font-bold text-[#0a662e] uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  <span>VIEW PROFILE</span>
                  <ArrowRight size={14} className="text-[#0a662e]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 10. SOCIAL MEDIA SECTION */}
      <section className="py-12 bg-slate-50 border-t border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full text-center space-y-6">
          <h3 className="text-md font-bold text-[#0A3D62] uppercase tracking-wider">Follow Our Developments</h3>
          <div className="flex justify-center items-center gap-6">
            <a 
              href="https://www.facebook.com/SalemDistrictAdministration" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#D9E2EC] text-[#0A3D62] flex items-center justify-center hover:bg-[#0A3D62] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm" 
              aria-label="Facebook"
              title="Official Facebook Page"
            >
              <Facebook size={18} />
            </a>
            <a 
              href="https://www.instagram.com/salemdistrictadministration/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#D9E2EC] text-[#0A3D62] flex items-center justify-center hover:bg-[#0A3D62] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm" 
              aria-label="Instagram"
              title="Official Instagram Handle"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://twitter.com/SalemCollector" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#D9E2EC] text-[#0A3D62] flex items-center justify-center hover:bg-[#0A3D62] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm" 
              aria-label="X (formerly Twitter)"
              title="Official X / Twitter (@SalemCollector)"
            >
              <Twitter size={18} />
            </a>
            <a 
              href="https://www.linkedin.com/company/district-administration-salem" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#D9E2EC] text-[#0A3D62] flex items-center justify-center hover:bg-[#0A3D62] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm" 
              aria-label="LinkedIn"
              title="Official LinkedIn Profile"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="https://www.youtube.com/@salemdistrictadministration" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white border border-[#D9E2EC] text-[#0A3D62] flex items-center justify-center hover:bg-[#0A3D62] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm" 
              aria-label="YouTube"
              title="Official YouTube Channel"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 🖼️ INTERACTIVE LIGHTBOX MODAL */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Image Display */}
            <div className="md:w-3/5 bg-slate-900 flex items-center justify-center relative min-h-[300px] md:min-h-[420px]">
              <img
                src={activeLightboxImage.localPath}
                alt={activeLightboxImage.title}
                className="w-full h-full object-contain max-h-[500px]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== activeLightboxImage.previewFallback) {
                    target.src = activeLightboxImage.previewFallback;
                  }
                }}
              />
            </div>

            {/* Modal Metadata / Description */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#E8F1F8] text-[#0A3D62] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#1B6CA8]/20">
                    {activeLightboxImage.category}
                  </span>
                  <span className="text-xs text-[#6B7A8F] font-mono flex items-center gap-1">
                    <Calendar size={12} />
                    {activeLightboxImage.date}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#0A3D62] leading-snug">
                  {activeLightboxImage.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#1B6CA8] font-semibold">
                  <MapPin size={14} />
                  <span>{activeLightboxImage.location}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed pt-2 border-t border-slate-100">
                  {activeLightboxImage.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] text-[#6B7A8F] font-mono">
                  <span>Registry Path: </span>
                  <code className="text-[#0A3D62] bg-slate-100 px-1.5 py-0.5 rounded">{activeLightboxImage.localPath}</code>
                </div>
                <button
                  onClick={() => setActiveLightboxImage(null)}
                  className="w-full bg-[#0A3D62] hover:bg-[#1B6CA8] text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
