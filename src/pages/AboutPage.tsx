import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import CodeIcon from '@mui/icons-material/Code';

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            margin: '0 auto',
            mb: 2
          }}
          alt="Alex Bennett"
          src="/images/profile.jpg"
        />
        <Typography variant="h3" component="h1" gutterBottom>
          Alex Bennett
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Backend Developer
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Experienced backend developer specializing in scalable systems and cloud technologies.
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Expertise
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'background.default'
            }}
          >
            <StorageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Database Management
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'background.default'
            }}
          >
            <CloudIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Cloud Computing
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'background.default'
            }}
          >
            <CodeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Backend Architecture
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Background
      </Typography>
      <Box sx={{ mb: 6 }}>
        {experiences.map((exp, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              bgcolor: 'background.default'
            }}
          >
            <Typography variant="h6" gutterBottom>
              {exp.role}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {exp.company}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exp.period}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

const experiences = [
  {
    role: 'Senior Backend Developer at TechCorp',
    company: 'TechCorp',
    period: '2018 - Present'
  },
  {
    role: 'Backend Developer at Innovate Solutions',
    company: 'Innovate Solutions',
    period: '2015 - 2018'
  },
  {
    role: 'Software Engineer at StartupX',
    company: 'StartupX',
    period: '2013 - 2015'
  }
];

export default AboutPage;
