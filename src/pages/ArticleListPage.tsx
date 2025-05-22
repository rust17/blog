import React from 'react';
import { Link } from 'react-router-dom';
// Removed Box, Typography, Container, Card, CardContent, Grid, Button from MUI

const ArticleListPage: React.FC = () => {
  return (
    <> {/* Replaced Container with React Fragment as MainLayout now provides the main container */}
      <h1>Articles</h1> {/* Changed Typography to h1 */}
      <section className="post-list">
        {posts.map((post) => ( // Changed articles to posts
          <article className="post-excerpt" key={post.id}>
            <header>
              <h2><Link to={`/article/${post.id}`}>{post.title}</Link></h2>
              <p className="post-meta">
                <time dateTime="2023-10-27">2023年10月27日</time> {/* Placeholder date */}
                &nbsp;|&nbsp;
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

// Using the same mock data as HomePage.tsx for consistency
const posts = [
  {
    id: 1,
    title: 'Mastering Asynchronous Programming in Python',
    category: 'Featured', // Category updated for consistency
    excerpt: 'Explore the power of asyncio in Python for building high performance, concurrent applications. Learn how to handle I/O-bound operations efficiently and improve your application\'s responsiveness.',
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Node.js and Express',
    category: 'Featured', // Category updated for consistency
    excerpt: 'Discover best practices for designing and implementing scalable APIs using Node.js and the Express framework. Learn about routing, middleware, and database integration for robust backend services.',
  },
  {
    id: 3,
    title: 'Database Optimization Techniques for High-Traffic Applications',
    category: 'Featured', // Category updated for consistency
    excerpt: 'Dive into advanced database optimization strategies to ensure your application handles high traffic effectively. Learn about indexing, query optimization, and caching techniques for improved performance.',
  }
];

export default ArticleListPage;
