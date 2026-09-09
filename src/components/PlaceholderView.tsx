import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Sparkles, Building, Calendar, Info } from 'lucide-react';
import { ActivePage } from '../types';

interface PlaceholderViewProps {
  pageId: ActivePage;
}

export default function PlaceholderView({ pageId }: PlaceholderViewProps) {
  const getPageTitle = () => {
    switch (pageId) {
      case 'about': return 'About Our Board & Society';
      case 'join': return 'Join as Corporate Partner';
      case 'contributors': return 'Our Elite Contributors';
      case 'gallery': return 'Media & Project Gallery';
      case 'contact': return 'Contact District Collectorate';
      default: return 'Administrative Portal';
    }
  };

  const isContact = pageId === 'contact';
  const isAbout = pageId === 'about';

  return (
    <div className="w-full min-h-[50vh] bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-[#D9E2EC] p-8 shadow-sm space-y-6 text-center animate-fade-in">
        
        {/* Visual Graphic */}
        <div className="w-16 h-16 bg-[#E8F1F8] text-[#0A3D62] rounded-full flex items-center justify-center mx-auto border border-[#1B6CA8]/10">
          {isContact ? (
            <Building size={28} />
          ) : (
            <Sparkles size={28} className="text-[#1B6CA8] animate-pulse" />
          )}
        </div>

        {/* Dynamic Titles */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#0A3D62] tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="text-xs text-[#6B7A8F] uppercase tracking-widest font-mono">
            Salem District Administration Society (SDAS)
          </p>
        </div>

        {/* Coming Soon details */}
        <div className="text-xs text-[#2C3E50] leading-relaxed max-w-sm mx-auto">
          {isContact ? (
            <div className="space-y-4 text-left pt-2">
              <p className="text-center text-slate-500 font-medium mb-3">
                For administrative queries, physical site inspections, or official correspondence, please contact:
              </p>
              
              <div className="bg-[#E8F1F8] p-4 rounded-lg space-y-3 border border-[#1B6CA8]/15">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#0A3D62] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-700">
                    District Collectorate, Fort, Salem,<br />Tamil Nadu - 636001
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-[#0A3D62] shrink-0" />
                  <a href="mailto:salemdistrictpmu@gmail.com" className="hover:underline font-bold text-[#1B6CA8]">
                    salemdistrictpmu@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-[#0A3D62] shrink-0" />
                  <span className="font-medium text-slate-700">+91 427 2452244</span>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                Collectorate Working Hours: Monday to Friday (10:00 AM - 5:45 PM)
              </p>
            </div>
          ) : isAbout ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 justify-center bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold">
                <Info size={14} className="shrink-0" />
                <span>Currently Under Construction</span>
              </div>
              <p className="text-slate-500 leading-relaxed font-sans">
                We are currently compiling the profile details, board resolutions, and active member list for the Salem District Administration Society. 
              </p>
              <p className="text-slate-400 text-[11px]">
                Please refer to the <strong>About Our Society</strong> summary on the main Home screen.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 justify-center bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold">
                <Info size={14} className="shrink-0" />
                <span>Page Coming Soon</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                This section is under active preparation by the Salem Administrative Society's IT Support wing. Dynamic files and registries will be loaded shortly.
              </p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-[10px] text-[#6B7A8F] block mb-2 font-mono">
            Revision Protocol: July 2026
          </span>
        </div>

      </div>
    </div>
  );
}
