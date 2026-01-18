import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/useFirebaseData';
import { Star, Quote, Send, ArrowRight } from 'lucide-react';
import { pushData } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TestimonialsSection = () => {
  const { testimonials, loading } = useTestimonials();
  const [showForm, setShowForm] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', stars: 5, feedback: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await pushData('testimonials', {
        name: feedbackForm.name.trim(),
        stars: feedbackForm.stars,
        feedback: feedbackForm.feedback.trim(),
        approved: false,
        date: new Date().toISOString(),
      });

      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted for review.",
      });
      setFeedbackForm({ name: '', stars: 5, feedback: '' });
      setShowForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-20">
        <div className="section-container flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  const displayedTestimonials = testimonials.slice(0, 3);
  const hasMore = testimonials.length > 3;

  return (
    <section id="testimonials" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it – hear from the clients I've had the pleasure of working with.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        {displayedTestimonials.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="card-elevated p-6 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Quote className="absolute top-4 right-4 text-primary/20" size={40} />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      testimonial.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < testimonial.stars ? 'fill-primary text-primary' : 'text-muted'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.feedback}"
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Link to="/testimonials">
              <Button size="lg" className="gap-2">
                Explore All Testimonials
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Feedback Button / Form */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full btn-outline flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Leave Your Feedback
            </button>
          ) : (
            <motion.form
              onSubmit={handleSubmitFeedback}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6 space-y-4"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                className="input-modern"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, stars: star })}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        className={star <= feedbackForm.stars ? 'fill-primary text-primary' : 'text-muted-foreground'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="Your Feedback"
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                rows={4}
                className="input-modern resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
