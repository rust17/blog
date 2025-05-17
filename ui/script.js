// script.js
document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentYear');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const themeIconLight = document.getElementById('themeIconLight');

    function toggleTheme(theme = null) {
        if (document.documentElement.getAttribute('data-theme') === 'light' || theme === 'dark') {
            document.documentElement.removeAttribute('data-theme', 'dark');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    }

    themeIconLight.addEventListener('click', toggleTheme);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        toggleTheme(savedTheme);
    }

    // --- Basic Page Navigation Simulation ---
    // This is a very simple way to show/hide content to simulate page changes.
    // In a real app, you'd use separate HTML files or a router.

    const homeSection = document.getElementById('home');
    const post1Section = document.getElementById('post1');

    const navLinks = document.querySelectorAll('nav a');
    const readMoreLinks = document.querySelectorAll('.read-more');
    const siteTitleLink = document.querySelector('.site-title a');

    function showSection(sectionToShow) {
        // Hide all main sections
        document.querySelectorAll('main > section, main > article.post-full').forEach(sec => {
            sec.style.display = 'none';
        });
        // Show the target section
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
        window.scrollTo(0,0); // Scroll to top
    }

    // Initially show home
    if (homeSection) showSection(homeSection);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('href').substring(1);
            if (targetId === 'home') {
                showSection(homeSection);
                e.preventDefault();
            } else if (targetId === 'post1' || targetId === 'post2') { // Example for direct post link from nav (if any)
                 const targetPost = document.getElementById(targetId);
                 if (targetPost) {
                     showSection(targetPost);
                     e.preventDefault();
                 }
            }
            // For 'About', 'Archives', 'Tags', you'd create corresponding sections or handle differently
        });
    });

    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('href').substring(1);
            const targetPost = document.getElementById(targetId);
            if (targetPost) {
                showSection(targetPost);
                e.preventDefault();
            }
        });
    });

    if (siteTitleLink) {
        siteTitleLink.addEventListener('click', (e) => {
            if (homeSection) {
                showSection(homeSection);
                e.preventDefault();
            }
        });
    }

});