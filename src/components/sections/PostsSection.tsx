import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/useFirebaseData';
import { Calendar, ArrowRight } from 'lucide-react';

const PostsSection = () => {
  const { posts } = usePosts();

  // Default posts if none from database
  const displayPosts = posts.length > 0 ? posts : [
    {
      id: '1',
      title: '5 Social Media Trends for 2024',
      content: 'Discover the latest trends shaping social media marketing and how to leverage them for your brand.',
      image: '',
      date: new Date().toISOString()
    },
    {
      id: '2',
      title: 'The Power of Video Content',
      content: 'Learn why video content is dominating digital marketing and how to create engaging videos on a budget.',
      image: '',
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'Building Brand Authenticity',
      content: 'How to build genuine connections with your audience through authentic brand storytelling.',
      image: '',
      date: new Date(Date.now() - 172800000).toISOString()
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (displayPosts.length === 0) return null;

  return (
    <section id="posts" className="py-20 bg-card/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Latest <span className="gradient-text">Posts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and thoughts on digital marketing and social media.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayPosts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              className="card-elevated overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    📝
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar size={14} />
                  {formatDate(post.date)}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Read More
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostsSection;
