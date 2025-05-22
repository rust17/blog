import React from 'react';
import { Box, Typography, Container, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Welcome to DevBlog
          </Typography>
          <Typography variant="h5" component="h2" align="center" paragraph>
            Your go-to resource for backend development insights, tips, and tutorials.
            Explore the latest trends, best practices, and in-depth guides to elevate your skills
            and stay ahead in the ever-evolving world of backend engineering.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Latest Posts
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr 1fr' }, gap: 4 }}>
          {posts.map((post) => (
            <Card key={post.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="overline" color="primary">
                  {post.category}
                </Typography>
                <Typography gutterBottom variant="h5" component="h3">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.excerpt}
                </Typography>
                <Button
                  component={Link}
                  to={`/post/${post.id}`}
                  variant="outlined"
                  color="primary"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

const posts = [
  {
    id: 1,
    title: 'Mastering Asynchronous Programming in Python',
    category: 'Featured',
    excerpt: 'Explore the power of asyncio in Python for building high performance, concurrent applications. Learn how to handle I/O-bound operations efficiently and improve your application\'s responsiveness.',
    image: '/images/python-async.jpg'
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Node.js and Express',
    category: 'Featured',
    excerpt: 'Discover best practices for designing and implementing scalable APIs using Node.js and the Express framework. Learn about routing, middleware, and database integration for robust backend services.',
    image: '/images/nodejs-api.jpg'
  },
  {
    id: 3,
    title: 'Database Optimization Techniques for High-Traffic Applications',
    category: 'Featured',
    excerpt: 'Dive into advanced database optimization strategies to ensure your application handles high traffic effectively. Learn about indexing, query optimization, and caching techniques for improved performance.',
    image: '/images/database-opt.jpg'
  }
];

export default HomePage;
