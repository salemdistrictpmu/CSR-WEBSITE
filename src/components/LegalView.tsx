import React from 'react';
import { ShieldCheck, FileText, Map, Mail, Phone, ChevronRight } from 'lucide-react';
import { ActivePage } from '../types';

interface LegalViewProps {
  pageId: 'privacy' | 'terms' | 'sitemap';
  setActivePage: (page: ActivePage) => void;
}

const NAV_LINKS: { id: ActivePage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Our Society' },
  { id: 'interventions', label: 'CSR Interventions' },
  { id: 'join', label: 'Join as Corporate Partner' },
  { id: 'contributors', label: 'Our Contributors' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact Us' },
];

export default function LegalView({ pageId, setActivePage }: LegalViewProps) {
  const config = {
    privacy: {
      icon: ShieldCheck,
      title: 'Privacy Policy',
      subtitle: 'How Salem District Administration Society handles your information',
    },
    terms: {
      icon: FileText,
      title: 'Terms of Use',
      subtitle: 'Conditions governing the use of this official portal',
    },
    sitemap: {
      icon: Map,
      title: 'Site Map',
      subtitle: 'A complete overview of every section on this portal',
    },
  }[pageId];

  const Icon = config.icon;

  return (
    <div className="w-full min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 pb-32 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-[#E8F1F8] text-[#0A3D62] rounded-full flex items-center justify-center mx-auto border border-[#1B6CA8]/10">
            <Icon size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A3D62] tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm text-[#6B7A8F]">{config.subtitle}</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-[#D9E2EC] shadow-sm p-8 sm:p-10">
          {pageId === 'privacy' && (
            <div className="space-y-6 text-sm text-[#2C3E50] leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">Information We Collect</h2>
                <p>
                  When a corporate entity registers as a CSR partner through the "Join Us" form, we collect the
                  company name, contact person details, official email address, phone number, and the CSR sectors
                  of interest submitted voluntarily through that form. We do not collect this information through
                  any other page on this portal.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">How We Use It</h2>
                <p>
                  Submitted details are used solely to evaluate corporate partnership proposals and to enable the
                  Project Management Unit (PMU) of the Salem District Administration Society to get in touch
                  regarding CSR project alignment, site visits, and onboarding. Information is not sold, rented,
                  or shared with any third party for marketing purposes.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">Data Retention & Security</h2>
                <p>
                  Registration data is retained only for as long as necessary to process a partnership and for
                  administrative record-keeping as required under applicable government record retention norms.
                  Reasonable technical and administrative safeguards are used to protect submitted information.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">Your Rights</h2>
                <p>
                  You may request a correction or removal of information submitted through this portal at any time
                  by writing to the Project Management Unit at the email address below.
                </p>
              </section>
            </div>
          )}

          {pageId === 'terms' && (
            <div className="space-y-6 text-sm text-[#2C3E50] leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">Purpose of This Portal</h2>
                <p>
                  This portal is maintained by the Salem District Administration Society (SDAS) to coordinate
                  Corporate Social Responsibility (CSR) partnerships within Salem District, Tamil Nadu, in line
                  with Section 135 and Schedule VII of the Companies Act, 2013.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">Accuracy of Information</h2>
                <p>
                  Project statuses, budget figures, and contributor details are updated periodically. While every
                  effort is made to keep them current, SDAS makes no warranty as to the completeness of figures
                  shown at any given moment; official CSR utilization figures are governed by statutory filings
                  made under the Companies Act.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">Use of Content</h2>
                <p>
                  Content on this portal may be referenced for research, media reporting, or public information
                  purposes with attribution to "Salem District Administration Society." Logos of corporate
                  contributors remain the property of their respective organizations and are displayed here solely
                  to recognize their CSR contributions.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="font-bold text-[#0A3D62] text-base">External Links</h2>
                <p>
                  This portal links to external government websites (such as salem.nic.in, tn.gov.in, csr.gov.in,
                  and mca.gov.in) for reference. SDAS is not responsible for the content or availability of
                  external sites.
                </p>
              </section>
            </div>
          )}

          {pageId === 'sitemap' && (
            <div className="space-y-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1B6CA8]/30 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-semibold text-[#0A3D62] text-sm">{link.label}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1B6CA8] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActivePage('privacy')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1B6CA8]/30 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-semibold text-[#0A3D62] text-sm">Privacy Policy</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1B6CA8] transition-all" />
                </button>
                <button
                  onClick={() => setActivePage('terms')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1B6CA8]/30 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                >
                  <span className="font-semibold text-[#0A3D62] text-sm">Terms of Use</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1B6CA8] transition-all" />
                </button>
              </div>
            </div>
          )}

          {/* Contact footer inside card */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#1B6CA8]" />
              <a href="mailto:salemdistrictpmu@gmail.com" className="hover:text-[#1B6CA8] hover:underline">
                salemdistrictpmu@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#1B6CA8]" />
              <span>+91 427 2452244</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
