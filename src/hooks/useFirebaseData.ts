import { useState, useEffect } from 'react';
import { getData, Profile, Skill, Service, Project, Testimonial, Post, SocialLinks, subscribeToData } from '@/lib/firebase';

// Default data for initial state
const defaultProfile: Profile = {
  name: "Muhammad Arib",
  headline1: "Social Media Marketing Specialist",
  headline2: "Digital Marketing Expert",
  intro: "With over 2 years of experience as a Social Media Marketing Specialist, I help brands increase engagement and drive quality leads. I focus on crafting creative campaigns that deliver measurable results.",
  picture: "",
  yearsExperience: 2,
  clientsWorked: 50
};

const defaultSocialLinks: SocialLinks = {
  email: "x.arib147@gmail.com",
  linkedin: "https://www.linkedin.com/in/xarib147/",
  facebook: "https://www.facebook.com/x.arib147?_rdr",
  instagram: "https://www.instagram.com/x.arib147/"
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
