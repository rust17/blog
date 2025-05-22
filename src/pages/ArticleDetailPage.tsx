import React from 'react';
import { useParams } from 'react-router-dom';
// Removed Box, Typography, Container, Divider, Avatar, Chip from MUI
// Link might be needed if we use it for tags, but the example uses <a>

// Using the same mock data as HomePage.tsx for consistency
const posts = [
  {
    id: 1,
    title: 'Mastering Asynchronous Programming in Python',
    category: 'Featured',
    excerpt: 'Explore the power of asyncio in Python for building high performance, concurrent applications. Learn how to handle I/O-bound operations efficiently and improve your application\'s responsiveness.',
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Node.js and Express',
    category: 'Featured',
    excerpt: 'Discover best practices for designing and implementing scalable APIs using Node.js and the Express framework. Learn about routing, middleware, and database integration for robust backend services.',
  },
  {
    id: 3,
    title: 'Database Optimization Techniques for High-Traffic Applications',
    category: 'Featured',
    excerpt: 'Dive into advanced database optimization strategies to ensure your application handles high traffic effectively. Learn about indexing, query optimization, and caching techniques for improved performance.',
  }
];


const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Specify type for id
  const postId = Number(id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return <p>Post not found</p>; // Simplified not found message
  }

  return (
    <article className="post-full">
      <header className="post-full-header">
        <h1 className="post-full-title">{post.title}</h1>
        <p className="post-full-meta">
          <time dateTime="2023-10-27">2023年10月27日</time>
          <span>&nbsp;•&nbsp;</span> 作者: DevUser
          <span>&nbsp;•&nbsp;</span> 标签: <a href="#">{post.category}</a> {/* Using post.category for the tag */}
        </p>
      </header>
      <div className="post-full-content">
        <p>{post.excerpt}</p> {/* Using post.excerpt as the initial content */}

        {/* Sample Rich Content Elements */}
        <h2>二级标题示例</h2>
        <p>这是一个段落，展示常规文本样式。</p>
        <blockquote><p>这是一个引用的例子。它会有一个独特的样式。</p></blockquote>
        <pre><code className="language-javascript">{`// Example JavaScript code
function hello() {
  console.log("Hello, World!");
}
hello();`}</code></pre>
        <ul>
          <li>无序列表项 1</li>
          <li>无序列表项 2</li>
        </ul>
        <ol>
          <li>有序列表项 1</li>
          <li>有序列表项 2</li>
        </ol>
        <figure>
          {/* Corrected https protocol and ensure it's treated as a single string */}
          <img src="https://via.placeholder.com/600x300?text=Placeholder+Image" alt="占位图片" />
          <figcaption>图片描述文字</figcaption>
        </figure>
      </div>
    </article>
  );
};

export default ArticleDetailPage;
