import React from 'react';
import { Box, Typography, Container, Card, CardContent, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ArticleListPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Latest Posts
      </Typography>
      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item xs={12} key={article.id}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="overline" color="primary">
                  {article.category}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Published on {article.date} by {article.author}
                </Typography>
                <Typography variant="body1" paragraph sx={{ flex: 1 }}>
                  {article.excerpt}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/article/${article.id}`}
                    variant="outlined"
                    color="primary"
                  >
                    Read More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const articles = [
  {
    id: 1,
    title: 'Mastering Asynchronous Tasks in Python',
    category: 'Python',
    author: 'Alex Bennett',
    date: 'November 15, 2023',
    excerpt: 'Explore the power of asyncio in Python for handling concurrent operations efficiently.',
  },
  {
    id: 2,
    title: 'Database Optimization Techniques',
    category: 'Databases',
    author: 'Alex Bennett',
    date: 'November 10, 2023',
    excerpt: 'Learn how to optimize your database queries and improve application performance.',
  },
  {
    id: 3,
    title: 'Building Scalable APIs with Node.js',
    category: 'Node.js',
    author: 'Alex Bennett',
    date: 'November 5, 2023',
    excerpt: 'Discover best practices for designing and implementing scalable APIs using Node.js',
  }
];

export default ArticleListPage;
