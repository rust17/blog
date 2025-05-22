import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Add Link back
import { IconButton } from '@mui/material'; // Only IconButton is needed from MUI for now
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface MainLayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, toggleTheme, isDarkMode }) => {
  return (
    <> {/* Using React Fragment as the Box is no longer needed for overall structure */}
      <header>
        <div className="container">
          <div className="site-title">
            <Link to="/">DevBlog</Link> {/* Changed back to Link */}
          </div>
          <nav>
            <ul>
              <li><NavLink to="/">Home</NavLink></li> {/* Changed Link to NavLink */}
              <li><NavLink to="/articles">Articles</NavLink></li> {/* Changed Link to NavLink */}
              <li><NavLink to="/about">About</NavLink></li> {/* Changed Link to NavLink */}
              <li><NavLink to="/contact">Contact</NavLink></li> {/* Changed Link to NavLink */}
            </ul>
          </nav>
          <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 'auto' }}> {/* Added sx to push to the right, similar to flexGrow */}
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </header>
      <main className="container">
        {children}
      </main>
      <footer>
        <div className="container">
          <p>©{new Date().getFullYear()} DevBlog. All rights reserved.</p>
          <p>主题灵感来源: <a href="https://github.com/davidhampgonsalves/hugo-black-and-light-theme" target="_blank" rel="noopener noreferrer">Hugo Black and Light</a></p>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
