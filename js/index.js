// Sidebar Toggle for Mobile
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const mainWrapper = document.querySelector(".main-wrapper");

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("sidebar-open");
  });
}

// Close sidebar when clicking outside on mobile
if (mainWrapper) {
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 968 && 
        sidebar.classList.contains("sidebar-open") &&
        !sidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove("sidebar-open");
    }
  });
}

// Close sidebar when clicking on a nav link (mobile)
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    if (window.innerWidth <= 968) {
      sidebar.classList.remove("sidebar-open");
    }
  });
});

// Enhanced hover animation for hero name
document.addEventListener("DOMContentLoaded", () => {
  
  // Check current page first
  const currentPath = window.location.pathname;
  const isOnBlogPage = currentPath.includes('blogs');
  
  // If on blog page, don't run any index page highlighting logic
  if (isOnBlogPage) {
    // Skip all index page initialization for blogs page
    const heroName = document.querySelector('.hero-name');
    // Run hero animation if element exists
    if (heroName) {
      setupHeroAnimation(heroName);
    }
    return; // Exit early, let blogs.js handle everything
  }
  
  // Check if navigating from blog page - scroll to contact section
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('from') === 'blog') {
    // Add slide-in animation from bottom
    document.body.classList.add('slide-in-from-bottom');
    
    // Set flag to prevent observer interference
    window.comingFromBlog = true;
    
    // Remove the query parameter from URL
    window.history.replaceState({}, '', window.location.pathname);
    
    // Scroll to contact section immediately (before animation)
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      // Instant scroll without smooth behavior
      window.scrollTo(0, document.documentElement.scrollHeight);
      
      // Highlight contact link in sidebar IMMEDIATELY
      const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
      allNavLinks.forEach(link => link.classList.remove('active'));
      const contactLink = document.querySelector('.nav-link[data-section="contact"]');
      if (contactLink) {
        contactLink.classList.add('active');
      }
    }
    
    // Clean up animation class and re-enable observer after animation
    setTimeout(() => {
      document.body.classList.remove('slide-in-from-bottom');
      // Re-enable observer immediately after animation
      window.comingFromBlog = false;
    }, 0);
  } else {
    // Normal page load - set Home as active if not coming from blog
    const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
    
    // Only highlight home if we're on index page
    allNavLinks.forEach(link => link.classList.remove('active'));
    const homeLink = document.querySelector('.nav-link[data-section="home"]');
    if (homeLink) {
      homeLink.classList.add('active');
    }
  }
  
  const heroName = document.querySelector('.hero-name');
  
  if (heroName) {
    let isHovering = false;
    let animationTimeout;
    let entryPoint = 0;
    
    // Mouse enter handler
    heroName.addEventListener('mouseenter', (e) => {
      isHovering = true;
      
      // Calculate exact mouse position relative to element
      const rect = heroName.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const elementWidth = rect.width;
      const percentage = Math.max(0, Math.min(100, (mouseX / elementWidth) * 100));
      
      // Store the entry point
      entryPoint = percentage;
      
      // Set the mouse position for the gradient
      heroName.style.setProperty('--mouse-position', `${percentage}%`);
      
      // Add animating class to trigger the animation
      heroName.classList.add('animating');
    });
    
    // Mouse move handler for continuous tracking
    heroName.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      
      const rect = heroName.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const elementWidth = rect.width;
      const percentage = Math.max(0, Math.min(100, (mouseX / elementWidth) * 100));
      
      // Update the gradient position based on current mouse position
      heroName.style.setProperty('--mouse-position', `${percentage}%`);
    });
    
    // Mouse leave handler
    heroName.addEventListener('mouseleave', () => {
      isHovering = false;
      
      // Clear any existing timeout
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      
      // Remove animating class after transition completes
      animationTimeout = setTimeout(() => {
        heroName.classList.remove('animating');
        // Reset mouse position
        heroName.style.setProperty('--mouse-position', '0%');
      }, 400);
    });
  }
});

// Enhanced navigation with data-section attributes
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  
  // Map data-section to actual section IDs
  const sectionIdMap = {
    'home': 'hero',
    'project': 'project',
    'skills': 'skills',
    'contact': 'contact'
  };
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      const section = link.getAttribute("data-section");
      const targetPage = link.getAttribute("data-target-page");
      const currentPage = window.location.pathname.includes('blogs') ? 'blogs' : 'index';
      
      // Special handling for Contact - always go to blogs page with section parameter
      if (section === 'contact' && targetPage === 'blogs') {
        window.location.href = './blogs.html?section=contact';
        return;
      }
      
      // Get the actual section ID to scroll to
      const actualSectionId = sectionIdMap[section] || section;
      const targetElement = document.getElementById(actualSectionId);
      
      if (targetElement && (targetPage === 'current' || targetPage === currentPage || targetPage === 'index')) {
        // Immediately update active state for instant feedback
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        
        // Update URL with section parameter
        const newUrl = `${window.location.pathname}?section=${section}`;
        window.history.pushState({section: section}, '', newUrl);
        
        // Smooth scroll to section on current page
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      } else if (targetPage === 'blogs' && section === 'blogs') {
        // Navigate to blogs page
        window.location.href = './blogs.html';
      } else if (targetPage === 'blogs') {
        // Navigate to blogs page with section
        window.location.href = `./blogs.html?section=${section}`;
      } else {
        // Navigate to different page with query parameter
        const targetUrl = targetPage === 'index' ? './index.html' : './blogs.html';
        const queryParam = `?section=${section}`;
        window.location.href = targetUrl + queryParam;
      }
    });
  });
  
  // Handle page load with section query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const targetSection = urlParams.get('section');
  
  if (targetSection) {
    // Wait for page to load, then scroll to section
    setTimeout(() => {
      const actualSectionId = sectionIdMap[targetSection] || targetSection;
      const element = document.getElementById(actualSectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Update active state
        const correspondingLink = document.querySelector(`[data-section="${targetSection}"]`);
        if (correspondingLink) {
          navLinks.forEach(l => l.classList.remove("active"));
          correspondingLink.classList.add("active");
        }
      }
    }, 100);
  }
});

// Active Section Detection with Intersection Observer - Enhanced and Fixed
document.addEventListener("DOMContentLoaded", () => {
  // Skip intersection observer on blog page
  const currentPath = window.location.pathname;
  if (currentPath.includes('blogs')) {
    return; // Exit early for blog page
  }
  
  const sections = document.querySelectorAll("section[id], .hero[id], #top");
  const allNavLinks = document.querySelectorAll(".nav-link[data-section]");
  
  // Flag to prevent observer interference when coming from blog
  let comingFromBlog = false;
  
  // Create a map of section IDs to nav links with proper mapping
  const sectionToNavMap = {
    'hero': 'home',      // Hero section maps to Home nav
    'top': 'home',       // Top also maps to Home
    'project': 'project',
    'courses': 'courses',
    'skills': 'skills',
    'contact': 'contact'
  };
  
  // Create reverse map for easy lookup
  const navLinkMap = {};
  allNavLinks.forEach(link => {
    const section = link.getAttribute("data-section");
    if (section) {
      navLinkMap[section] = link;
    }
  });
  
  // Intersection Observer options - optimized for better detection
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -70% 0px', // Trigger when section enters top 10-30% of viewport
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  };
  
  let currentActive = null;
  let isManualScroll = false;
  
  const observerCallback = (entries) => {
    // Skip if user just clicked a nav link or coming from blog
    if (isManualScroll || window.comingFromBlog) return;
    
    // Sort entries by intersection ratio (highest first)
    const sortedEntries = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => {
        // Prioritize entries with higher intersection ratio
        if (b.intersectionRatio !== a.intersectionRatio) {
          return b.intersectionRatio - a.intersectionRatio;
        }
        // If equal, prioritize entries closer to top of viewport
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });
    
    if (sortedEntries.length > 0) {
      const topEntry = sortedEntries[0];
      const sectionId = topEntry.target.id || 'top';
      
      // Map the actual section ID to the nav link data-section
      const navSection = sectionToNavMap[sectionId] || sectionId;
      const correspondingLink = navLinkMap[navSection];
      
      if (correspondingLink && correspondingLink !== currentActive) {
        // Remove active class from all links with transition
        allNavLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to current link
        correspondingLink.classList.add('active');
        currentActive = correspondingLink;
        
        // Update URL with section parameter
        const newUrl = `${window.location.pathname}?section=${navSection}`;
        window.history.replaceState({section: navSection}, '', newUrl);
      }
    }
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // Observe all sections EXCEPT contact (which is now on blog page)
  sections.forEach(section => {
    if (section.id !== 'contact') {
      observer.observe(section);
    }
  });
  
  // Enhanced click handler with manual scroll flag
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Set manual scroll flag
      isManualScroll = true;
      
      // Immediately update active state
      allNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentActive = link;
      
      // Reset flag after scroll completes
      setTimeout(() => {
        isManualScroll = false;
      }, 1000);
    });
  });
  
  // Set initial active state based on scroll position or current page
  const setInitialActive = () => {
    const currentPath = window.location.pathname;
    
    // Don't do anything if coming from blog - it's already set
    if (window.comingFromBlog) {
      return;
    }
    
    // Clear all active states first
    allNavLinks.forEach(link => link.classList.remove('active'));
    
    if (currentPath.includes('blogs')) {
      const blogsLink = navLinkMap['blogs'];
      if (blogsLink) {
        blogsLink.classList.add('active');
        currentActive = blogsLink;
      }
      return; // Exit early to prevent activating other links
    } else {
      // Check which section is currently in view
      let activeSet = false;
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.top <= window.innerHeight * 0.3;
        
        if (isInView && !activeSet) {
          const sectionId = section.id || 'top';
          const navSection = sectionToNavMap[sectionId] || sectionId;
          const correspondingLink = navLinkMap[navSection];
          
          if (correspondingLink) {
            correspondingLink.classList.add('active');
            currentActive = correspondingLink;
            activeSet = true;
          }
        }
      });
      
      // Default to Home if nothing is in view
      if (!activeSet) {
        const homeLink = navLinkMap['home'];
        if (homeLink) {
          homeLink.classList.add('active');
          currentActive = homeLink;
        }
      }
    }
  };
  
  // Set initial active state after a brief delay
  setTimeout(setInitialActive, 100);
});

document.addEventListener("DOMContentLoaded", function () {
    const experienceItems = document.querySelectorAll(".duration");
  
    experienceItems.forEach((item) => {
      const startDate = item.getAttribute("data-start-date");
      const endDate = item.getAttribute("data-end-date"); // Optional, for finished jobs
  
      if (startDate) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(); // Use the end date if provided, otherwise use the current date
  
        // Calculate the difference in months
        let totalMonths = (end.getFullYear() - start.getFullYear()) * 12;
        totalMonths -= start.getMonth();
        totalMonths += end.getMonth();
  
        // Ensure totalMonths is never negative
        totalMonths = totalMonths > 0 ? totalMonths : 0;
  
        // Calculate years and remaining months
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
  
        // Construct the duration string
        let durationText = '';
        if (years > 0) {
          durationText += years + (years === 1 ? ' yr' : ' yrs'); // Singular for 1 year
        }
        if (months > 0) {
          if (years > 0) {
            durationText += ' '; // Add space between years and months
          }
          durationText += months + (months === 1 ? ' mo' : ' mos'); // Singular for 1 month
        }
  
        // If there are no years or months, set it to "0 mos"
        if (durationText === '') {
          durationText = '0 mos';
        }
  
        // Update the .months-worked span with the calculated value
        item.querySelector(".months-worked").textContent = durationText;
      }
    });
  });

  
// CHANGE EMAIL HERE 
  document.getElementById('copyEmailButton').addEventListener('click', function() {
    const email = 'kamesh.iitbombay@gmail.com';   // CHANGE EMAIL HERE // CHANGE EMAIL HERE
    const notification = document.getElementById('copyNotification');
  
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(function() {
        showNotification();
      }, function(err) {
        console.error('Could not copy text: ', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showNotification();
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  
    function showNotification() {
      notification.textContent = 'Email address copied to clipboard.';
      notification.style.display = 'block';
      setTimeout(function() {
        notification.style.display = 'none';
      }, 2000);
    }
  });

// Project Modal Functionality
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("projectModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.querySelector(".modal-close");
  
  // Project data
  const projectData = {
    "sov-chatbot": {
      title: "SOV Chatbot for Underwriters",
      content: `
        <div class="project-meta">
          <p><strong>Organization:</strong> Bluepond AI, Chennai</p>
          <p><strong>Role:</strong> Data Science Intern</p>
          <p><strong>Mentor:</strong> Sunyam Bagga</p>
          <p><strong>Tech Stack:</strong> Python, PyTorch, LangChain, SQL, Pandas, OpenAI API, Transformers (DistilBERT, Sentence Transformers), FastAPI</p>
        </div>

        <p>This project transforms how underwriters work with SOV Excel files, turning hours of manual data cleaning into seconds and days spreadsheet analysis into minutes of natural conversation with an AI assistant.</p>


        <h3>System Overview</h3>

        <div style="text-align: center; margin: 2rem 0;">
          <img src="./public/sov-chatbot-system-design.png" alt="SOV Chatbot System Design" style="max-width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
        </div>

        <br>

        <p>The system works in three connected phases:</p>
        
        <div style="background-color: rgba(240, 242, 245, 0.5); padding: 2rem; border-radius: 0.75rem; margin: 1.5rem 0; border: 1px solid rgba(0, 0, 0, 0.08);">
          <div style="font-family: 'Söhne', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <p style="margin: 0.5rem 0; text-align: center;"><strong style="font-size: 1.05rem;">Raw Excel Files</strong></p>
            <p style="margin: 0.5rem 0; text-align: center; color: var(--primary); font-size: 1.2rem;">↓</p>
            <p style="margin: 0.5rem 0; text-align: center;"><span class="phase-label" style="font-weight: 600;">Phase 1:</span> ETL Pipeline → Clean & standardize data</p>
            <p style="margin: 0.5rem 0; text-align: center; color: var(--primary); font-size: 1.2rem;">↓</p>
            <p style="margin: 0.5rem 0; text-align: center;"><span class="phase-label" style="font-weight: 600;">Phase 2:</span> Query Filter → Block off-topic queries</p>
            <p style="margin: 0.5rem 0; text-align: center; color: var(--primary); font-size: 1.2rem;">↓</p>
            <p style="margin: 0.5rem 0; text-align: center;"><span class="phase-label" style="font-weight: 600;">Phase 3:</span> Chatbot Pipeline→ Retrieve & generate insights</p>
            <p style="margin: 0.5rem 0; text-align: center; color: var(--primary); font-size: 1.2rem;">↓</p>
            <p style="margin: 0.5rem 0; text-align: center;"><strong style="font-size: 1.05rem;">Conversational Insights</strong></p>
          </div>
        </div>

        <h3>Phase 1: Data Processing & ETL</h3>
        <p><strong>Problem:</strong> Different underwriters have their SOV Excel files in various formats like multi-tab workbooks, irregular headers, inconsistent structures that make traditional ETL pipelines break.</p>
        
        <p><strong>Solution:</strong> Developed an intelligent ETL pipeline that integrates GenAI reasoning with Python logic to automatically identify and standardize Statement-of-Value (SOV) sheets within complex Excel workbooks, generate a clean, downloadable standardized file, and update the database, eliminating the need for manual rule maintenance.</p>
        
        
        <p><strong>Impact:</strong> Pipeline automatically adapts to new workbook layouts without manual rule updates—traditional ETL would require constant maintenance.</p>

        <h3>Phase 2: Query Filtering to Save API Costs</h3>
        <p><strong>Problem:</strong> OpenAI API calls are expensive, and irrelevant queries waste both money and time.</p>
        
        <p><strong>Solution:</strong> Built an intelligent pre-filter using a fine-tuned <strong>DistilBERT classifier (F1: 99.54%)</strong>. Collaborated with the business team to manually label 100 high-quality insurance vs. general query samples, then leveraged AI-powered data augmentation to generate 1,900 synthetic examples, creating a robust 2,000-sample training dataset. After fine-tuning, deployed the model as a gatekeeper to filter queries before they reach the expensive OpenAI API.</p>
        
        <div style="background-color: rgba(240, 242, 245, 0.5); padding: 1rem 1.5rem; border-radius: 0.5rem; margin: 1rem 0;">
          <p style="margin: 0; font-size: 0.9rem;"><strong>User:</strong> <em>"Write all the prime numbers less than 100"</em></p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;"><strong class="bot-label">Bot:</strong> "I apologize, but I can only help with insurance and underwriting-related questions."</p>
        </div>
        
        <p><strong>Impact:</strong> Reduced redundant API calls, significantly cutting costs while maintaining 100% context relevance.</p>

        <h3>Phase 3: RAG Chatbot Implementation</h3>
        <p><strong>Problem:</strong> Underwriters need to analyze portfolio data quickly but manual spreadsheet analysis takes hours and requires SQL knowledge.</p>
        
        <p><strong>Solution:</strong> Built a <strong>Retrieval-Augmented Generation (RAG)</strong> system using <strong>LangChain + OpenAI API</strong> that converts natural language to SQL queries, retrieves relevant data, and intelligently formats responses (tables, charts, or text) with conversation memory for follow-ups.</p>
        
        <div style="background-color: rgba(240, 242, 245, 0.5); padding: 1rem 1.5rem; border-radius: 0.5rem; margin: 1rem 0;">
          <p style="margin: 0; font-size: 0.9rem;"><strong>User:</strong> <em>"Summarize exposure by region"</em></p>
          <p style="margin: 0.5rem 0; font-size: 0.9rem;"><strong class="bot-label">Bot:</strong> [Returns summary table with regions and total values]</p>
          <p style="margin: 1rem 0 0.5rem 0; font-size: 0.9rem;"><strong>User:</strong> <em>"Make that a bar chart instead"</em></p>
          <p style="margin: 0; font-size: 0.9rem;"><strong class="bot-label">Bot:</strong> [Converts to visualization instantly]</p>
        </div>
        
        <p><strong>Impact:</strong> Underwriters can explore SOV data through conversation rather than manual spreadsheet analysis, reducing analysis time from days to minutes.</p>

        <h3>What I learned</h3>
        <p>Beyond the tech side of the project, I learned that building useful AI is about reliability and trust, not complexity. The real value came from thoughtful system design. Intelligent query filtering eliminated hallucinations and cut costs, the hybrid ETL pipeline proved that GenAI + Python logic can create stable systems, and the RAG architecture compressed days of analysis into minutes.</p>
      `
    }
  };

  // Open modal when clicking on project containers
  document.querySelectorAll(".project-clickable").forEach(container => {
    container.addEventListener("click", (e) => {
      // Prevent opening modal if clicking on a link
      if (e.target.tagName === "A" || e.target.closest("a")) {
        return;
      }

      const projectId = container.getAttribute("data-project");
      const project = projectData[projectId];
      
      if (project) {
        modalBody.innerHTML = `<h2>${project.title}</h2>${project.content}`;
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }
    });
  });

  // Close modal when clicking the X
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // =====================================
  // Page Navigation Gestures with Smooth Transitions
  // =====================================

  // Check scroll position
  function isAtPageBottom() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= 50;
  }

  // Smooth page transition function
  function navigateWithSlideTransition(url) {
    // Instant navigation - no animation delay
    window.location.href = url;
  }

  // Track scroll for gesture detection
  let isNavigating = false;
  const currentPath = window.location.pathname;
  const isOnBlogPage = currentPath.includes('blogs');

  // Wheel event for gesture detection at page bottom
  let wheelDeltaAccumulator = 0;
  let wheelTimeout;

  window.addEventListener('wheel', (e) => {
    if (isNavigating) return;

    clearTimeout(wheelTimeout);
    wheelDeltaAccumulator += e.deltaY;

    wheelTimeout = setTimeout(() => {
      // Strong downward scroll at bottom -> navigate to blogs
      if (!isOnBlogPage && isAtPageBottom() && wheelDeltaAccumulator > 100) {
        isNavigating = true;
        navigateWithSlideTransition('./blogs.html?from=index');
      }
      
      wheelDeltaAccumulator = 0;
    }, 10);
  }, { passive: true });

  // Touch gesture support
  let touchStartY = 0;
  let touchEndY = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isNavigating) return;
    
    touchEndY = e.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;

    // Swipe up (scroll down) from bottom -> go to blogs
    if (!isOnBlogPage && isAtPageBottom() && swipeDistance > 50) {
      isNavigating = true;
      navigateWithSlideTransition('./blogs.html?from=index');
    }
  }, { passive: true });
});

// Resume Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalClose = document.getElementById('resumeModalClose');
  const resumeFrame = document.getElementById('resumeFrame');

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      resumeFrame.src = './public/resume/Resume_Kamesh_Dubey.pdf';
      resumeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', function() {
      resumeModal.style.display = 'none';
      resumeFrame.src = '';
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal when clicking outside
  if (resumeModal) {
    resumeModal.addEventListener('click', function(e) {
      if (e.target === resumeModal) {
        resumeModal.style.display = 'none';
        resumeFrame.src = '';
        document.body.style.overflow = 'auto';
      }
    });
  }
});

