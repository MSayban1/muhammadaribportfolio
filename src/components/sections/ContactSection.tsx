import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocialLinks } from '@/hooks/useFirebaseData';
import { Mail, Linkedin, Facebook, Instagram, Send, MapPin, Clock } from 'lucide-react';
import { pushData } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { 
  contactFormSchema, 
  validateForm, 
  checkRateLimit, 
  getRateLimitResetTime,
  sanitizeForDisplay,
  checkForSpam
} from '@/lib/security';

const ContactSection = () => {
  const { socialLinks } = useSocialLinks();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Rate limiting check
    if (!checkRateLimit('contact-form', 3, 60000)) {
      const resetTime = Math.ceil(getRateLimitResetTime('contact-form', 60000) / 1000);
      toast({
        title: "Too Many Requests",
        description: `Please wait ${resetTime} seconds before submitting again.`,
        variant: "destructive"
      });
      return;
    }

    // Validate form data
    const validation = validateForm(contactFormSchema, form);
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
    if (checkForSpam(form.message)) {
      toast({
        title: "Message Blocked",
        description: "Your message was flagged as spam. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Sanitize data before storing
      await pushData('contacts', {
        name: sanitizeForDisplay(form.name),
        email: form.email.trim().toLowerCase(),
        message: sanitizeForDisplay(form.message),
        date: new Date().toISOString(),
        read: false
      });
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: socialLinks.email, href: `mailto:${socialLinks.email}` },
    { icon: MapPin, label: 'Location', value: 'Available Worldwide', href: '#' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: '#' },
  ];

  const socialIcons = [
    { icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn', color: 'bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/30' },
    { icon: Facebook, href: socialLinks.facebook, label: 'Facebook', color: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30' },
    { icon: Instagram, href: socialLinks.instagram, label: 'Instagram', color: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30' },
    { icon: Mail, href: `mailto:${socialLinks.email}`, label: 'Email', color: 'bg-primary/10 text-primary border-primary/30' },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to take your digital presence to the next level? Let's talk!
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <info.icon className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-4">Follow Me</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border ${social.color} hover:scale-105 transition-transform`}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <social.icon size={20} />
                    <span className="font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-modern"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-modern"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  placeholder="How can I help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="input-modern resize-none"
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={18} />
                {submitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
