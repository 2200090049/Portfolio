import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_BLOG } from '../graphql/queries';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const BlogPost = () => {
  const { slug } = useParams();
  const { getRoleTheme } = usePortfolio();
  const theme = getRoleTheme();
  const { data, loading } = useQuery(GET_BLOG, { variables: { slug } });

  if (loading) return <div style={{ minHeight: '100vh', padding: '120px 20px' }}>Loading...</div>;
  if (!data?.blog) return <div style={{ minHeight: '100vh', padding: '120px 20px' }}>Blog not found</div>;

  const blog = data.blog;

  return (
    <div style={{ background: theme?.gradient, minHeight: '100vh', padding: '120px 20px 60px' }}>
      <motion.article style={{ maxWidth: '900px', margin: '0 auto' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ color: theme?.primary, fontSize: '3rem', marginBottom: '20px' }}>{blog.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>{blog.readTime} • {new Date(blog.createdAt).toLocaleDateString()}</p>
        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: blog.content }} />
      </motion.article>
    </div>
  );
};

export default BlogPost;
