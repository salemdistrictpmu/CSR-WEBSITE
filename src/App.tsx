import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import InterventionsView from './components/InterventionsView';
import AboutView from './components/AboutView';
import ContributorsView from './components/ContributorsView';
import GalleryView from './components/GalleryView';
import ContactView from './components/ContactView';
import JoinView from './components/JoinView';
import PlaceholderView from './components/PlaceholderView';
import Footer from './components/Footer';
import { ActivePage } from './types';
import { ArrowUp } from 'lucide-react';

const VALID_PAGES: ActivePage[] = [
  'home', 'about', 'interventions', 'join', 'contributors', 'gallery', 'contact'
];

const getPageFromHash = (): ActivePage => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (VALID_PAGES.includes(hash as ActivePage)) {
    return hash as ActivePage;
  }
  return 'home';
};

export default function App() {
  const [activePage, setActivePageState] = useState<ActivePage>(() => getPageFromHash());
  const [selectedContributorId, setSelectedContributorId] = useState<string | number | null>(null);

  const scrollToViewPosition = (page: ActivePage) => {
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const navEl = document.querySelector('nav');
        if (navEl) {
          const navTop = navEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: navTop, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  // Function to change page and push history state
  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    if (page !== 'contributors') {
      setSelectedContributorId(null);
    }
    const targetHash = page === 'home' ? '' : `#${page}`;
    
    // Only push if different from current hash
    const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const currentTarget = page === 'home' ? '' : page;
    
    if (currentHash !== currentTarget) {
      window.history.pushState({ page }, '', targetHash || window.location.pathname);
    }
    scrollToViewPosition(page);
  };

  // Handler when a user clicks View Profile on a company from Home page
  const handleSelectContributor = (contributorId: string | number) => {
    setSelectedContributorId(contributorId);
    setActivePageState('contributors');
    window.history.pushState({ page: 'contributors' }, '', '#contributors');
    scrollToViewPosition('contributors');
  };

  // Sync with browser Back and Forward buttons (popstate & hashchange)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const pageFromState = e.state?.page;
      const targetPage = (pageFromState && VALID_PAGES.includes(pageFromState))
        ? pageFromState
        : getPageFromHash();
      setActivePageState(targetPage);
      scrollToViewPosition(targetPage);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Initial state registration
    const initialPage = getPageFromHash();
    if (initialPage !== 'home') {
      window.history.replaceState({ page: initialPage }, '', `#${initialPage}`);
      scrollToViewPosition(initialPage);
    } else {
      window.history.replaceState({ page: 'home' }, '', window.location.pathname);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Helper to render current page view
  const renderPageView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView setActivePage={setActivePage} onSelectContributor={handleSelectContributor} />;
      case 'interventions':
        return <InterventionsView />;
      case 'about':
        return <AboutView />;
      case 'join':
        return <JoinView setActivePage={setActivePage} />;
      case 'contributors':
        return <ContributorsView setActivePage={setActivePage} initialExpandedId={selectedContributorId} />;
      case 'gallery':
        return <GalleryView />;
      case 'contact':
        return <ContactView />;
      default:
        return <PlaceholderView pageId={activePage} />;
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] selection:bg-[#E8F1F8] selection:text-[#0A3D62] relative">
      {/* 1. Header with Government/Society details */}
      <Header />

      {/* 2. Main Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* 3. Main Content Stage */}
      <main className="flex-grow">
        {renderPageView()}
      </main>

      {/* 4. Sticky Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-[#0A3D62] hover:bg-[#1B6CA8] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none border border-white/20 cursor-pointer"
        aria-label="Back to Top"
        title="Scroll to Top"
      >
        <ArrowUp size={18} />
      </button>

      {/* 5. Clean Structured Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
