import React, { useState } from 'react';
import { 
  Building2, HeartHandshake, CheckCircle2, ArrowRight, 
  Send, ShieldCheck, FileSpreadsheet, Sparkles, AlertCircle,
  HelpCircle, Users, Award, ExternalLink
} from 'lucide-react';
import { ActivePage } from '../types';

interface JoinViewProps {
  setActivePage: (page: ActivePage) => void;
}

export default function JoinView({ setActivePage }: JoinViewProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    industrySector: 'Manufacturing & Heavy Industries',
    otherIndustrySector: '',
    csrBudgetEstimate: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    proposedSectors: [] as string[],
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const API_ENDPOINT = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbz_OL6IbMhJy0dtEXqODK20d1LhbaNJ_ZvuIqAdbzU9vvwi2x_ZUGA-FcWZ25KnvXfW/exec';

  const sectorOptions = [
    'Quality Education & Smart Schools',
    'Rural Healthcare & Telemedicine',
    'Afforestation & Lake Restoration',
    'Women Empowerment & Skill Livelihoods',
    'Drinking Water & Rural Infrastructure'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSector = (sector: string) => {
    setFormData(prev => {
      const exists = prev.proposedSectors.includes(sector);
      return {
        ...prev,
        proposedSectors: exists 
          ? prev.proposedSectors.filter(s => s !== sector)
          : [...prev.proposedSectors, sector]
      };
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone validation
    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      showToast('Please enter a valid 10-digit mobile/phone number.');
      return;
    }

    const resolvedSector = formData.industrySector === 'Other / Philanthropic Trust' && formData.otherIndustrySector.trim()
      ? `Other (${formData.otherIndustrySector.trim()})`
      : formData.industrySector;

    setSubmitting(true);
    try {
      const payload = {
        companyName: formData.companyName,
        contactPerson: `${formData.contactPerson} (${formData.designation})`,
        email: formData.email,
        phone: formData.phone,
        industrySector: resolvedSector,
        csrBudget: formData.csrBudgetEstimate,
        message: `[Corporate Onboarding Registration]\nIndustry: ${resolvedSector}\nEstimated Budget: ${formData.csrBudgetEstimate}\nInterested Sectors: ${formData.proposedSectors.join(', ')}\nRemarks: ${formData.message}`,
        selectedItems: [{
          interventionId: 'ONBOARDING',
          title: `Corporate Registration - ${resolvedSector}`,
          location: 'Salem District',
          budget: formData.csrBudgetEstimate || 'Open'
        }]
      };

      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      setSubmitted(true);
      showToast('Registration submitted successfully to Salem District Administration Society!');
    } catch (err) {
      console.error(err);
      // Fallback
      try {
        await fetch(API_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            companyName: formData.companyName,
            contactPerson: `${formData.contactPerson} (${formData.designation})`,
            email: formData.email,
            phone: formData.phone,
            industrySector: resolvedSector,
            csrBudget: formData.csrBudgetEstimate,
            message: `[Corporate Onboarding Registration]\nIndustry: ${resolvedSector}\nEstimated Budget: ${formData.csrBudgetEstimate}\nInterested Sectors: ${formData.proposedSectors.join(', ')}\nRemarks: ${formData.message}`,
            selectedItems: [{
              interventionId: 'ONBOARDING',
              title: `Corporate Registration - ${resolvedSector}`,
              location: 'Salem District',
              budget: formData.csrBudgetEstimate || 'Open'
            }]
          })
        });
        setSubmitted(true);
      } catch (fallbackErr) {
        showToast('Unable to submit right now. Please reach out to salemdistrictpmu@gmail.com directly.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pb-32 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A3D62] text-white px-5 py-3 rounded-xl shadow-xl border border-white/20 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Hero & Heading */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1F8] border border-[#1B6CA8]/10 text-[#0A3D62] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          <Building2 size={14} className="text-[#1B6CA8]" />
          <span>Corporate Social Responsibility (CSR) Partnership</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3D62] tracking-tight">
          Partner with Salem District
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join forces with the Salem District Administration Society (SDAS) to deploy meaningful, audited, and high-impact CSR interventions under Section 135 of the Companies Act.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Why Partner & Benefits */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#0A3D62] flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={20} />
              <span>Why Partner With SDAS?</span>
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: '100% District-Level Coordination',
                  desc: 'Direct administrative facilitation, land allocations, and departmental approvals without bureaucratic delays.'
                },
                {
                  title: 'Evidence-Based Priority Projects',
                  desc: 'Pre-identified developmental interventions vetted by local administrative engineers and line departments.'
                },
                {
                  title: 'Transparent Fund Utilization',
                  desc: 'Full audit compliance, statutory progress tracking, and milestone-linked completion certificates.'
                },
                {
                  title: 'Corporate Brand Recognition',
                  desc: 'Formal recognition on district registries, inaugurations, public utility structures, and official publications.'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 font-bold mb-0.5">{item.title}</strong>
                    <span className="text-slate-500 leading-relaxed">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Already have specific projects in mind?</span>
              <button
                onClick={() => setActivePage('interventions')}
                className="text-xs font-bold text-[#1B6CA8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Live Catalog</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick Contact Card */}
          <div className="bg-[#E8F1F8] border border-[#1B6CA8]/15 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-[#0A3D62] uppercase tracking-wider">
              Need Direct Consultation?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our Project Management Unit (PMU) is available for scheduled discussions, physical site visits, or customized MoUs.
            </p>
            <div className="text-xs font-mono text-[#0A3D62] font-bold">
              Email: salemdistrictpmu@gmail.com | Tel: +91 95669 99695
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Onboarding Registration Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#0A3D62]">
                  Registration Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for expressing your interest to partner with Salem District Administration Society. Our Project Management Unit will review your profile and reach out within 2 business days.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setActivePage('interventions')}
                    className="bg-[#0A3D62] hover:bg-[#1B6CA8] text-white text-xs font-bold px-6 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Explore Active CSR Projects
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Another Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-[#0A3D62]">
                    Corporate Partner Onboarding Form
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill out your company details to initiate formal engagement with the District Administration.
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Company / Organization Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    placeholder="e.g. Salem Steel Industries Ltd."
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                  />
                </div>

                {/* Industry Sector & Budget Estimate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                      Industry Sector
                    </label>
                    <select
                      name="industrySector"
                      value={formData.industrySector}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                    >
                      <option value="Manufacturing & Heavy Industries">Manufacturing & Heavy Industries</option>
                      <option value="Textiles & Handlooms">Textiles & Handlooms</option>
                      <option value="Information Technology / ITES">Information Technology / ITES</option>
                      <option value="Agri-business & Food Processing">Agri-business & Food Processing</option>
                      <option value="Banking & Financial Services">Banking & Financial Services</option>
                      <option value="Mining & Mineral Processing">Mining & Mineral Processing</option>
                      <option value="Other / Philanthropic Trust">Other / Philanthropic Trust</option>
                    </select>

                    {formData.industrySector === 'Other / Philanthropic Trust' && (
                      <div className="mt-2.5 animate-fadeIn">
                        <label className="block text-[10px] font-bold text-[#1B6CA8] uppercase tracking-wide mb-1">
                          Specify Industry / Sector <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="otherIndustrySector"
                          required
                          placeholder="e.g. Healthcare, Renewable Energy, Logistics..."
                          value={formData.otherIndustrySector}
                          onChange={handleInputChange}
                          className="w-full text-xs p-3 bg-white border border-[#1B6CA8]/40 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium shadow-2xs"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                      Estimated CSR Budget (Lakhs)
                    </label>
                    <input
                      type="text"
                      name="csrBudgetEstimate"
                      placeholder="e.g. ₹ 50 Lakhs"
                      value={formData.csrBudgetEstimate}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Contact Person & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                      Nodal Contact Person <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      placeholder="e.g. Mr. S. Rajesh"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      placeholder="e.g. Head of CSR / Director"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                      Official Email ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. csr@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                      Official Phone / Mobile <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile (e.g. 9876543210)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Sector Interests */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-2">
                    Preferred Focus Domains (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sectorOptions.map((sector) => {
                      const isSelected = formData.proposedSectors.includes(sector);
                      return (
                        <button
                          type="button"
                          key={sector}
                          onClick={() => toggleSector(sector)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0A3D62] text-white border-[#0A3D62]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{sector}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Remarks / Message */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Specific CSR Scope or Comments <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Share any preferred geography (Taluk), timelines, or specific requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#1B6CA8] focus:border-[#1B6CA8] outline-none resize-none font-medium"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-[#0A3D62] hover:bg-[#1B6CA8] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Submitting Registration...' : 'Submit Partnership Registration'}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
