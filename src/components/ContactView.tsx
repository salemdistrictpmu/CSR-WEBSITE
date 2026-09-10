import React, { useState } from 'react';
import { Building, Phone, Mail, MapPin, Clock, Compass, Copy, ArrowUpRight, Check, Sparkles } from 'lucide-react';

export default function ContactView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [emailModalData, setEmailModalData] = useState<{
    email: string;
    name: string;
    designation: string;
  } | null>(null);

  const showToast = (msg: string, key?: string) => {
    setToastMessage(msg);
    if (key) setCopiedKey(key);
    setTimeout(() => {
      setToastMessage(null);
      setCopiedKey(null);
    }, 3000);
  };

  const handleOpenEmailOptions = (email: string, name: string, designation: string) => {
    navigator.clipboard.writeText(email);
    showToast(`Email copied to clipboard: ${email}`);
    setEmailModalData({ email, name, designation });
  };

  const contacts = [
    {
      role: "District Collector",
      designation: "District Collector",
      name: "Thiru. K. Elambahavath, I.A.S.",
      dept: "District Collector & District Magistrate, Salem",
      desc: "Directs all administrative operations, legislative coordination, socio-economic welfare distribution, and overall governance in Salem District.",
      landline: "0427-2450301",
      email: "collrslm@nic.in",
      initials: "KE",
      colorTheme: "amber",
      borderColor: "border-l-amber-500",
      avatarBg: "bg-amber-100",
      avatarText: "text-amber-700",
      pillBg: "bg-amber-50",
      pillText: "text-amber-700"
    },
    {
      role: "Joint Director / Project Director",
      designation: "Joint Director/Project Director, DRDA",
      name: "Mr. Sivanandham, I.A.S.",
      dept: "Joint Director/Project Director, DRDA, Salem",
      desc: "Spearheads all rural infrastructure deployments, CSR alignments, drinking water expansion schemes, and self-help group programs.",
      landline: "0427-2451236",
      email: "drdaslm@nic.in",
      initials: "SI",
      colorTheme: "blue",
      borderColor: "border-l-blue-500",
      avatarBg: "bg-blue-100",
      avatarText: "text-blue-700",
      pillBg: "bg-blue-50",
      pillText: "text-blue-700"
    },
    {
      role: "District Revenue Officer",
      designation: "District Revenue Officer",
      name: "Mr. R. Ravikumar",
      dept: "District Revenue Officer, Salem",
      desc: "Commanding authority over land acquisitions, stamp duties, revenue recovery, law and order, and public grievance registers.",
      landline: "0427-2450303",
      email: "droslm@nic.in",
      initials: "RR",
      colorTheme: "emerald",
      borderColor: "border-l-emerald-500",
      avatarBg: "bg-emerald-100",
      avatarText: "text-emerald-700",
      pillBg: "bg-emerald-50",
      pillText: "text-emerald-700"
    },
    {
      role: "PA (General) to District Collector",
      designation: "Personal Assistant (General) to District Collector",
      name: "Mrs. Shalini",
      dept: "Personal Assistant (General) to the Collector, Salem",
      desc: "Manages executive appointments, official correspondence, administrative protocols, public representations, and coordination for the District Collector.",
      landline: "0427-2417575",
      email: "pag.slm@tn.gov.in",
      initials: "SH",
      colorTheme: "teal",
      borderColor: "border-l-teal-500",
      avatarBg: "bg-teal-100",
      avatarText: "text-teal-700",
      pillBg: "bg-teal-50",
      pillText: "text-teal-700"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 pb-32 animate-fade-in relative overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A3D62] text-white px-5 py-3 rounded-xl shadow-xl border border-white/20 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Page Title & Context */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 mb-16 z-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
          <Building size={14} className="text-emerald-600" />
          <span>SALEM ADMINISTRATION CONTACTS</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tight">
          Administrative Contact Directory
        </h1>
        
        <p className="text-sm font-bold text-emerald-600 tracking-widest uppercase">
          DIRECT PUBLIC CHANNELS &mdash; மக்கள் தொடர்பு மையம்
        </p>
      </div>

      {/* Sub-header pill */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          OFFICIAL DIRECTORY LEDGER • 4 KEY CONTACTS
        </div>
      </div>

      {/* Grid of 4 Detailed Contact Cards */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 z-10 mb-14">
        {contacts.map((officer, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-8 border border-gray-100 ${officer.borderColor} border-l-4 hover:-translate-y-1`}
          >
            {/* Header section with Avatar and Role */}
            <div className="flex gap-5 mb-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${officer.avatarBg} ${officer.avatarText}`}>
                {officer.initials}
              </div>
              <div className="space-y-1.5 pt-1">
                <span className={`inline-block ${officer.pillBg} ${officer.pillText} text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider`}>
                  {officer.role}
                </span>
                <h4 className="font-extrabold text-xl text-gray-900 tracking-tight">
                  {officer.name}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {officer.dept}
                </p>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-[13px] text-gray-500 leading-relaxed mb-6 flex-grow">
              {officer.desc}
            </p>

            {/* Contact Details */}
            <div className="space-y-3 mb-8 text-[13px] bg-slate-50/70 rounded-xl p-4 border border-slate-100">
              {/* Landline */}
              <div 
                className="flex items-center justify-between group/copy cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(officer.landline);
                  showToast(`Landline copied: ${officer.landline}`, `landline-${idx}`);
                }}
                title="Click to copy landline number"
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone size={14} className="text-emerald-600" />
                  <span className="font-medium text-xs">Landline No:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 font-mono text-xs sm:text-sm">{officer.landline}</span>
                  {copiedKey === `landline-${idx}` ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={12} className="text-gray-300 group-hover/copy:text-gray-500 transition-colors" />
                  )}
                </div>
              </div>

              {/* Email */}
              <div 
                className={`flex items-center justify-between group/copy p-2 rounded-lg transition-colors ${officer.email ? 'cursor-pointer hover:bg-white' : 'cursor-default'}`}
                onClick={() => {
                  if (officer.email) {
                    navigator.clipboard.writeText(officer.email);
                    showToast(`Email copied: ${officer.email}`, `email-${idx}`);
                  }
                }}
                title={officer.email ? "Click to copy email address" : undefined}
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Mail size={14} className="text-emerald-600" />
                  <span className="font-medium text-xs">Official Email:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs sm:text-sm ${officer.email ? 'text-gray-800 group-hover/copy:text-emerald-600' : 'text-gray-400 font-normal italic'} transition-colors`}>
                    {officer.email || "—"}
                  </span>
                  {officer.email && (
                    copiedKey === `email-${idx}` ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} className="text-gray-300 group-hover/copy:text-gray-500 transition-colors" />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.open(`tel:${officer.landline.replace(/[^0-9]/g, '')}`, '_self');
                }}
                className="flex-1 flex justify-center items-center gap-2 bg-[#0A3D62] hover:bg-[#062842] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 text-xs cursor-pointer shadow-sm hover:shadow"
              >
                <Phone size={14} /> Call Landline
              </button>
              <button 
                onClick={() => {
                  handleOpenEmailOptions(officer.email, officer.name, officer.designation);
                }}
                className="flex-1 flex justify-center items-center gap-2 bg-[#0a662e] hover:bg-[#085225] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 text-xs cursor-pointer shadow-sm hover:shadow"
              >
                <Mail size={14} /> Send Email
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* District Collectorate Coordinates & Services */}
      <div className="max-w-7xl mx-auto mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <Compass size={20} className="text-emerald-600" />
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">District Collectorate Coordinates & Services</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Office Registry Timings */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Official Registry Timings</span>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">10:00 AM — 05:45 PM</h4>
                <p className="text-[11px] text-gray-500 mb-3">Monday through Friday</p>
                <span className="inline-block bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded">
                  Closed Saturdays, Sundays, & Public Holidays
                </span>
              </div>
            </div>
          </div>

          {/* Geographical Coordinates */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Geographical Coordinates</span>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">District Collectorate</h4>
                <p className="text-[11px] text-gray-500 mb-1">11.6643° N, 78.1460° E</p>
                <p className="text-[11px] text-gray-500">Salem, Tamil Nadu - 636001</p>
              </div>
            </div>
          </div>

          {/* Salem District PMU Coordinates */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Salem District PMU</span>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <a 
                  href="tel:9566999695" 
                  className="font-extrabold text-sm text-gray-900 hover:text-emerald-600 transition-colors block font-mono"
                  title="Click to call PMU"
                >
                  +91 95669 99695
                </a>
                <p className="text-[11px] text-gray-500">Project Management Unit (PMU)</p>
                <button
                  onClick={() => handleOpenEmailOptions('salemdistrictpmu@gmail.com', 'Salem District PMU', 'Project Management Unit')}
                  className="text-[12px] font-bold text-emerald-600 hover:underline flex items-center gap-1.5 cursor-pointer pt-1"
                >
                  <Mail size={12} />
                  <span>salemdistrictpmu@gmail.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Email Client Chooser Modal */}
      {emailModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-scale-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setEmailModalData(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Send Official Email</h3>
                <p className="text-xs text-gray-500">{emailModalData.designation}</p>
              </div>
            </div>

            {/* Email Address Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Recipient Address</span>
                <span className="font-mono text-sm font-bold text-[#0A3D62] truncate block mt-0.5">{emailModalData.email}</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(emailModalData.email);
                  showToast(`Email copied: ${emailModalData.email}`);
                }}
                className="shrink-0 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Choose How To Open:</p>

              {/* 1. Gmail Webmail */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailModalData.email)}&su=${encodeURIComponent('CSR Welfare Initiative Enquiry - Salem District Administration Society')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setEmailModalData(null)}
                className="w-full flex items-center justify-between bg-red-50 hover:bg-red-100 text-red-700 font-bold p-3.5 rounded-xl border border-red-200 transition-all text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>Compose in Gmail (Browser)</span>
                </div>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* 2. Default Desktop Mail App */}
              <a
                href={`mailto:${emailModalData.email}?subject=${encodeURIComponent('CSR Welfare Initiative Enquiry - Salem District Administration Society')}`}
                onClick={() => setEmailModalData(null)}
                className="w-full flex items-center justify-between bg-[#0A3D62] hover:bg-[#062842] text-white font-bold p-3.5 rounded-xl transition-all text-xs cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-emerald-400" />
                  <span>Open Default Mail App (Outlook / Apple Mail)</span>
                </div>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* 3. Outlook Webmail */}
              <a
                href={`https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(emailModalData.email)}&subject=${encodeURIComponent('CSR Welfare Initiative Enquiry - Salem District Administration Society')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setEmailModalData(null)}
                className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold p-3.5 rounded-xl border border-blue-200 transition-all text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Compose in Outlook Web</span>
                </div>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <button 
                onClick={() => setEmailModalData(null)}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
