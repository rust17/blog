import React from 'react';
import { Link } from 'react-router-dom';
// Removed Box, Typography, Container, Card, CardContent, CardMedia, Button from MUI

const HomePage: React.FC = () => {
  return (
    <> {/* Replaced outer Box with React Fragment as MainLayout now provides the main container */}
      <h2>Latest Posts</h2> {/* Changed Typography to h2 and removed Container as parent provides it */}
      <section className="post-list">
        {posts.map((post) => (
          <article className="post-excerpt" key={post.id}>
            <header>
              <h2><Link to={`/article/${post.id}`}>{post.title}</Link></h2>
              <p className="post-meta">
                <time dateTime="2023-10-27">2023年10月27日</time>
                &nbsp;|&nbsp; {/* Added non-breaking space for better spacing */}
                <span>分类: <a href="#">{post.category}</a></span> {/* Placeholder for category link */}
              </p>
            </header>
            <div className="entry-content">
              <p>{post.excerpt}</p>
            </div>
            <footer>
              <Link to={`/article/${post.id}`} className="read-more">阅读全文 →</Link>
            </footer>
          </article>
        ))}
      </section>
    </>
  );
};

const posts = [
  {
    id: 1,
    title: 'Mastering Asynchronous Programming in Python',
    category: 'Featured',
    excerpt: 'Explore the power of asyncio in Python for building high performance, concurrent applications. Learn how to handle I/O-bound operations efficiently and improve your application\'s responsiveness.',
    // image field is no longer used
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Node.js and Express',
    category: 'Featured',
    excerpt: 'Discover best practices for designing and implementing scalable APIs using Node.js and the Express framework. Learn about routing, middleware, and database integration for robust backend services.',
    // image field is no longer used
  },
  {
    id: 3,
    title: 'Database Optimization Techniques for High-Traffic Applications',
    category: 'Featured',
    excerpt: 'Dive into advanced database optimization strategies to ensure your application handles high traffic effectively. Learn about indexing, query optimization, and caching techniques for improved performance.',
    // image field is no longer used
  }
];

export default HomePage;
