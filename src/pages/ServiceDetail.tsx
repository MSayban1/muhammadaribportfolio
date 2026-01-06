import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Linkedin, Mail, Send, X, Quote } from 'lucide-react';
import { getData, pushData, Service, SocialLinks } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  hireRequestSchema, 
  validateForm, 
  checkRateLimit, 
  getRateLimitResetTime,
  sanitizeForDisplay,
  checkForSpam
} from '@/lib/security';

interface ServiceReview {
  id?: string;
  name: string;
  stars: number;
  feedback: string;
  image?: string;
  date: string;
  approved?: boolean;
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireForm, setHireForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const [serviceData, linksData, reviewsData] = await Promise.all([
          getData(`services/${id}`),
          getData('socialLinks'),
          getData(`serviceReviews/${id}`)
        ]);
        
        if (serviceData) {
          setService({ ...serviceData, id });
        }
        setSocialLinks(linksData);
        
        if (reviewsData) {
          const reviewsList = Object.entries(reviewsData)
            .map(([reviewId, review]) => ({ id: reviewId, ...(review as ServiceReview) }))
            .filter(r => r.approved !== false);
          setReviews(reviewsList);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Rate limiting check
    if (!checkRateLimit('hire-form', 3, 120000)) {
      const resetTime = Math.ceil(getRateLimitResetTime('hire-form', 120000) / 1000);
      toast({
        title: "Too Many Requests",
        description: `Please wait ${resetTime} seconds before submitting again.`,
        variant: "destructive"
      });
      return;
    }

    // Validate form data
    const validation = validateForm(hireRequestSchema, hireForm);
    if ('errors' in validation) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast({
        title: "Validation Error",
        description: firstError || "Please check your input.",
        variant: "destructive"
      });
      return;
    }

    // Check for spam
    if (checkForSpam(hireForm.message)) {
      toast({
        title: "Request Blocked",
        description: "Your message was flagged as spam. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Sanitize data before storing
      await pushData('hireRequests', {
        name: sanitizeForDisplay(hireForm.name),
        email: hireForm.email.trim().toLowerCase(),
        message: sanitizeForDisplay(hireForm.message),
        serviceId: id,
        serviceName: service?.title,
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="section-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Service Image */}
                {service.image && (
                  <div className="w-full aspect-video rounded-3xl overflow-hidden mb-8">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Service Title & Description */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{service.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                
                {/* Details */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                  {(service.details || service.description).split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>

                {/* Reviews Section */}
                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
                  
                  {reviews.length > 0 ? (
                    <div className="space-y-4 mb-8">
                      {reviews.map((review, index) => (
                        <motion.div
                          key={review.id}
                          className="card-elevated p-6 relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Quote className="absolute top-4 right-4 text-primary/20" size={32} />
                          
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                              {review.image ? (
                                <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                              ) : (
                                review.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < review.stars ? 'fill-primary text-primary' : 'text-muted'}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground">"{review.feedback}"</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No reviews yet.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Hire Options */}
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-24 card-elevated p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-6">Hire Me</h3>
                
                {/* Quick Contact Options */}
                <div className="space-y-3 mb-6">
                  {socialLinks?.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl bg-[#0077B5]/10 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                    >
                      <Linkedin size={20} />
                      <span className="font-medium">Connect on LinkedIn</span>
                    </a>
                  )}
                  
                  {socialLinks?.email && (
                    <a
                      href={`mailto:${socialLinks.email}?subject=Inquiry about ${service.title}`}
                      className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Mail size={20} />
                      <span className="font-medium">Send Email</span>
                    </a>
                  )}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 text-muted-foreground">Or</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowHireModal(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Direct Hire Request
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Hire Modal */}
      {showHireModal && (
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

            <h3 className="text-2xl font-bold mb-2">Send Hire Request</h3>
            <p className="text-muted-foreground text-sm mb-6">
              For: {service.title}
            </p>

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
                We will contact you on your email.
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

      <Footer />
    </div>
  );
};

export default ServiceDetail;
