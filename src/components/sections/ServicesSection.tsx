import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServices, useSocialLinks } from '@/hooks/useFirebaseData';
import { ArrowRight, X, Linkedin, Mail, Send } from 'lucide-react';
import { pushData } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

const ServicesSection = () => {
  const { services, loading } = useServices();
  const { socialLinks } = useSocialLinks();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireForm, setHireForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireForm.name || !hireForm.email || !hireForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await pushData('hireRequests', {
        ...hireForm,
        serviceId: selectedService?.id,
        serviceName: selectedService?.title,
        date: new Date().toISOString(),
        status: 'pending'
      });
      toast({
        title: "Request Sent!",
        description: "We will contact you on your email soon.",
      });
      setHireForm({ name: '', email: '', message: '' });
      setShowHireModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="services" className="py-20">
        <div className="section-container flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // Don't show section if no services
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            My <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital marketing solutions tailored to your brand's unique needs.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="card-elevated overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedService(service)}
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl opacity-50">📦</div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Learn More
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Detail Modal */}
        <AnimatePresence>
          {selectedService && !showHireModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
            >
              <motion.div
                className="w-full max-w-lg card-elevated p-6 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                  {selectedService.image ? (
                    <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-7xl">📦</div>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-4">{selectedService.title}</h3>
                <p className="text-muted-foreground mb-6">{selectedService.details || selectedService.description}</p>

                <button
                  onClick={() => setShowHireModal(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Hire for This Service
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hire Modal */}
        <AnimatePresence>
          {showHireModal && selectedService && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHireModal(false)}
            >
              <motion.div
                className="w-full max-w-md card-elevated p-6 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowHireModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>

                <h3 className="text-2xl font-bold mb-2">Hire Me</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  For: {selectedService.title}
                </p>

                {/* Quick Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#0077B5]/10 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                    >
                      <Linkedin size={20} />
                      <span className="font-medium">LinkedIn</span>
                    </a>
                  )}
                  {socialLinks.email && (
                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Mail size={20} />
                      <span className="font-medium">Email</span>
                    </a>
                  )}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 text-muted-foreground">Or Direct Hire</span>
                  </div>
                </div>

                <form onSubmit={handleHireSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={hireForm.name}
                    onChange={(e) => setHireForm({ ...hireForm, name: e.target.value })}
                    className="input-modern"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={hireForm.email}
                    onChange={(e) => setHireForm({ ...hireForm, email: e.target.value })}
                    className="input-modern"
                  />
                  <textarea
                    placeholder="Your Message"
                    value={hireForm.message}
                    onChange={(e) => setHireForm({ ...hireForm, message: e.target.value })}
                    rows={4}
                    className="input-modern resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Note: We will contact you on your email.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ServicesSection;
