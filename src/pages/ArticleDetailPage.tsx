import React from 'react';
import { Box, Typography, Container, Divider, Avatar, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const article = articles.find(a => a.id === Number(id));

  if (!article) {
    return (
      <Container>
        <Typography variant="h4">Article not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 6 }}>
        <Typography variant="overline" color="primary" gutterBottom display="block">
          {article.category}
        </Typography>
        <Typography variant="h3" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar src={article.authorAvatar} alt={article.author} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1">{article.author}</Typography>
            <Typography variant="body2" color="text.secondary">
              Published on {article.date} · {article.readTime} min read
            </Typography>
          </Box>
        </Box>
        {article.tags && (
          <Box sx={{ mb: 4 }}>
            {article.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{ mr: 1, mb: 1 }}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
        <Divider sx={{ mb: 4 }} />
        <Typography variant="body1" sx={{ mb: 4 }}>
          {article.content}
        </Typography>
      </Box>
    </Container>
  );
};

const articles = [
  {
    id: 1,
    title: 'Mastering Asynchronous Tasks in Python',
    category: 'Python',
    author: 'Alex Bennett',
    authorAvatar: '/images/profile.jpg',
    date: 'November 15, 2023',
    readTime: 12,
    tags: ['Python', 'Async', 'Backend'],
    content: `Asynchronous programming in Python allows for concurrent execution of tasks, improving performance in I/O-bound operations. This post explores the asyncio library, demonstrating how to write non-blocking code that efficiently handles multiple tasks.

    Coroutines are the building blocks of asynchronous programming in Python. They are special functions that can be paused and resumed, allowing other tasks to run in the meantime. The async keyword defines a coroutine, and await is used to pause execution until another coroutine completes.

    The event loop is the heart of asyncio, managing the execution of coroutines. It continuously monitors tasks, running those that are ready and pausing those that are waiting for I/O operations to complete. The asyncio.run() function simplifies the process of running an event loop and managing coroutines.

    Let's illustrate the concepts with a practical example...`
  },
  {
    id: 2,
    title: 'Database Optimization Techniques',
    category: 'Databases',
    author: 'Alex Bennett',
    authorAvatar: '/images/profile.jpg',
    date: 'November 10, 2023',
    readTime: 15,
    tags: ['Database', 'Performance', 'SQL'],
    content: `Learn how to optimize your database queries and improve application performance...`
  }
];

export default ArticleDetailPage;
