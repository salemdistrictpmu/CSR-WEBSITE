import React, { useState, useEffect } from 'react';
import { Camera, Video, Play, X, Eye, ZoomIn, Film, Sparkles, ExternalLink, Calendar, MapPin, Filter } from 'lucide-react';

/* ========================================================================================
 * 📸 GALLERY VIEW PHOTO DIRECTORY CONFIGURATION
 * ========================================================================================
 * HOW TO UPLOAD YOUR MULTIPLE PHOTOS:
 * 
 * STEP 1: CREATE THE FOLDER
 *         Create the folder: public/assets/gallery/  (or src/assets/gallery/)
 * 
 * STEP 2: DROP YOUR IMAGE FILES
 *         Place your photos inside:
 *         e.g., img1.jpg, img2.jpg, img3.jpg, img4.jpg, img5.jpg, img6.jpg, etc.
 * 
 * STEP 3: CONFIGURE THE ARRAY BELOW
 *         Add/edit items in the GALLERY_IMAGES array:
 *         {
 *           id: 7,
 *           localPath: "assets/gallery/img7.jpg",
 *           previewFallback: "https://images.unsplash.com/...", // used in preview until local file exists
 *           title: "Your Project Title",
 *           category: "Education" | "Healthcare" | "Environment" | "Infrastructure" | "Livelihood",
 *           location: "Location in Salem",
 *           date: "Feb 2026",
 *           description: "Brief summary..."
 *         }
 * ======================================================================================== */

interface GalleryImage {
  id: number;
  localPath: string;
  previewFallback: string;
  title: string;
  category: string;
  location: string;
  date?: string;
  description: string;
}

interface GalleryVideo {
  id: number;
  title: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  description: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    localPath: "/assets/gallery/img1.jpg",
    previewFallback: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    title: "Smart Classroom Digital Labs",
    category: "Education",
    location: "Govt Hr Sec School, Omalur",
    date: "Feb 2026",
    description: "Installation of smart interactive boards, digital e-learning kiosks, and student science kits to modernize public schooling."
  },
  {
    id: 2,
    localPath: "/assets/gallery/img2.jpg",
    previewFallback: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    title: "Primary Healthcare Diagnostics Wing",
    category: "Healthcare",
    location: "PHC, Valapady",
    date: "Jan 2026",
    description: "Providing modern laboratory diagnostics, patient monitors, and specialized maternity beds in rural health centers."
  },
  {
    id: 3,
    localPath: "/assets/gallery/img3.jpg",
    previewFallback: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    title: "Afforestation & Urban Green Belt",
    category: "Environment",
    location: "Mettur Bypass Foothills",
    date: "Jan 2026",
    description: "Community-driven tree plantation targeting 10,000 native saplings with drip irrigation to restore ecological balance."
  },
  {
    id: 4,
    localPath: "/assets/gallery/img4.jpg",
    previewFallback: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800",
    title: "Community Lake Restoration & Desilting",
    category: "Environment",
    location: "Panamarathupatti Lake Basin",
    date: "Dec 2025",
    description: "Restoring natural water retention capacities and reinforcing bunds to support local agricultural irrigation."
  },
  {
    id: 5,
    localPath: "/assets/gallery/img5.jpg",
    previewFallback: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
    title: "Women's Powerloom & Craft Training Center",
    category: "Livelihood",
    location: "Thalaivasal Block",
    date: "Nov 2025",
    description: "Automated powerlooms and tailored skill training units empowering 120+ rural women artisans."
  },
  {
    id: 6,
    localPath: "/assets/gallery/img6.jpg",
    previewFallback: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    title: "Rural Solar Street Light Installation",
    category: "Infrastructure",
    location: "Yercaud Tribal Hamlets",
    date: "Oct 2025",
    description: "Eco-friendly solar-powered street lighting and decentralized battery banks to improve safety and nighttime mobility."
  },
  {
    id: 7,
    localPath: "/assets/gallery/img7.jpg",
    previewFallback: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80&w=800",
    title: "Mobile Primary Healthcare Outreach Van",
    category: "Healthcare",
    location: "Attur Rural Belt",
    date: "Sep 2025",
    description: "Specialized mobile clinic providing on-site diagnostics, diabetes screening, and emergency medicine in remote hamlets."
  },
  {
    id: 8,
    localPath: "/assets/gallery/img8.jpg",
    previewFallback: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800",
    title: "Model Anganwadi Infrastructure Modernization",
    category: "Education",
    location: "Sankari Block",
    date: "Aug 2025",
    description: "Modern child-friendly infrastructure, clean RO water systems, and play-based learning equipment for early childhood education."
  }
];

const GALLERY_VIDEOS: GalleryVideo[] = [
  {
    id: 1,
    title: "Official Collectorate Project Briefing",
    category: "District Overview",
    duration: "5:12 Mins",
    thumbnailUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600",
    description: "The District Collector outlines strategic goals and administrative pathways for coordinated corporate partnerships."
  },
  {
    id: 2,
    title: "Salem Green Mission Inauguration",
    category: "Environment",
    duration: "3:45 Mins",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    description: "Highlights from the launch of the mega-plantation drive and lake desiltation projects initiated in partnership with local corporations."
  },
  {
    id: 3,
    title: "Smart Classroom Launch Event",
    category: "Education",
    duration: "4:20 Mins",
    thumbnailUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600",
    description: "Student and teacher testimonials following the deployment of interactive digital infrastructure in rural government high schools."
  }
];

const CACHE_KEY_PHOTOS = 'SDAS_GALLERY_PHOTOS_CACHE';
const CACHE_KEY_VIDEOS = 'SDAS_GALLERY_VIDEOS_CACHE';

export default function GalleryView() {
  const [imagesList, setImagesList] = useState<GalleryImage[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_PHOTOS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [videosList, setVideosList] = useState<GalleryVideo[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_VIDEOS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY_PHOTOS);
      return !cached;
    } catch (e) {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [streamingVideo, setStreamingVideo] = useState<GalleryVideo | null>(null);

  const API_ENDPOINT = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbz_OL6IbMhJy0dtEXqODK20d1LhbaNJ_ZvuIqAdbzU9vvwi2x_ZUGA-FcWZ25KnvXfW/exec';

  // Helper to convert Google Drive sharing links to direct image source
  const normalizeMediaUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
    }
    return url;
  };

  // Helper to format Google Sheet timestamp / date strings into clean "Aug 2026"
  const formatDateDisplay = (rawDate: any): string => {
    if (!rawDate) return '';
    const str = String(rawDate).trim();
    if (str.length < 15 && !str.includes('GMT') && !str.includes('00:00:00')) return str;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return str.split('00:00:00')[0].trim();
  };

  // Helper to extract high-resolution dynamic video thumbnails (Google Drive / YouTube / Category)
  const getVideoThumbnailUrl = (videoUrl: string, category?: string): string => {
    if (!videoUrl) {
      return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600';
    }
    const str = videoUrl.trim();

    // 1. Google Drive Video -> High-Res Google Drive Thumbnail Stream
    if (str.includes('drive.google.com')) {
      const match = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }

    // 2. YouTube Video -> High-Definition YouTube Thumbnail
    if (str.includes('youtube.com') || str.includes('youtu.be')) {
      const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }

    // 3. Category Fallback Image
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('education')) return 'https://images.unsplash.com/photo-1580582932707-520aed937b7f?auto=format&fit=crop&q=80&w=800';
    if (catLower.includes('health')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800';
    if (catLower.includes('environ')) return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800';
    if (catLower.includes('livelihood')) return 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800';

    return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600';
  };

  useEffect(() => {
    fetchLiveGallery();
  }, []);

  const fetchLiveGallery = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}?action=getGallery`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Verify that this is real gallery data from CSR_Gallery tab and not the default interventions tab
          const isRealGalleryData = data.some(row => 
            row.mediaUrl || row.Media_URL || 
            (row.type && (String(row.type).toLowerCase() === 'photo' || String(row.type).toLowerCase() === 'video'))
          );

          if (isRealGalleryData) {
            const livePhotos: GalleryImage[] = [];
            const liveVideos: GalleryVideo[] = [];

            data.forEach((row, idx) => {
              const rawType = (row.type || row.Type || 'photo').toString().toLowerCase().trim();
              const mediaUrl = normalizeMediaUrl(row.mediaUrl || row.Media_URL || row.url || row.URL || '');
              const title = row.title || row.Title || `Gallery Item ${idx + 1}`;
              const category = row.category || row.Category || 'General';
              const description = row.description || row.Description || '';
              const location = row.location || row.Location || 'Salem District';
              const date = formatDateDisplay(row.date || row.Date || '');
              const duration = row.duration || row.Duration || 'Video';

              if (rawType.includes('video')) {
                const rawVideoLink = row.mediaUrl || row.Media_URL || row.url || row.URL || '';
                liveVideos.push({
                  id: row.id || idx + 1,
                  title,
                  category,
                  duration,
                  thumbnailUrl: getVideoThumbnailUrl(rawVideoLink, category),
                  videoUrl: rawVideoLink,
                  description
                });
              } else {
                livePhotos.push({
                  id: row.id || idx + 1,
                  localPath: mediaUrl.startsWith('http') ? mediaUrl : (mediaUrl ? `/assets/gallery/${mediaUrl}` : ''),
                  previewFallback: mediaUrl.startsWith('http') ? mediaUrl : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
                  title,
                  category,
                  location,
                  date,
                  description
                });
              }
            });

            if (livePhotos.length > 0) {
              setImagesList(livePhotos);
              try {
                localStorage.setItem(CACHE_KEY_PHOTOS, JSON.stringify(livePhotos));
              } catch (e) {}
            }
            if (liveVideos.length > 0) {
              setVideosList(liveVideos);
              try {
                localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(liveVideos));
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      console.log('Error syncing live gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Education', 'Healthcare', 'Environment', 'Infrastructure', 'Livelihood'];

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pb-32 space-y-10 animate-fade-in">
      
      {/* Page Title & Context */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1F8] border border-[#1B6CA8]/10 text-[#0A3D62] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Film size={14} className="text-[#1B6CA8]" />
          <span>Milestones & Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A3D62] tracking-tight">
          Project Showcase & Gallery
        </h1>
        <p className="text-sm text-[#6B7A8F] leading-relaxed">
          High-resolution visual archives and verified milestones across Salem District CSR interventions.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="max-w-md mx-auto flex bg-white p-1 rounded-xl border border-[#D9E2EC] shadow-xs">
        <button
          onClick={() => {
            setActiveTab('images');
            setStreamingVideo(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'images'
              ? 'bg-[#0A3D62] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A3D62] hover:bg-slate-50'
          }`}
        >
          <Camera size={14} />
          <span>Images ({imagesList.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('videos');
            setSelectedImage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-[#0A3D62] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0A3D62] hover:bg-slate-50'
          }`}
        >
          <Video size={14} />
          <span>Videos ({videosList.length})</span>
        </button>
      </div>

      {/* Category Filter Pills (For Images Tab) */}
      {activeTab === 'images' && (
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#0A3D62] text-white border-[#0A3D62] shadow-xs'
                  : 'bg-white text-slate-600 border-[#D9E2EC] hover:bg-slate-100 hover:text-[#0A3D62]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* IMAGES TAB GRID (Responsive 4-Column Grid) */}
      {activeTab === 'images' && (
        <div className="max-w-7xl mx-auto">
          {loading && imagesList.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-3 animate-pulse">
                  <div className="aspect-4/3 bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {imagesList
                .filter((img) => selectedCategory === 'All' || (img?.category || '').toLowerCase() === selectedCategory.toLowerCase())
                .map((img) => (
                  <div 
                    key={img.id}
                    id={`gallery-img-card-${img.id}`}
                    className="bg-white rounded-2xl border border-[#D9E2EC] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col hover:border-[#1B6CA8]/40"
                  >
                    {/* Thumbnail area */}
                    <div 
                      onClick={() => setSelectedImage(img)}
                      className="aspect-4/3 bg-slate-100 relative overflow-hidden cursor-pointer group"
                    >
                      <img 
                        src={img.localPath || img.previewFallback} 
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== img.previewFallback) {
                            target.src = img.previewFallback;
                          }
                        }}
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#0A3D62]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/95 text-[#0A3D62] p-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <ZoomIn size={18} />
                        </div>
                      </div>
                      {/* Floating category badge */}
                      <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#0A3D62] text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs border border-slate-200/60 uppercase tracking-wider">
                        {img.category}
                      </span>
                      {/* Date badge */}
                      {img.date && (
                        <span className="absolute bottom-2.5 right-2.5 bg-[#0A3D62]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs font-mono">
                          {img.date}
                        </span>
                      )}
                    </div>

                    {/* Info block */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[11px] text-[#1B6CA8] font-semibold">
                          <MapPin size={12} className="shrink-0" />
                          <span className="truncate">{img.location}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-[#0A3D62] leading-tight line-clamp-2 group-hover:text-[#1B6CA8] transition-colors">
                          {img.title}
                        </h4>
                        <p className="text-xs text-[#6B7A8F] leading-relaxed line-clamp-2">
                          {img.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-[#6B7A8F]">
                        <span>Salem District CSR</span>
                        <button 
                          onClick={() => setSelectedImage(img)}
                          className="text-[#1B6CA8] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Expand</span>
                          <Eye size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* VIDEOS TAB GRID */}
      {activeTab === 'videos' && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videosList.map((vid) => (
              <div 
                key={vid.id}
                id={`gallery-vid-card-${vid.id}`}
                className="bg-white rounded-xl border border-[#D9E2EC] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col hover:border-[#1B6CA8]/30"
              >
                {/* Thumbnail play block */}
                <div 
                  onClick={() => setStreamingVideo(vid)}
                  className="h-44 bg-slate-100 relative overflow-hidden cursor-pointer group"
                >
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7f?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-[#0A3D62]/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 text-[#0A3D62] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-[#0A3D62] ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#1B6CA8] uppercase tracking-wider block mb-1">
                      {vid.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#0A3D62]">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-[#6B7A8F] mt-1 line-clamp-2">
                      {vid.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => setStreamingVideo(vid)}
                    className="text-xs font-bold text-[#1B6CA8] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    <span>Watch Recording</span>
                    <Play size={10} className="fill-[#1B6CA8]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE EXPAND MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="md:w-3/5 bg-slate-900 flex items-center justify-center min-h-[300px] md:min-h-[420px]">
              <img 
                src={selectedImage.localPath || selectedImage.previewFallback} 
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[500px]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== selectedImage.previewFallback) {
                    target.src = selectedImage.previewFallback;
                  }
                }}
              />
            </div>

            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 pr-10">
                  <span className="bg-[#E8F1F8] text-[#0A3D62] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#1B6CA8]/20">
                    {selectedImage.category}
                  </span>
                  {selectedImage.date && (
                    <span className="text-xs text-slate-600 font-mono font-semibold flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                      <Calendar size={13} className="text-[#1B6CA8]" />
                      <span>{selectedImage.date}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-[#0A3D62] leading-snug">
                  {selectedImage.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#1B6CA8] font-semibold">
                  <MapPin size={14} />
                  <span>{selectedImage.location}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed pt-2 border-t border-slate-100">
                  {selectedImage.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full bg-[#0A3D62] hover:bg-[#1B6CA8] text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {streamingVideo && (() => {
        const getVideoPlayerInfo = (url?: string) => {
          if (!url) return null;
          const str = url.trim();

          // 1. Google Drive Video Link
          if (str.includes('drive.google.com')) {
            const match = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/id=([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
              const fileId = match[1];
              return {
                type: 'gdrive',
                src: `https://drive.google.com/file/d/${fileId}/preview`,
                directUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
              };
            }
          }

          // 2. YouTube Video Link
          if (str.includes('youtube.com') || str.includes('youtu.be')) {
            const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (match && match[1]) {
              return {
                type: 'youtube',
                src: `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&playsinline=1&enablejsapi=1`,
                directUrl: `https://www.youtube.com/watch?v=${match[1]}`
              };
            }
          }

          // 3. Direct Video file (mp4, webm, etc.)
          if (str.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || str.startsWith('blob:')) {
            return {
              type: 'video',
              src: str,
              directUrl: str
            };
          }

          return {
            type: 'link',
            src: str,
            directUrl: str
          };
        };

        const playerInfo = getVideoPlayerInfo(streamingVideo.videoUrl);

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in"
            onClick={() => setStreamingVideo(null)}
          >
            <div 
              className="bg-slate-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/10 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-3.5 sm:p-4 bg-[#0A3D62] text-white flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase shrink-0">
                    {streamingVideo.category}
                  </span>
                  <h3 className="text-xs sm:text-base font-bold truncate text-white">
                    {streamingVideo.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setStreamingVideo(null)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Player Stage */}
              <div className="aspect-video w-full bg-black flex items-center justify-center relative">
                {playerInfo ? (
                  playerInfo.type === 'gdrive' || playerInfo.type === 'youtube' ? (
                    <iframe 
                      src={playerInfo.src} 
                      title={streamingVideo.title}
                      className="w-full h-full border-0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen 
                      loading="lazy"
                    />
                  ) : playerInfo.type === 'video' ? (
                    <video 
                      src={playerInfo.src} 
                      controls 
                      autoPlay 
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="space-y-3 text-center p-8 text-white">
                      <Film size={44} className="mx-auto text-emerald-400 animate-pulse" />
                      <h4 className="text-base font-bold">{streamingVideo.title}</h4>
                      <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        {streamingVideo.description || `Video documentation recording (${streamingVideo.duration})`}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3 text-center p-8 text-white">
                    <Film size={44} className="mx-auto text-emerald-400" />
                    <h4 className="text-base font-bold">{streamingVideo.title}</h4>
                  </div>
                )}
              </div>

              {/* Video Details & Mobile Fallback Action Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                <div className="space-y-1">
                  <p className="line-clamp-2 leading-relaxed font-sans text-[11px] sm:text-xs">
                    {streamingVideo.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400">
                    Duration: <strong className="text-white">{streamingVideo.duration}</strong>
                  </div>
                </div>

                {/* Direct Launch Button for Mobile Browsers */}
                {playerInfo?.directUrl && (
                  <a 
                    href={playerInfo.directUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1B6CA8] hover:bg-[#0A3D62] text-white rounded-xl text-[11px] font-bold tracking-wide transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
                  >
                    <Play size={12} className="fill-white" />
                    <span>Open in Fullscreen App</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
