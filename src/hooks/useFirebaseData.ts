import { useState, useEffect, useRef } from 'react';
import { Profile, Skill, Service, Project, Testimonial, Post, SocialLinks, CreatorInfo, subscribeToData } from '@/lib/firebase';

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

// Timeout duration for data loading
const LOADING_TIMEOUT = 8000;

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('profile', (data) => {
      if (isMounted) {
        if (data) {
          setProfile({ ...defaultProfile, ...data });
        } else {
          setProfile(defaultProfile);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Profile data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { profile, loading };
};

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('skills', (data) => {
      if (isMounted) {
        if (data) {
          const skillsList = Object.entries(data).map(([id, skill]) => ({
            id,
            ...(skill as Skill)
          }));
          setSkills(skillsList);
        } else {
          setSkills([]);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Skills data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { skills, loading };
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('services', (data) => {
      if (isMounted) {
        if (data) {
          const servicesList = Object.entries(data).map(([id, service]) => ({
            id,
            ...(service as Service)
          }));
          setServices(servicesList);
        } else {
          setServices([]);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Services data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { services, loading };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('projects', (data) => {
      if (isMounted) {
        if (data) {
          const projectsList = Object.entries(data).map(([id, project]) => ({
            id,
            ...(project as Project)
          }));
          setProjects(projectsList);
        } else {
          setProjects([]);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Projects data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { projects, loading };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('testimonials', (data) => {
      if (isMounted) {
        if (data) {
          const testimonialsList = Object.entries(data)
            .map(([id, testimonial]) => ({
              id,
              ...(testimonial as Testimonial)
            }))
            .filter(t => t.approved !== false);
          setTestimonials(testimonialsList);
        } else {
          setTestimonials([]);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Testimonials data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { testimonials, loading };
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('posts', (data) => {
      if (isMounted) {
        if (data) {
          const postsList = Object.entries(data).map(([id, post]) => ({
            id,
            ...(post as Post)
          }));
          setPosts(postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
          setPosts([]);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Posts data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { posts, loading };
};

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('socialLinks', (data) => {
      if (isMounted) {
        if (data) {
          setSocialLinks({ ...defaultSocialLinks, ...data });
        } else {
          setSocialLinks(defaultSocialLinks);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Social links data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { socialLinks, loading };
};

export const useCreatorInfo = () => {
  const [creatorInfo, setCreatorInfo] = useState<CreatorInfo>(defaultCreatorInfo);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    loadingRef.current = true;
    
    const unsubscribe = subscribeToData('creatorInfo', (data) => {
      if (isMounted) {
        if (data) {
          setCreatorInfo({ ...defaultCreatorInfo, ...data });
        } else {
          setCreatorInfo(defaultCreatorInfo);
        }
        loadingRef.current = false;
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.warn('Creator info data loading timed out');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { creatorInfo, loading };
};