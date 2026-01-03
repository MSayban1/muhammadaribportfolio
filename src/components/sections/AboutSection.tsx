import { motion, Variants } from 'framer-motion';
import { useProfile } from '@/hooks/useFirebaseData';
import { Users, Calendar, Award } from 'lucide-react';

const AboutSection = () => {
  const { profile, loading: profileLoading } = useProfile();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const stats = [
    { icon: Calendar, label: 'Years Experience', value: profile.yearsExperience },
    { icon: Users, label: 'Clients Worked', value: profile.clientsWorked },
  ];

  if (profileLoading) {
    return (
      <section id="about" className="py-20 bg-card/50">
        <div className="section-container flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // Don't show section if no profile data
  if (!profile.name && !profile.intro) return null;

  return (
    <section id="about" className="py-20 bg-card/50">
      <div className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Intro Text */}
            <motion.div variants={itemVariants}>
              <div className="card-elevated p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="text-primary-foreground" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-primary">{profile.headline1}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {profile.intro}
                </p>
              </div>
            </motion.div>

            {/* Right: Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="card-elevated p-6 text-center"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="text-primary" size={24} />
                  </motion.div>
                  <motion.p
                    className="text-4xl font-bold gradient-text mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: 0.2 + index * 0.1 }}
                  >
                    {stat.value}+
                  </motion.p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
