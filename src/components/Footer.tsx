import { motion } from 'framer-motion';
import { useSocialLinks, useCreatorInfo } from '@/hooks/useFirebaseData';
import { Mail, Linkedin, Facebook, Instagram } from 'lucide-react';
import sabanLogo from '@/assets/saban-productions.png';

const Footer = () => {
  const { socialLinks } = useSocialLinks();
  const { creatorInfo } = useCreatorInfo();

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
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Developed by</span>
              <a
                href={creatorInfo.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                <img 
                  src={sabanLogo} 
                  alt="SABAN PRODUCTIONS" 
                  className="h-6 w-6 rounded object-contain"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                SABAN PRODUCTIONS
              </a>
            </div>
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
