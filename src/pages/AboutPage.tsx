import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="page-content"> {/* Using 'page-content' class as suggested, assuming it has similar styling to .post-full-content or can be styled in prototype.css */}
      <img 
        src="/images/profile.jpg" 
        alt="My Profile" 
        className="profile-image" 
      />
      <h1>About Me / 关于我</h1>
      <p>Hello! I'm DevUser, a passionate developer focusing on backend technologies and creating efficient, scalable solutions. I enjoy exploring new tools and frameworks to enhance my development process.</p>
      
      <h2>Skills / 专业技能</h2>
      <ul>
        <li>JavaScript (React, Node.js)</li>
        <li>Python (Django, Flask, FastAPI)</li>
        <li>Go (Basic)</li>
        <li>Database Management (PostgreSQL, MongoDB, Redis)</li>
        <li>API Design & Development (REST, GraphQL)</li>
        <li>Cloud Computing (AWS, Docker, Kubernetes)</li>
        <li>DevOps & CI/CD</li>
        <li>System Architecture</li>
      </ul>

      <h2>Experience / 工作经历</h2>
      <p><strong>Senior Backend Developer at Tech Solutions Inc. (2021-Present)</strong></p>
      <p>Led the development of microservices for a large-scale e-commerce platform. Responsible for API design, database schema, and deployment strategies. Mentored junior developers and contributed to improving code quality and development processes.</p>
      
      <p><strong>Backend Developer at Web Innovations LLC (2018-2021)</strong></p>
      <p>Developed and maintained backend systems for various client projects, focusing on Python and Node.js. Gained experience in integrating third-party services and optimizing application performance.</p>

      <h2>Education / 教育背景</h2>
      <p><strong>M.S. in Computer Science from Advanced Tech University (2016-2018)</strong></p>
      <p>Focus on Distributed Systems and Machine Learning.</p>
      <p><strong>B.S. in Software Engineering from State University (2012-2016)</strong></p>
      <p>Graduated with honors.</p>
      
      <h2>Contact / 联系我</h2>
      <p>You can reach me at <a href="mailto:dev.user@example.com">dev.user@example.com</a> or connect with me on <a href="https://www.linkedin.com/in/devuser" target="_blank" rel="noopener noreferrer">LinkedIn</a> (placeholder).</p>
      <p>Feel free to check out my projects on <a href="https://github.com/devuser" target="_blank" rel="noopener noreferrer">GitHub</a> (placeholder).</p>
    </div>
  );
};

export default AboutPage;
