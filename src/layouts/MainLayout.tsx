import React from 'react';
import { AppBar, Toolbar, Typography, Container, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface MainLayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, toggleTheme, isDarkMode }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            DevBlog
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              Home
            </Typography>
            <Typography
              component={Link}
              to="/articles"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              Articles
            </Typography>
            <Typography
              component={Link}
              to="/about"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              About
            </Typography>
            <Typography
              component={Link}
              to="/contact"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              Contact
            </Typography>
          </Box>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            ©{new Date().getFullYear()} DevBlog. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
