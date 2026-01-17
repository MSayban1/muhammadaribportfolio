import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PostsSection from '@/components/sections/PostsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import { getData, setData } from '@/lib/firebase';

const Index = () => {
  // Track page views - simple visitor tracking without third-party APIs
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get or create visitor ID
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('visitorId', visitorId);
        }

        // Get current analytics
        const analytics = await getData('analytics') || { pageViews: 0, visitors: {} };
        
        // Increment page views
        analytics.pageViews = (analytics.pageViews || 0) + 1;
        
        // Track visitor with browser info
        if (!analytics.visitors) analytics.visitors = {};
        
        const existingVisitor = analytics.visitors[visitorId];
        const browserInfo = navigator.userAgent;
        const language = navigator.language || 'Unknown';
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
        
        analytics.visitors[visitorId] = {
          ip: visitorId, // Use visitor ID as identifier
          country: timezone.split('/')[0] || 'Unknown', // Derive region from timezone
          city: timezone.split('/')[1] || '',
          browser: browserInfo.includes('Chrome') ? 'Chrome' : 
                   browserInfo.includes('Firefox') ? 'Firefox' : 
                   browserInfo.includes('Safari') ? 'Safari' : 
                   browserInfo.includes('Edge') ? 'Edge' : 'Other',
          language: language,
          timezone: timezone,
          visitCount: (existingVisitor?.visitCount || 0) + 1,
          lastVisit: new Date().toISOString(),
          firstVisit: existingVisitor?.firstVisit || new Date().toISOString()
        };
        
        await setData('analytics', analytics);
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackVisit();
  }, []);

  // Disable right-click and drag on images
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };
    const preventDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDragStart);
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDragStart);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <PostsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
