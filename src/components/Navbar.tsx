import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, HeartHandshake, UserPlus, Users, Image as ImageIcon, PhoneCall } from 'lucide-react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActivePage, label: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'about' as ActivePage, label: 'About Us', labelTa: 'எங்களைப் பற்றி', icon: BookOpen },
    { id: 'interventions' as ActivePage, label: 'CSR Interventions', labelTa: 'சிஎஸ்ஆர் திட்டங்கள்', icon: HeartHandshake },
    { id: 'join' as ActivePage, label: 'Join Us', labelTa: 'இணையுங்கள்', icon: UserPlus },
    { id: 'contributors' as ActivePage, label: 'Our Contributors', labelTa: 'பங்களிப்பாளர்கள்', icon: Users },
    { id: 'gallery' as ActivePage, label: 'Gallery', labelTa: 'புகைப்படங்கள்', icon: ImageIcon },
    { id: 'contact' as ActivePage, label: 'Contact Us', labelTa: 'தொடர்புக்கு', icon: PhoneCall },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0A3D62] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Brand Accent for Mobile */}
          <div className="flex items-center md:hidden">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
              SDAS Portal
            </span>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center justify-center w-full gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-md text-xs lg:text-[13px] font-semibold transition-all duration-300 group hover:bg-[#1B6CA8]/30 ${
                    isActive ? 'bg-[#1B6CA8] text-white shadow-sm' : 'text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon size={14} className={isActive ? 'text-emerald-300' : 'text-slate-300 group-hover:text-white'} />
                    <span>{item.label}</span>
                  </span>
                  
                  {/* Subtle Indicator for active state */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#1B6CA8] focus:outline-none focus:ring-2 focus:ring-[#E8F1F8] transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden bg-[#0A3D62] border-t border-[#1B6CA8]/30 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#1B6CA8] text-white' : 'text-slate-100 hover:bg-[#1B6CA8]/30'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-emerald-300' : 'text-slate-300'} />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-[10px] text-slate-300 font-sans">{item.labelTa}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
