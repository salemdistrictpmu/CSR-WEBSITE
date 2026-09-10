import React from 'react';
import { Mail, Phone, MapPin, Building, ShieldCheck, ExternalLink } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const currentYear = 2026;

  return (
    <footer className="bg-[#0A3D62] text-white pt-12 pb-6 border-t-4 border-[#1B6CA8]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Organization Brief */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-8 bg-emerald-400 rounded"></div>
            <div>
              <h3 className="font-bold text-base tracking-wide leading-tight text-white">
                Salem District
              </h3>
              <p className="text-xs font-semibold text-emerald-300">
                Administration Society
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-bold">
            சேலம் மாவட்ட நிர்வாகச் சமூகம்
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            A district-level government initiative driving sustainable rural and urban development through structured Corporate Social Responsibility (CSR) partnerships.
          </p>
        </div>

        {/* Column 2: Quick Navigation Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 border-b border-[#1B6CA8]/30 pb-2 mb-4">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {[
              { id: 'home' as ActivePage, label: 'Home' },
              { id: 'about' as ActivePage, label: 'About Our Society' },
              { id: 'interventions' as ActivePage, label: 'CSR Interventions (Live)' },
              { id: 'join' as ActivePage, label: 'Join as Corporate Partner' },
              { id: 'contributors' as ActivePage, label: 'Our Contributors' },
              { id: 'gallery' as ActivePage, label: 'Gallery' },
              { id: 'contact' as ActivePage, label: 'Contact Collectorate' },
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => {
                    setActivePage(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-300 transition-colors duration-200 text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#1B6CA8] group-hover:text-emerald-300">▪</span>
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 border-b border-[#1B6CA8]/30 pb-2 mb-4">
            Contact Details
          </h4>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <Building size={16} className="text-[#1B6CA8] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white block font-semibold mb-0.5">Salem District Administration Society (SDAS)</strong>
                <span>District Collectorate, Salem,</span><br />
                <span>Tamil Nadu - 636001</span>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="text-[#1B6CA8] shrink-0" />
              <a href="mailto:salemdistrictpmu@gmail.com" className="hover:text-emerald-300 transition-colors">
                salemdistrictpmu@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="text-[#1B6CA8] shrink-0" />
              <a href="tel:9566999695" className="hover:text-emerald-300 transition-colors font-mono">
                +91 95669 99695 (PMU Desk)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={15} className="text-[#1B6CA8] shrink-0" />
              <span>Salem, Tamil Nadu - 636001</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Portals & External Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 border-b border-[#1B6CA8]/30 pb-2 mb-4">
            Important Portals
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <a 
                href="https://salem.nic.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <span>Salem District Website</span>
                <ExternalLink size={11} className="text-slate-400" />
              </a>
            </li>
            <li>
              <a 
                href="https://www.tn.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <span>Government of Tamil Nadu</span>
                <ExternalLink size={11} className="text-slate-400" />
              </a>
            </li>
            <li>
              <a 
                href="https://www.csr.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <span>National CSR Portal India</span>
                <ExternalLink size={11} className="text-slate-400" />
              </a>
            </li>
            <li>
              <a 
                href="https://www.mca.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <span>Ministry of Corporate Affairs</span>
                <ExternalLink size={11} className="text-slate-400" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-[#1B6CA8]/20 flex justify-center items-center text-[11px] text-slate-400 text-center">
        <div>
          Copyright © {currentYear} <strong>Salem District Administration Society</strong>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
