import React, { useState, useEffect } from 'react';
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
  subscribeToData,
  Profile,
  Skill,
  Service,
  Project,
  Testimonial,
  ServiceReview,
  Post,
  HireRequest,
  ContactSubmission,
  SocialLinks,
  Visitor,
  CreatorInfo
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
  EyeOff,
  Check,
  Zap,
  Star,
  Globe,
  MapPin,
  Users,
  Download,
  AtSign,
  Shield
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const [creatorInfo, setCreatorInfo] = useState<CreatorInfo | null>(null);

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
      const [profileData, skillsData, servicesData, projectsData, testimonialsData, postsData, hireData, contactsData, linksData, creatorData] = await Promise.all([
        getData('profile'),
        getData('skills'),
        getData('services'),
        getData('projects'),
        getData('testimonials'),
        getData('posts'),
        getData('hireRequests'),
        getData('contacts'),
        getData('socialLinks'),
        getData('creatorInfo')
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
      setCreatorInfo(creatorData);
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
    { id: 'reviews', label: 'Service Reviews', icon: Star },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'requests', label: 'Requests', icon: Mail },
    { id: 'emails', label: 'Email List', icon: AtSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admins', label: 'Admins', icon: Shield },
    { id: 'export', label: 'Export Data', icon: Download },
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
            <ProfileEditor profile={profile} socialLinks={socialLinks} creatorInfo={creatorInfo} onUpdate={loadAllData} />
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
          {activeTab === 'reviews' && (
            <ServiceReviewsEditor services={services} onUpdate={loadAllData} />
          )}
          {activeTab === 'posts' && (
            <PostsEditor posts={posts} onUpdate={loadAllData} />
          )}
          {activeTab === 'requests' && (
            <RequestsViewer hireRequests={hireRequests} contacts={contacts} services={services} onUpdate={loadAllData} />
          )}
          {activeTab === 'emails' && (
            <EmailListViewer hireRequests={hireRequests} contacts={contacts} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard hireRequests={hireRequests} contacts={contacts} />
          )}
          {activeTab === 'admins' && (
            <AdminsManager currentUserEmail={user?.email || ''} />
          )}
          {activeTab === 'export' && (
            <DataExporter
              profile={profile}
              skills={skills}
              services={services}
              projects={projects}
              testimonials={testimonials}
              posts={posts}
              hireRequests={hireRequests}
              contacts={contacts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Editor Component
const ProfileEditor = ({ profile, socialLinks, creatorInfo, onUpdate }: { profile: Profile | null; socialLinks: SocialLinks | null; creatorInfo: CreatorInfo | null; onUpdate: () => void }) => {
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
  const [creator, setCreator] = useState<CreatorInfo>({
    name: creatorInfo?.name || 'SABAN PRODUCTIONS',
    link: creatorInfo?.link || ''
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
        setData('socialLinks', links),
        setData('creatorInfo', creator)
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

      {/* Creator Info Section */}
      <div className="border-t border-border pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Footer Creator Info</h3>
        <p className="text-sm text-muted-foreground mb-4">This appears as "Developed by" in the footer</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Creator Name</label>
            <input
              type="text"
              value={creator.name}
              onChange={(e) => setCreator({ ...creator, name: e.target.value })}
              className="input-modern"
              placeholder="SABAN PRODUCTIONS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Creator Website Link</label>
            <input
              type="url"
              value={creator.link}
              onChange={(e) => setCreator({ ...creator, link: e.target.value })}
              className="input-modern"
              placeholder="https://example.com"
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

// Services Editor
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

// Testimonials Editor with Picture Upload
const TestimonialsEditor = ({ testimonials, onUpdate }: { testimonials: Testimonial[]; onUpdate: () => void }) => {
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>({ name: '', stars: 5, feedback: '', image: '', approved: true });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, image: base64 });
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.feedback) return;
    await pushData('testimonials', { ...form, date: new Date().toISOString() });
    toast({ title: "Testimonial Added" });
    setForm({ name: '', stars: 5, feedback: '', image: '', approved: true });
    onUpdate();
  };

  const handleApprove = async (id: string) => {
    await setData(`testimonials/${id}/approved`, true);
    toast({ title: "Testimonial Approved" });
    onUpdate();
  };

  const handleHide = async (id: string) => {
    await setData(`testimonials/${id}/approved`, false);
    toast({ title: "Testimonial Hidden" });
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
      
      {/* Add New Testimonial Form */}
      <div className="card-elevated p-4 space-y-4">
        <h3 className="font-medium">Add New Testimonial</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-modern"
          />
          <div className="flex items-center gap-2">
            <label className="btn-outline cursor-pointer flex items-center gap-2">
              <Upload size={18} />
              {form.image ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {form.image && (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, stars: star })}
                className="p-2 hover:scale-110 transition-transform"
              >
                <Star
                  size={24}
                  className={star <= form.stars ? 'fill-primary text-primary' : 'text-muted-foreground'}
                />
              </button>
            ))}
          </div>
        </div>
        
        <textarea
          placeholder="Client Feedback"
          value={form.feedback}
          onChange={(e) => setForm({ ...form, feedback: e.target.value })}
          rows={3}
          className="input-modern resize-none"
        />
        
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={18} className="mr-2" /> Add Testimonial
        </button>
      </div>
      
      {/* Existing Testimonials */}
      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`p-4 rounded-2xl ${t.approved ? 'bg-secondary' : 'bg-primary/5 border border-primary/20'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    t.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < t.stars ? 'fill-primary text-primary' : 'text-muted'} />
                    ))}
                  </div>
                </div>
              </div>
              {!t.approved && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Pending</span>}
              {t.approved && <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">Visible</span>}
            </div>
            <p className="text-muted-foreground mb-3">"{t.feedback}"</p>
            <div className="flex gap-2">
              {!t.approved && (
                <button onClick={() => handleApprove(t.id!)} className="flex-1 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 flex items-center justify-center gap-2">
                  <Eye size={16} /> Show
                </button>
              )}
              {t.approved && (
                <button onClick={() => handleHide(t.id!)} className="flex-1 p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 flex items-center justify-center gap-2">
                  <EyeOff size={16} /> Hide
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

// Service Reviews Editor
const ServiceReviewsEditor = ({ services, onUpdate }: { services: Service[]; onUpdate: () => void }) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [form, setForm] = useState<Omit<ServiceReview, 'id'>>({ name: '', stars: 5, feedback: '', image: '', date: '', approved: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedService) {
      loadReviews();
    }
  }, [selectedService]);

  const loadReviews = async () => {
    setLoading(true);
    const reviewsData = await getData(`serviceReviews/${selectedService}`);
    if (reviewsData) {
      const reviewsList = Object.entries(reviewsData).map(([id, review]) => ({ id, ...(review as ServiceReview) }));
      setReviews(reviewsList);
    } else {
      setReviews([]);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await imageToBase64(file);
      setForm({ ...form, image: base64 });
    }
  };

  const handleAdd = async () => {
    if (!selectedService || !form.name || !form.feedback) return;
    await pushData(`serviceReviews/${selectedService}`, { ...form, date: new Date().toISOString() });
    toast({ title: "Review Added" });
    setForm({ name: '', stars: 5, feedback: '', image: '', date: '', approved: true });
    loadReviews();
  };

  const handleApprove = async (id: string) => {
    await setData(`serviceReviews/${selectedService}/${id}/approved`, true);
    toast({ title: "Review Approved" });
    loadReviews();
  };

  const handleHide = async (id: string) => {
    await setData(`serviceReviews/${selectedService}/${id}/approved`, false);
    toast({ title: "Review Hidden" });
    loadReviews();
  };

  const handleDelete = async (id: string) => {
    await removeData(`serviceReviews/${selectedService}/${id}`);
    toast({ title: "Review Deleted" });
    loadReviews();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Service Reviews</h2>
      
      {/* Service Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Service</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="input-modern"
        >
          <option value="">Choose a service...</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.title}</option>
          ))}
        </select>
      </div>

      {selectedService && (
        <>
          {/* Add Review Form */}
          <div className="card-elevated p-4 space-y-4">
            <h3 className="font-medium">Add New Review</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Reviewer Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-modern"
              />
              <div className="flex items-center gap-2">
                <label className="btn-outline cursor-pointer flex items-center gap-2">
                  <Upload size={18} />
                  {form.image ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.image && (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, stars: star })}
                    className="p-2 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={star <= form.stars ? 'fill-primary text-primary' : 'text-muted-foreground'}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              placeholder="Review Feedback"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              rows={3}
              className="input-modern resize-none"
            />
            
            <button onClick={handleAdd} className="btn-primary">
              <Plus size={18} className="mr-2" /> Add Review
            </button>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className={`p-4 rounded-2xl ${review.approved ? 'bg-secondary' : 'bg-primary/5 border border-primary/20'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                        {review.image ? (
                          <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                        ) : (
                          review.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.stars ? 'fill-primary text-primary' : 'text-muted'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {!review.approved && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Pending</span>}
                    {review.approved && <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">Visible</span>}
                  </div>
                  <p className="text-muted-foreground mb-3">"{review.feedback}"</p>
                  <div className="flex gap-2">
                    {!review.approved && (
                      <button onClick={() => handleApprove(review.id!)} className="flex-1 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 flex items-center justify-center gap-2">
                        <Eye size={16} /> Show
                      </button>
                    )}
                    {review.approved && (
                      <button onClick={() => handleHide(review.id!)} className="flex-1 p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 flex items-center justify-center gap-2">
                        <EyeOff size={16} /> Hide
                      </button>
                    )}
                    <button onClick={() => handleDelete(review.id!)} className="flex-1 p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 flex items-center justify-center gap-2">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No reviews for this service yet</p>
              )}
            </div>
          )}
        </>
      )}
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

const RequestsViewer = ({ hireRequests, contacts, services, onUpdate }: { hireRequests: HireRequest[]; contacts: ContactSubmission[]; services: Service[]; onUpdate: () => void }) => {
  const handleMarkRead = async (id: string) => {
    await setData(`contacts/${id}/read`, true);
    onUpdate();
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'contacted' | 'completed') => {
    await setData(`hireRequests/${id}/status`, status);
    toast({ title: "Status Updated" });
    onUpdate();
  };

  // Calculate stats
  const totalHireRequests = hireRequests.length;
  const pendingRequests = hireRequests.filter(r => r.status === 'pending').length;
  const contactedRequests = hireRequests.filter(r => r.status === 'contacted').length;
  const completedRequests = hireRequests.filter(r => r.status === 'completed').length;
  
  // Requests per service
  const requestsByService = services.map(service => ({
    service,
    total: hireRequests.filter(r => r.serviceId === service.id).length,
    pending: hireRequests.filter(r => r.serviceId === service.id && r.status === 'pending').length,
    completed: hireRequests.filter(r => r.serviceId === service.id && r.status === 'completed').length
  })).filter(s => s.total > 0);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-primary">{totalHireRequests}</p>
          <p className="text-sm text-muted-foreground">Total Requests</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{pendingRequests}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{contactedRequests}</p>
          <p className="text-sm text-muted-foreground">Contacted</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{completedRequests}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Requests by Service */}
      {requestsByService.length > 0 && (
        <div className="card-elevated p-4">
          <h3 className="font-semibold mb-4">Requests by Service</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {requestsByService.map(({ service, total, pending, completed }) => (
              <div key={service.id} className="p-3 bg-secondary rounded-xl">
                <p className="font-medium truncate">{service.title}</p>
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="text-muted-foreground">Total: {total}</span>
                  <span className="text-yellow-500">Pending: {pending}</span>
                  <span className="text-green-500">Done: {completed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <div className="flex items-center gap-2">
                  <select
                    value={req.status}
                    onChange={(e) => handleUpdateStatus(req.id!, e.target.value as 'pending' | 'contacted' | 'completed')}
                    className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                      req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                      req.status === 'contacted' ? 'bg-blue-500/20 text-blue-600' :
                      'bg-green-500/20 text-green-600'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Contact Messages</h2>
          <span className="text-sm text-muted-foreground">{contacts.length} total</span>
        </div>
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

// Data Exporter Component with PDF generation
const DataExporter = ({
  profile,
  skills,
  services,
  projects,
  testimonials,
  posts,
  hireRequests,
  contacts
}: {
  profile: Profile | null;
  skills: Skill[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  posts: Post[];
  hireRequests: HireRequest[];
  contacts: ContactSubmission[];
}) => {
  const [analytics, setAnalytics] = useState<{ pageViews: number; visitors: { [key: string]: Visitor } }>({ pageViews: 0, visitors: {} });
  const [admins, setAdmins] = useState<{ id?: string; email: string; addedAt: string; addedBy: string }[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const unsubscribeAnalytics = subscribeToData('analytics', (data) => {
      if (data) setAnalytics(data);
    });
    const unsubscribeAdmins = subscribeToData('admins', (data) => {
      if (data) {
        setAdmins(Object.entries(data).map(([id, admin]: [string, any]) => ({ id, ...admin })));
      }
    });
    return () => {
      unsubscribeAnalytics();
      unsubscribeAdmins();
    };
  }, []);

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Helper function to add new page if needed
      const checkNewPage = (height: number = 40) => {
        if (yPos + height > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }
      };

      // Helper function to draw bar chart
      const drawBarChart = (data: { label: string; value: number; color?: string }[], x: number, y: number, width: number, height: number, title: string) => {
        checkNewPage(height + 30);
        
        // Title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x, y);
        y += 10;

        if (data.length === 0) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('No data available', x, y + 10);
          return y + 30;
        }

        const maxValue = Math.max(...data.map(d => d.value), 1);
        const barHeight = Math.min(15, (height - 20) / data.length);
        const chartWidth = width - 60;

        data.forEach((item, index) => {
          const barWidth = (item.value / maxValue) * chartWidth;
          const barY = y + index * (barHeight + 5);

          // Bar background
          doc.setFillColor(240, 240, 240);
          doc.rect(x + 50, barY, chartWidth, barHeight, 'F');

          // Bar fill
          doc.setFillColor(99, 102, 241);
          doc.rect(x + 50, barY, barWidth, barHeight, 'F');

          // Label
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          const labelText = item.label.length > 12 ? item.label.substring(0, 12) + '...' : item.label;
          doc.text(labelText, x, barY + barHeight / 2 + 2);

          // Value
          doc.text(item.value.toString(), x + 52 + chartWidth, barY + barHeight / 2 + 2);
        });

        return y + data.length * (barHeight + 5) + 10;
      };

      // ===== HEADER =====
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Website Analytics Report', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, 32, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      yPos = 55;

      // ===== PROFILE SECTION =====
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Profile Information', 14, yPos);
      yPos += 10;

      if (profile) {
        autoTable(doc, {
          startY: yPos,
          head: [['Field', 'Value']],
          body: [
            ['Name', profile.name || 'N/A'],
            ['Headline 1', profile.headline1 || 'N/A'],
            ['Headline 2', profile.headline2 || 'N/A'],
            ['Years of Experience', profile.yearsExperience?.toString() || '0'],
            ['Clients Worked', profile.clientsWorked?.toString() || '0'],
            ['Intro', profile.intro?.substring(0, 100) + (profile.intro?.length > 100 ? '...' : '') || 'N/A'],
          ],
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // ===== SKILLS SECTION =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Skills', 14, yPos);
      yPos += 10;

      if (skills.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Skill Name', 'Icon']],
          body: skills.map((skill, index) => [
            (index + 1).toString(),
            skill.name,
            skill.icon || 'N/A'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('No skills added yet', 14, yPos);
        yPos += 15;
      }

      // ===== SERVICES SECTION =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Services', 14, yPos);
      yPos += 10;

      if (services.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Service Title', 'Description']],
          body: services.map((service, index) => [
            (index + 1).toString(),
            service.title,
            service.description?.substring(0, 60) + (service.description?.length > 60 ? '...' : '') || 'N/A'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Services bar chart - requests per service
      const serviceRequestsData = services.map(service => ({
        label: service.title,
        value: hireRequests.filter(r => r.serviceId === service.id).length
      })).filter(d => d.value > 0);

      if (serviceRequestsData.length > 0) {
        checkNewPage(100);
        yPos = drawBarChart(serviceRequestsData, 14, yPos, pageWidth - 28, 80, 'Hiring Requests per Service');
      }

      // ===== PORTFOLIO SECTION =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Portfolio Projects', 14, yPos);
      yPos += 10;

      if (projects.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Project Title', 'Description', 'Link']],
          body: projects.map((project, index) => [
            (index + 1).toString(),
            project.title,
            project.description?.substring(0, 40) + (project.description?.length > 40 ? '...' : '') || 'N/A',
            project.link || 'N/A'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // ===== TESTIMONIALS SECTION =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Testimonials', 14, yPos);
      yPos += 10;

      const approvedTestimonials = testimonials.filter(t => t.approved !== false);
      const hiddenTestimonials = testimonials.filter(t => t.approved === false);

      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Count']],
        body: [
          ['Total Testimonials', testimonials.length.toString()],
          ['Approved/Visible', approvedTestimonials.length.toString()],
          ['Hidden', hiddenTestimonials.length.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;

      if (testimonials.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Name', 'Stars', 'Feedback', 'Status']],
          body: testimonials.map((t, index) => [
            (index + 1).toString(),
            t.name,
            '★'.repeat(t.stars),
            t.feedback?.substring(0, 40) + (t.feedback?.length > 40 ? '...' : '') || 'N/A',
            t.approved !== false ? 'Visible' : 'Hidden'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Star distribution chart
      const starDistribution = [5, 4, 3, 2, 1].map(stars => ({
        label: `${stars} Stars`,
        value: testimonials.filter(t => t.stars === stars).length
      }));

      checkNewPage(80);
      yPos = drawBarChart(starDistribution, 14, yPos, pageWidth - 28, 70, 'Testimonial Star Distribution');

      // ===== POSTS SECTION =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Blog Posts', 14, yPos);
      yPos += 10;

      if (posts.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Title', 'Date', 'Content Preview']],
          body: posts.map((post, index) => [
            (index + 1).toString(),
            post.title,
            new Date(post.date).toLocaleDateString(),
            post.content?.substring(0, 40) + (post.content?.length > 40 ? '...' : '') || 'N/A'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // ===== REQUESTS SECTION =====
      doc.addPage();
      yPos = 20;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Hiring Requests Summary', 14, yPos);
      yPos += 10;

      const pendingRequests = hireRequests.filter(r => r.status === 'pending').length;
      const contactedRequests = hireRequests.filter(r => r.status === 'contacted').length;
      const completedRequests = hireRequests.filter(r => r.status === 'completed').length;

      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Count']],
        body: [
          ['Total Requests', hireRequests.length.toString()],
          ['Pending', pendingRequests.toString()],
          ['Contacted', contactedRequests.toString()],
          ['Completed', completedRequests.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Request status chart
      const requestStatusData = [
        { label: 'Pending', value: pendingRequests },
        { label: 'Contacted', value: contactedRequests },
        { label: 'Completed', value: completedRequests }
      ];
      yPos = drawBarChart(requestStatusData, 14, yPos, pageWidth - 28, 60, 'Request Status Distribution');

      // Detailed requests table
      if (hireRequests.length > 0) {
        checkNewPage();
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Detailed Hiring Requests', 14, yPos);
        yPos += 10;

        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Name', 'Email', 'Service', 'Status', 'Date']],
          body: hireRequests.map((req, index) => [
            (index + 1).toString(),
            req.name,
            req.email?.substring(0, 20) || 'N/A',
            req.serviceName?.substring(0, 15) || 'N/A',
            req.status,
            new Date(req.date).toLocaleDateString()
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
          styles: { fontSize: 8 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // ===== CONTACT MESSAGES =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Contact Messages', 14, yPos);
      yPos += 10;

      const readMessages = contacts.filter(c => c.read).length;
      const unreadMessages = contacts.filter(c => !c.read).length;

      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Count']],
        body: [
          ['Total Messages', contacts.length.toString()],
          ['Read', readMessages.toString()],
          ['Unread', unreadMessages.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;

      if (contacts.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Name', 'Email', 'Message', 'Date', 'Status']],
          body: contacts.map((c, index) => [
            (index + 1).toString(),
            c.name,
            c.email?.substring(0, 20) || 'N/A',
            c.message?.substring(0, 30) + (c.message?.length > 30 ? '...' : '') || 'N/A',
            new Date(c.date).toLocaleDateString(),
            c.read ? 'Read' : 'Unread'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
          styles: { fontSize: 8 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // ===== ANALYTICS SECTION =====
      doc.addPage();
      yPos = 20;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Website Analytics', 14, yPos);
      yPos += 10;

      const uniqueVisitors = Object.keys(analytics.visitors || {}).length;
      const visitorsList = Object.entries(analytics.visitors || {}).map(([key, visitor]) => ({
        id: key,
        ...visitor
      }));

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const visitorsToday = visitorsList.filter(v => new Date(v.lastVisit) >= today).length;
      const visitorsLastMonth = visitorsList.filter(v => new Date(v.lastVisit) >= lastMonth).length;

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Total Page Views', (analytics.pageViews || 0).toString()],
          ['Unique Visitors', uniqueVisitors.toString()],
          ['Visitors Today', visitorsToday.toString()],
          ['Visitors Last 30 Days', visitorsLastMonth.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Visitors by country
      const countryStats: { [key: string]: number } = {};
      visitorsList.forEach(v => {
        const country = v.country || 'Unknown';
        countryStats[country] = (countryStats[country] || 0) + 1;
      });

      const countryData = Object.entries(countryStats)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      if (countryData.length > 0) {
        checkNewPage(100);
        yPos = drawBarChart(countryData, 14, yPos, pageWidth - 28, 80, 'Visitors by Country (Top 10)');
      }

      // Recent visitors list
      if (visitorsList.length > 0) {
        checkNewPage();
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Recent Visitors', 14, yPos);
        yPos += 10;

        const recentVisitors = visitorsList
          .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
          .slice(0, 50);

        autoTable(doc, {
          startY: yPos,
          head: [['IP Address', 'Country', 'City', 'Visits', 'Last Visit']],
          body: recentVisitors.map(v => [
            v.ip || 'Unknown',
            v.country || 'Unknown',
            v.city || 'N/A',
            v.visitCount?.toString() || '1',
            new Date(v.lastVisit).toLocaleString()
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
          styles: { fontSize: 8 },
        });
      }

      // ===== ADMINS EMAIL LIST SECTION =====
      doc.addPage();
      yPos = 20;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Admins Email List', 14, yPos);
      yPos += 10;

      if (admins.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Email', 'Added By', 'Added On']],
          body: admins.map((admin, index) => [
            (index + 1).toString(),
            admin.email,
            admin.addedBy || 'System',
            new Date(admin.addedAt).toLocaleDateString()
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
          styles: { fontSize: 9 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('No admins registered.', 14, yPos);
        yPos += 15;
      }

      // ===== CLIENT EMAIL LIST SECTION =====
      checkNewPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Client Email List', 14, yPos);
      yPos += 10;

      // Collect unique client emails
      const clientEmailMap = new Map<string, { email: string; source: string; date: string; name: string }>();
      
      contacts.forEach((contact) => {
        const key = contact.email.toLowerCase();
        if (!clientEmailMap.has(key) || new Date(contact.date) > new Date(clientEmailMap.get(key)!.date)) {
          clientEmailMap.set(key, {
            email: contact.email,
            source: 'Contact Form',
            date: contact.date,
            name: contact.name
          });
        }
      });
      
      hireRequests.forEach((request) => {
        const key = request.email.toLowerCase();
        const existing = clientEmailMap.get(key);
        if (!existing || new Date(request.date) > new Date(existing.date)) {
          clientEmailMap.set(key, {
            email: request.email,
            source: existing ? `${existing.source}, Hire Request` : 'Hire Request',
            date: request.date,
            name: request.name
          });
        }
      });

      const clientEmails = Array.from(clientEmailMap.values()).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (clientEmails.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Name', 'Email', 'Source', 'Last Activity']],
          body: clientEmails.map((item, index) => [
            (index + 1).toString(),
            item.name,
            item.email,
            item.source,
            new Date(item.date).toLocaleDateString()
          ]),
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] },
          styles: { fontSize: 9 },
        });
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('No client emails collected.', 14, yPos);
      }

      // ===== FOOTER ON ALL PAGES =====
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('Generated by Website Admin Panel', 14, pageHeight - 10);
      }

      // Save PDF
      doc.save(`website-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({ title: "PDF Generated!", description: "Your complete data report has been downloaded." });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  // Calculate summary stats
  const uniqueVisitors = Object.keys(analytics.visitors || {}).length;
  const pendingRequests = hireRequests.filter(r => r.status === 'pending').length;
  const completedRequests = hireRequests.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Export Complete Data</h2>
          <p className="text-sm text-muted-foreground">Download all website data as a comprehensive PDF report</p>
        </div>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={20} />
          {generating ? 'Generating...' : 'Download PDF Report'}
        </button>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center">
          <UserIcon className="mx-auto text-primary mb-2" size={28} />
          <p className="text-2xl font-bold">{profile ? 1 : 0}</p>
          <p className="text-xs text-muted-foreground">Profile</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Zap className="mx-auto text-yellow-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{skills.length}</p>
          <p className="text-xs text-muted-foreground">Skills</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Briefcase className="mx-auto text-blue-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{services.length}</p>
          <p className="text-xs text-muted-foreground">Services</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <FolderOpen className="mx-auto text-green-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{projects.length}</p>
          <p className="text-xs text-muted-foreground">Projects</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center">
          <MessageSquare className="mx-auto text-purple-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{testimonials.length}</p>
          <p className="text-xs text-muted-foreground">Testimonials</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <FileText className="mx-auto text-orange-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{posts.length}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Mail className="mx-auto text-red-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{hireRequests.length}</p>
          <p className="text-xs text-muted-foreground">Hire Requests</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Users className="mx-auto text-cyan-500 mb-2" size={28} />
          <p className="text-2xl font-bold">{contacts.length}</p>
          <p className="text-xs text-muted-foreground">Contact Messages</p>
        </div>
      </div>

      {/* Data Preview */}
      <div className="card-elevated p-6">
        <h3 className="font-semibold mb-4">PDF Report Will Include:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Profile Information & Stats</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Complete Skills List</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Services with Request Statistics</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Portfolio Projects</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Testimonials with Star Distribution Chart</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Blog Posts</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Hiring Requests (Pending, Contacted, Completed)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Contact Messages</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Visitor Analytics with Country Distribution</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span>Bar Charts & Visual Statistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="card-elevated p-6 border-l-4 border-l-primary">
        <h3 className="font-semibold mb-3">Quick Summary</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Analytics</p>
            <p className="font-medium">{analytics.pageViews || 0} page views • {uniqueVisitors} unique visitors</p>
          </div>
          <div>
            <p className="text-muted-foreground">Requests Status</p>
            <p className="font-medium">{pendingRequests} pending • {completedRequests} completed</p>
          </div>
          <div>
            <p className="text-muted-foreground">Content</p>
            <p className="font-medium">{services.length} services • {posts.length} posts • {projects.length} projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email List Viewer Component
const EmailListViewer = ({ hireRequests, contacts }: { hireRequests: HireRequest[]; contacts: ContactSubmission[] }) => {
  // Collect unique emails from both contacts and hire requests
  const emailList = React.useMemo(() => {
    const emailMap = new Map<string, { email: string; source: string; date: string; name: string }>();
    
    // Add emails from contact submissions
    contacts.forEach((contact) => {
      const key = contact.email.toLowerCase();
      if (!emailMap.has(key) || new Date(contact.date) > new Date(emailMap.get(key)!.date)) {
        emailMap.set(key, {
          email: contact.email,
          source: 'Contact Form',
          date: contact.date,
          name: contact.name
        });
      }
    });
    
    // Add emails from hire requests
    hireRequests.forEach((request) => {
      const key = request.email.toLowerCase();
      const existing = emailMap.get(key);
      if (!existing || new Date(request.date) > new Date(existing.date)) {
        emailMap.set(key, {
          email: request.email,
          source: existing ? `${existing.source}, Direct Hire (${request.serviceName})` : `Direct Hire (${request.serviceName})`,
          date: request.date,
          name: request.name
        });
      } else if (existing && !existing.source.includes(request.serviceName)) {
        emailMap.set(key, {
          ...existing,
          source: `${existing.source}, Direct Hire (${request.serviceName})`
        });
      }
    });
    
    return Array.from(emailMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [contacts, hireRequests]);

  const downloadEmailListPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text('Client Email List', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
    doc.text(`Total Emails: ${emailList.length}`, pageWidth / 2, 34, { align: 'center' });
    
    // Email Table
    autoTable(doc, {
      startY: 45,
      head: [['#', 'Name', 'Email', 'Source', 'Last Activity']],
      body: emailList.map((item, index) => [
        index + 1,
        item.name,
        item.email,
        item.source,
        new Date(item.date).toLocaleDateString()
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 55 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 }
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    doc.save('client-email-list.pdf');
    toast({ title: "Downloaded!", description: "Email list PDF has been saved." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Client Email List</h2>
          <p className="text-sm text-muted-foreground">Emails collected from contact forms and hire requests</p>
        </div>
        <button
          onClick={downloadEmailListPDF}
          className="btn-primary flex items-center gap-2"
          disabled={emailList.length === 0}
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-elevated p-4 text-center border-l-4 border-l-primary">
          <p className="text-2xl font-bold">{emailList.length}</p>
          <p className="text-xs text-muted-foreground">Total Unique Emails</p>
        </div>
        <div className="card-elevated p-4 text-center border-l-4 border-l-blue-500">
          <p className="text-2xl font-bold">{contacts.length}</p>
          <p className="text-xs text-muted-foreground">From Contact Form</p>
        </div>
        <div className="card-elevated p-4 text-center border-l-4 border-l-green-500">
          <p className="text-2xl font-bold">{hireRequests.length}</p>
          <p className="text-xs text-muted-foreground">From Hire Requests</p>
        </div>
      </div>

      {/* Email List */}
      <div className="card-elevated overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-4 font-medium">#</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Source</th>
              <th className="text-left p-4 font-medium">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {emailList.length > 0 ? (
              emailList.map((item, index) => (
                <tr key={item.email} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-muted-foreground">{index + 1}</td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                      {item.email}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {item.source}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No emails collected yet. Emails will appear here when clients submit contact forms or hire requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Admins Manager Component
interface AdminUser {
  id?: string;
  email: string;
  addedAt: string;
  addedBy: string;
}

const AdminsManager = ({ currentUserEmail }: { currentUserEmail: string }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToData('admins', (data) => {
      if (data) {
        const adminsList = Object.entries(data).map(([id, admin]) => ({
          id,
          ...(admin as AdminUser)
        }));
        setAdmins(adminsList.sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        ));
      } else {
        setAdmins([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    setAdding(true);
    try {
      // Create new user in Firebase Auth
      const { signup } = await import('@/lib/firebase');
      await signup(newEmail, newPassword);

      // Add to admins list in database
      await pushData('admins', {
        email: newEmail,
        addedAt: new Date().toISOString(),
        addedBy: currentUserEmail
      });

      toast({ title: "Admin Added", description: `${newEmail} has been added as an admin.` });
      setNewEmail('');
      setNewPassword('');
      setShowAddForm(false);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add admin.", 
        variant: "destructive" 
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (admin: AdminUser) => {
    if (admin.email === currentUserEmail) {
      toast({ 
        title: "Cannot Remove", 
        description: "You cannot remove yourself as admin.", 
        variant: "destructive" 
      });
      return;
    }

    if (!confirm(`Are you sure you want to remove ${admin.email} as admin?`)) return;

    try {
      await removeData(`admins/${admin.id}`);
      toast({ title: "Admin Removed", description: `${admin.email} has been removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove admin.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Admin Management</h2>
          <p className="text-sm text-muted-foreground">Manage users who can access this admin panel</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <div className="card-elevated p-6">
          <h3 className="font-semibold mb-4">Add New Admin</h3>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input-modern"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="input-modern"
                minLength={6}
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={adding} className="btn-primary flex items-center gap-2">
                {adding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Create Admin
                  </>
                )}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-elevated p-4 text-center border-l-4 border-l-primary">
          <p className="text-2xl font-bold">{admins.length}</p>
          <p className="text-xs text-muted-foreground">Total Admins</p>
        </div>
        <div className="card-elevated p-4 text-center border-l-4 border-l-green-500">
          <Shield className="mx-auto text-green-500 mb-1" size={24} />
          <p className="text-xs text-muted-foreground">Active Sessions</p>
        </div>
      </div>

      {/* Admins List */}
      <div className="card-elevated overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-4 font-medium">#</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Added By</th>
              <th className="text-left p-4 font-medium">Added On</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin, index) => (
                <tr key={admin.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-muted-foreground">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield size={16} className="text-primary" />
                      </div>
                      <span className="font-medium">{admin.email}</span>
                      {admin.email === currentUserEmail && (
                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">You</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{admin.addedBy || 'System'}</td>
                  <td className="p-4 text-muted-foreground text-sm">
                    {new Date(admin.addedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {admin.email !== currentUserEmail ? (
                      <button
                        onClick={() => handleRemoveAdmin(admin)}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove Admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Cannot remove</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No admins registered yet. Add your first admin above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>Note:</strong> When you add a new admin, they will be created in Firebase Authentication and can login to this admin panel with their credentials.
        </p>
      </div>
    </div>
  );
};

// Enhanced Analytics Dashboard with IP/Country tracking
const AnalyticsDashboard = ({ hireRequests, contacts }: { hireRequests: HireRequest[]; contacts: ContactSubmission[] }) => {
  const [analytics, setAnalytics] = useState<{ pageViews: number; visitors: { [key: string]: Visitor } }>({ pageViews: 0, visitors: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('analytics', (data) => {
      if (data) {
        setAnalytics(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const uniqueVisitors = Object.keys(analytics.visitors || {}).length;
  const visitorsList = Object.entries(analytics.visitors || {}).map(([key, visitor]) => ({
    id: key,
    ...visitor
  })).sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());

  // Calculate time-based stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const visitorsToday = visitorsList.filter(v => new Date(v.lastVisit) >= today).length;
  const visitorsLast24h = visitorsList.filter(v => {
    const visitTime = new Date(v.lastVisit);
    return (now.getTime() - visitTime.getTime()) < 24 * 60 * 60 * 1000;
  }).length;
  const visitorsLastMonth = visitorsList.filter(v => new Date(v.lastVisit) >= lastMonth).length;

  // Requests stats
  const totalHireRequests = hireRequests.length;
  const completedRequests = hireRequests.filter(r => r.status === 'completed').length;
  const totalContacts = contacts.length;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
      <p className="text-sm text-muted-foreground">Real-time visitor tracking & request analytics</p>
      
      {/* Visitor Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center">
          <Eye className="mx-auto text-primary mb-2" size={28} />
          <p className="text-2xl font-bold gradient-text">{analytics.pageViews || 0}</p>
          <p className="text-xs text-muted-foreground">Total Page Views</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Users className="mx-auto text-primary mb-2" size={28} />
          <p className="text-2xl font-bold gradient-text">{uniqueVisitors}</p>
          <p className="text-xs text-muted-foreground">Unique Visitors</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Globe className="mx-auto text-green-500 mb-2" size={28} />
          <p className="text-2xl font-bold text-green-500">{visitorsToday}</p>
          <p className="text-xs text-muted-foreground">Visitors Today</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <MapPin className="mx-auto text-blue-500 mb-2" size={28} />
          <p className="text-2xl font-bold text-blue-500">{visitorsLastMonth}</p>
          <p className="text-xs text-muted-foreground">Last 30 Days</p>
        </div>
      </div>

      {/* Request Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center border-l-4 border-l-primary">
          <p className="text-2xl font-bold">{totalContacts}</p>
          <p className="text-xs text-muted-foreground">Contact Messages</p>
        </div>
        <div className="card-elevated p-4 text-center border-l-4 border-l-yellow-500">
          <p className="text-2xl font-bold">{totalHireRequests}</p>
          <p className="text-xs text-muted-foreground">Total Hiring Requests</p>
        </div>
        <div className="card-elevated p-4 text-center border-l-4 border-l-green-500">
          <p className="text-2xl font-bold">{completedRequests}</p>
          <p className="text-xs text-muted-foreground">Completed Requests</p>
        </div>
        <div className="card-elevated p-4 text-center border-l-4 border-l-blue-500">
          <p className="text-2xl font-bold">{visitorsLast24h}</p>
          <p className="text-xs text-muted-foreground">Last 24 Hours</p>
        </div>
      </div>

      {/* Visitors List */}
      <div className="card-elevated p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-primary" />
          Recent Visitors ({visitorsList.length})
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {visitorsList.length > 0 ? (
            visitorsList.slice(0, 100).map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {visitor.country || 'Unknown'} {visitor.city && `• ${visitor.city}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      IP: {visitor.ip || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{visitor.visitCount} visits</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(visitor.lastVisit).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No visitors yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
