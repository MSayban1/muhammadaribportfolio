import { useState, useEffect } from 'react';
import { getData, Profile, Skill, Service, Project, Testimonial, Post, SocialLinks, CreatorInfo, subscribeToData } from '@/lib/firebase';

// Default data for initial state
const defaultProfile: Profile = {
  name: "",
  headline1: "",
  headline2: "",
  intro: "",
  picture: "",
  bannerImage: "",
  yearsExperience: 0,
  clientsWorked: 0
};

const defaultSocialLinks: SocialLinks = {
  email: "",
  linkedin: "",
  facebook: "",
  instagram: ""
};

const defaultCreatorInfo: CreatorInfo = {
  name: "SABAN PRODUCTIONS",
  link: ""
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('profile', (data) => {
      if (data) {
        setProfile({ ...defaultProfile, ...data });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { profile, loading };
};

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('skills', (data) => {
      if (data) {
        const skillsList = Object.entries(data).map(([id, skill]) => ({
          id,
          ...(skill as Skill)
        }));
        setSkills(skillsList);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { skills, loading };
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('services', (data) => {
      if (data) {
        const servicesList = Object.entries(data).map(([id, service]) => ({
          id,
          ...(service as Service)
        }));
        setServices(servicesList);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { services, loading };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('projects', (data) => {
      if (data) {
        const projectsList = Object.entries(data).map(([id, project]) => ({
          id,
          ...(project as Project)
        }));
        setProjects(projectsList);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { projects, loading };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('testimonials', (data) => {
      if (data) {
        const testimonialsList = Object.entries(data)
          .map(([id, testimonial]) => ({
            id,
            ...(testimonial as Testimonial)
          }))
          .filter(t => t.approved !== false);
        setTestimonials(testimonialsList);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { testimonials, loading };
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('posts', (data) => {
      if (data) {
        const postsList = Object.entries(data).map(([id, post]) => ({
          id,
          ...(post as Post)
        }));
        setPosts(postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { posts, loading };
};

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('socialLinks', (data) => {
      if (data) {
        setSocialLinks({ ...defaultSocialLinks, ...data });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { socialLinks, loading };
};

export const useCreatorInfo = () => {
  const [creatorInfo, setCreatorInfo] = useState<CreatorInfo>(defaultCreatorInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToData('creatorInfo', (data) => {
      if (data) {
        setCreatorInfo({ ...defaultCreatorInfo, ...data });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { creatorInfo, loading };
};
