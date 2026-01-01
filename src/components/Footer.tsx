import { motion } from 'framer-motion';
import { useSocialLinks } from '@/hooks/useFirebaseData';
import { Mail, Linkedin, Facebook, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const { socialLinks } = useSocialLinks();

  const socialIcons = [
    { icon: Mail, href: `mailto:${socialLinks.email}`, label: 'Email' },
    { icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
    { icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
  ];

  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold gradient-text mb-4">Muhammad Arib</h3>
          <p className="text-muted-foreground mb-6">
            Digital Marketing Specialist | Helping brands grow online
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            {socialIcons.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
          
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              Made with <Heart size={14} className="text-destructive fill-destructive" /> by Muhammad Arib
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
