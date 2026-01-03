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
import { pushData, getData, setData } from '@/lib/firebase';

const Index = () => {
  // Track page views
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get current analytics
        const analytics = await getData('analytics') || { pageViews: 0, visitors: {} };
        
        // Increment page views
        analytics.pageViews = (analytics.pageViews || 0) + 1;
        
        // Track visitor (using timestamp as simple identifier)
        const visitorId = localStorage.getItem('visitorId') || `visitor_${Date.now()}`;
        if (!localStorage.getItem('visitorId')) {
          localStorage.setItem('visitorId', visitorId);
        }
        
        if (!analytics.visitors) analytics.visitors = {};
        analytics.visitors[visitorId] = {
          count: (analytics.visitors[visitorId]?.count || 0) + 1,
          lastVisit: new Date().toISOString()
        };
        
        await setData('analytics', analytics);
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackVisit();
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
