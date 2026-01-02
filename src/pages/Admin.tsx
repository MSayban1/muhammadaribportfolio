import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  auth, 
  login, 
  logout, 
  subscribeToAuth,
  getData,
  setData,
  pushData,
  removeData,
  imageToBase64,
  Profile,
  Skill,
  Service,
  Project,
  Testimonial,
  Post,
  HireRequest,
  ContactSubmission,
  SocialLinks
} from '@/lib/firebase';
import { User } from 'firebase/auth';
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  Mail, 
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  Eye,
  Check,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Auth state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hireRequests, setHireRequests] = useState<HireRequest[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadAllData = async () => {
    try {
      const [profileData, skillsData, servicesData, projectsData, testimonialsData, postsData, hireData, contactsData, linksData] = await Promise.all([
        getData('profile'),
        getData('skills'),
        getData('services'),
        getData('projects'),
        getData('testimonials'),
        getData('posts'),
        getData('hireRequests'),
        getData('contacts'),
        getData('socialLinks')
      ]);
      
      setProfile(profileData);
      setSkills(skillsData ? Object.entries(skillsData).map(([id, s]) => ({ id, ...(s as Skill) })) : []);
      setServices(servicesData ? Object.entries(servicesData).map(([id, s]) => ({ id, ...(s as Service) })) : []);
      setProjects(projectsData ? Object.entries(projectsData).map(([id, p]) => ({ id, ...(p as Project) })) : []);
      setTestimonials(testimonialsData ? Object.entries(testimonialsData).map(([id, t]) => ({ id, ...(t as Testimonial) })) : []);
      setPosts(postsData ? Object.entries(postsData).map(([id, p]) => ({ id, ...(p as Post) })) : []);
      setHireRequests(hireData ? Object.entries(hireData).map(([id, h]) => ({ id, ...(h as HireRequest) })) : []);
      setContacts(contactsData ? Object.entries(contactsData).map(([id, c]) => ({ id, ...(c as ContactSubmission) })) : []);
      setSocialLinks(linksData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await login(authEmail, authPassword);
      toast({ title: "Welcome Back", description: "You're now logged in." });
    } catch (error: any) {
      toast({ 
        title: "Authentication Error", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged Out", description: "See you next time!" });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'projects', label: 'Portfolio', icon: FolderOpen },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'requests', label: 'Requests', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md card-elevated p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <Settings className="text-primary-foreground" size={32} />
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="input-modern"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="input-modern"
              required
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {authLoading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="section-container py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-secondary hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="section-container py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-muted'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card-elevated p-6">
          {activeTab === 'profile' && (
            <ProfileEditor profile={profile} socialLinks={socialLinks} onUpdate={loadAllData} />
          )}
          {activeTab === 'skills' && (
            <SkillsEditor skills={skills} onUpdate={loadAllData} />
          )}
          {activeTab === 'services' && (
            <ServicesEditor services={services} onUpdate={loadAllData} />
          )}
          {activeTab === 'projects' && (
            <ProjectsEditor projects={projects} onUpdate={loadAllData} />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsEditor testimonials={testimonials} onUpdate={loadAllData} />
          )}
          {activeTab === 'posts' && (
            <PostsEditor posts={posts} onUpdate={loadAllData} />
          )}
          {activeTab === 'requests' && (
            <RequestsViewer hireRequests={hireRequests} contacts={contacts} onUpdate={loadAllData} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Editor Component
const ProfileEditor = ({ profile, socialLinks, onUpdate }: { profile: Profile | null; socialLinks: SocialLinks | null; onUpdate: () => void }) => {
  const [form, setForm] = useState<Profile>({
    name: profile?.name || '',
    headline1: profile?.headline1 || '',
    headline2: profile?.headline2 || '',
    intro: profile?.intro || '',
    picture: profile?.picture || '',
    bannerImage: profile?.bannerImage || '',
    yearsExperience: profile?.yearsExperience || 0,
    clientsWorked: profile?.clientsWorked || 0
  });
  const [links, setLinks] = useState<SocialLinks>({
    email: socialLinks?.email || '',
    linkedin: socialLinks?.linkedin || '',
    facebook: socialLinks?.facebook || '',
    instagram: socialLinks?.instagram || ''
  });
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, picture: base64 });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, bannerImage: base64 });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setData('profile', form),
        setData('socialLinks', links)
      ]);
      toast({ title: "Saved!", description: "Profile updated successfully." });
      onUpdate();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Profile</h2>
      
      {/* Banner Image Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">Banner Image (Hero Background)</label>
        <div className="relative w-full h-32 rounded-2xl bg-secondary overflow-hidden">
          {form.bannerImage ? (
            <img src={form.bannerImage} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span>No banner image</span>
            </div>
          )}
          <label className="absolute bottom-2 right-2 btn-outline cursor-pointer bg-background/80 backdrop-blur-sm">
            <Upload size={18} className="mr-2" />
            Upload Banner
            <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
          </label>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary overflow-hidden">
                {form.picture ? (
                  <img src={form.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <UserIcon size={32} />
                  </div>
                )}
              </div>
              <label className="btn-outline cursor-pointer">
                <Upload size={18} className="mr-2" />
                Upload
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-modern"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Headline 1</label>
            <input
              type="text"
              value={form.headline1}
              onChange={(e) => setForm({ ...form, headline1: e.target.value })}
              className="input-modern"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Headline 2</label>
            <input
              type="text"
              value={form.headline2}
              onChange={(e) => setForm({ ...form, headline2: e.target.value })}
              className="input-modern"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Intro Text</label>
            <textarea
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
              rows={4}
              className="input-modern resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Years Experience</label>
              <input
                type="number"
                value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: parseInt(e.target.value) || 0 })}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Clients Worked</label>
              <input
                type="number"
                value={form.clientsWorked}
                onChange={(e) => setForm({ ...form, clientsWorked: parseInt(e.target.value) || 0 })}
                className="input-modern"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={links.email}
              onChange={(e) => setLinks({ ...links, email: e.target.value })}
              className="input-modern"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={links.linkedin}
              onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
              className="input-modern"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Facebook URL</label>
            <input
              type="url"
              value={links.facebook}
              onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
              className="input-modern"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Instagram URL</label>
            <input
              type="url"
              value={links.instagram}
              onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
              className="input-modern"
            />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save size={18} className="mr-2" />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

// Skills Editor
const SkillsEditor = ({ skills, onUpdate }: { skills: Skill[]; onUpdate: () => void }) => {
  const [newSkill, setNewSkill] = useState({ name: '', icon: '⭐' });

  const handleAdd = async () => {
    if (!newSkill.name) return;
    await pushData('skills', newSkill);
    setNewSkill({ name: '', icon: '⭐' });
    toast({ title: "Skill Added" });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await removeData(`skills/${id}`);
    toast({ title: "Skill Deleted" });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Skills</h2>
      
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Skill Icon (emoji)"
          value={newSkill.icon}
          onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
          className="input-modern w-24"
        />
        <input
          type="text"
          placeholder="Skill Name"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          className="input-modern flex-1"
        />
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={18} className="mr-2" /> Add
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
            <span>
              <span className="mr-2">{skill.icon}</span>
              {skill.name}
            </span>
            <button onClick={() => handleDelete(skill.id!)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generic Item Editor for Services, Projects, Posts
const ServicesEditor = ({ services, onUpdate }: { services: Service[]; onUpdate: () => void }) => {
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, 'id'>>({ title: '', description: '', image: '', details: '' });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, image: base64 });
    }
  };

  const handleSave = async () => {
    if (!form.title) return;
    if (editing?.id) {
      await setData(`services/${editing.id}`, form);
      toast({ title: "Service Updated" });
    } else {
      await pushData('services', form);
      toast({ title: "Service Added" });
    }
    setForm({ title: '', description: '', image: '', details: '' });
    setEditing(null);
    onUpdate();
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setForm({ title: service.title, description: service.description, image: service.image, details: service.details });
  };

  const handleDelete = async (id: string) => {
    await removeData(`services/${id}`);
    toast({ title: "Service Deleted" });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Services</h2>
      
      <div className="card-elevated p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Service Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-modern"
          />
          <div className="flex gap-2">
            <label className="btn-outline cursor-pointer flex-1">
              <Upload size={18} className="mr-2" />
              {form.image ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
        <input
          type="text"
          placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-modern"
        />
        <textarea
          placeholder="Detailed Description"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          rows={3}
          className="input-modern resize-none"
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="btn-primary">
            {editing ? 'Update' : 'Add'} Service
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ title: '', description: '', image: '', details: '' }); }} className="btn-outline">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-secondary rounded-2xl overflow-hidden">
            <div className="h-32 bg-muted">
              {service.image && <img src={service.image} alt={service.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(service)} className="flex-1 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
                  <Edit size={16} className="mx-auto" />
                </button>
                <button onClick={() => handleDelete(service.id!)} className="flex-1 p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20">
                  <Trash2 size={16} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsEditor = ({ projects, onUpdate }: { projects: Project[]; onUpdate: () => void }) => {
  const [form, setForm] = useState<Omit<Project, 'id'>>({ title: '', description: '', image: '', link: '' });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, image: base64 });
    }
  };

  const handleSave = async () => {
    if (!form.title) return;
    await pushData('projects', form);
    toast({ title: "Project Added" });
    setForm({ title: '', description: '', image: '', link: '' });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await removeData(`projects/${id}`);
    toast({ title: "Project Deleted" });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Portfolio</h2>
      
      <div className="card-elevated p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-modern"
          />
          <input
            type="url"
            placeholder="Project Link (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="input-modern"
          />
        </div>
        <textarea
          placeholder="Project Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="input-modern resize-none"
        />
        <div className="flex gap-2">
          <label className="btn-outline cursor-pointer">
            <Upload size={18} className="mr-2" />
            {form.image ? 'Change Image' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <button onClick={handleSave} className="btn-primary">Add Project</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-secondary rounded-2xl overflow-hidden">
            <div className="h-32 bg-muted">
              {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
              <button onClick={() => handleDelete(project.id!)} className="w-full p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20">
                <Trash2 size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsEditor = ({ testimonials, onUpdate }: { testimonials: Testimonial[]; onUpdate: () => void }) => {
  const handleApprove = async (id: string) => {
    await setData(`testimonials/${id}/approved`, true);
    toast({ title: "Testimonial Approved" });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await removeData(`testimonials/${id}`);
    toast({ title: "Testimonial Deleted" });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Testimonials</h2>
      
      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`p-4 rounded-2xl ${t.approved ? 'bg-secondary' : 'bg-primary/5 border border-primary/20'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{t.name}</h4>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < t.stars ? 'text-primary' : 'text-muted'}>★</span>
                  ))}
                </div>
              </div>
              {!t.approved && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Pending</span>}
            </div>
            <p className="text-muted-foreground mb-3">"{t.feedback}"</p>
            <div className="flex gap-2">
              {!t.approved && (
                <button onClick={() => handleApprove(t.id!)} className="flex-1 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 flex items-center justify-center gap-2">
                  <Check size={16} /> Approve
                </button>
              )}
              <button onClick={() => handleDelete(t.id!)} className="flex-1 p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 flex items-center justify-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No testimonials yet</p>
        )}
      </div>
    </div>
  );
};

const PostsEditor = ({ posts, onUpdate }: { posts: Post[]; onUpdate: () => void }) => {
  const [form, setForm] = useState<Omit<Post, 'id'>>({ title: '', content: '', image: '', date: new Date().toISOString() });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, image: base64 });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    await pushData('posts', { ...form, date: new Date().toISOString() });
    toast({ title: "Post Published" });
    setForm({ title: '', content: '', image: '', date: new Date().toISOString() });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await removeData(`posts/${id}`);
    toast({ title: "Post Deleted" });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Posts</h2>
      
      <div className="card-elevated p-4 space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-modern"
        />
        <textarea
          placeholder="Post Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={4}
          className="input-modern resize-none"
        />
        <div className="flex gap-2">
          <label className="btn-outline cursor-pointer">
            <Upload size={18} className="mr-2" />
            {form.image ? 'Change Image' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <button onClick={handleSave} className="btn-primary">Publish Post</button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-4 p-4 bg-secondary rounded-2xl">
            {post.image && (
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
              <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(post.id!)} className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 self-start">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RequestsViewer = ({ hireRequests, contacts, onUpdate }: { hireRequests: HireRequest[]; contacts: ContactSubmission[]; onUpdate: () => void }) => {
  const handleMarkRead = async (id: string) => {
    await setData(`contacts/${id}/read`, true);
    onUpdate();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Hire Requests</h2>
        <div className="space-y-4">
          {hireRequests.map((req) => (
            <div key={req.id} className="p-4 bg-secondary rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{req.name}</h4>
                  <p className="text-sm text-primary">{req.serviceName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  req.status === 'pending' ? 'bg-primary/20 text-primary' :
                  req.status === 'contacted' ? 'bg-accent/20 text-accent' :
                  'bg-muted text-muted-foreground'
                }`}>{req.status}</span>
              </div>
              <p className="text-muted-foreground mb-2">{req.message}</p>
              <p className="text-sm text-muted-foreground">
                <Mail size={14} className="inline mr-1" />{req.email}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(req.date).toLocaleString()}</p>
            </div>
          ))}
          {hireRequests.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No hire requests yet</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Messages</h2>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className={`p-4 rounded-2xl ${contact.read ? 'bg-secondary' : 'bg-primary/5 border border-primary/20'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
                {!contact.read && (
                  <button onClick={() => handleMarkRead(contact.id!)} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full hover:bg-primary/30">
                    Mark Read
                  </button>
                )}
              </div>
              <p className="text-muted-foreground">{contact.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(contact.date).toLocaleString()}</p>
            </div>
          ))}
          {contacts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No contact messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({ pageViews: 0, uniqueVisitors: 0 });

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getData('analytics');
      if (data) {
        setAnalytics({
          pageViews: data.pageViews || 0,
          uniqueVisitors: data.visitors ? Object.keys(data.visitors).length : 0
        });
      }
    };
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card-elevated p-6 text-center">
          <Eye className="mx-auto text-primary mb-2" size={32} />
          <p className="text-3xl font-bold gradient-text">{analytics.pageViews}</p>
          <p className="text-muted-foreground">Total Page Views</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <UserIcon className="mx-auto text-primary mb-2" size={32} />
          <p className="text-3xl font-bold gradient-text">{analytics.uniqueVisitors}</p>
          <p className="text-muted-foreground">Unique Visitors</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Analytics data is collected when visitors view your portfolio.
      </p>
    </div>
  );
};

export default AdminPage;
