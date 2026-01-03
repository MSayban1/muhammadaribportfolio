import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useFirebaseData';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const { services, loading } = useServices();

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
            <Link key={service.id} to={`/service/${service.id}`}>
              <motion.div
                className="card-elevated overflow-hidden group cursor-pointer h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.98 }}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
