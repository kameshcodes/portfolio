// Pagination functionality for blogs
document.addEventListener("DOMContentLoaded", () => {
  
  // Check for section parameter (e.g., ?section=contact)
  const urlParams = new URLSearchParams(window.location.search);
  const targetSection = urlParams.get('section');
  const comingFromIndex = urlParams.get('from') === 'index';
  
  // IMMEDIATELY Set Blog link as active on page load - run this first
  const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
  allNavLinks.forEach(link => link.classList.remove('active'));
  
  // If navigating to contact section, highlight Contact instead of Blog
  if (targetSection === 'contact') {
    const contactLink = document.querySelector('.nav-link[data-section="contact"]');
    if (contactLink) {
      contactLink.classList.add('active');
    }
    
    // Function to scroll to contact
    const scrollToContact = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        // Get the actual position
        const yOffset = contactSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: yOffset,
          behavior: 'smooth'
        });
      }
    };
    
    // Wait a bit for page to load, then scroll smoothly
    setTimeout(scrollToContact, 100);
    
    // Also wait for images to load as fallback
    window.addEventListener('load', () => {
      setTimeout(scrollToContact, 50);
    });
    
    // Clean up URL after scrolling
    setTimeout(() => {
      window.history.replaceState({}, '', window.location.pathname);
    }, 300);
  } else {
    // Normal blog page load - highlight Blog
    const blogLink = document.querySelector('.nav-link[data-section="blogs"]');
    if (blogLink) {
      blogLink.classList.add('active');
    }
    
    // Force it again after a tiny delay to override any other scripts
    setTimeout(() => {
      allNavLinks.forEach(link => link.classList.remove('active'));
      if (blogLink) {
        blogLink.classList.add('active');
      }
    }, 50);
  }
  
  // Add slide-in animation if coming from index page (but not if going to contact)
  if (comingFromIndex && targetSection !== 'contact') {
    document.body.classList.add('slide-in-from-bottom');
    window.history.replaceState({}, '', window.location.pathname);
    
    // Clean up animation class after it completes
    setTimeout(() => {
      document.body.classList.remove('slide-in-from-bottom');
    }, 0);
  }
  
  const blogsPerPage = 4;
  let currentPage = 1;
  let allBlogs = [];
  let isTransitioning = false;
  
  // Sidebar navigation handling
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionIdMap = {
    'home': 'hero',
    'project': 'project',
    'courses': 'courses',
    'stack': 'stack',
    'contact': 'contact',
    'blogs': 'blogs'
  };

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const section = link.getAttribute("data-section");
      const targetPage = link.getAttribute("data-target-page");
      const currentPageType = 'blogs';
      
      // Handle Contact link on blog page - scroll to contact section
      if (section === 'contact' && targetPage === 'blogs') {
        e.preventDefault();
        
        // Immediately update active state
        const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
        allNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      
      // If target is index page, navigate there
      if (targetPage === 'index') {
        e.preventDefault();
        const actualSectionId = sectionIdMap[section] || section;
        window.location.href = `./index.html?section=${actualSectionId}`;
        return;
      }
      
      // If it's already handled by href (like #contact), let it proceed
      if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
        // Let default behavior handle it
        return;
      }
    });
  });
  
  // Get all blog containers
  function initializeBlogs() {
    const blogsContainer = document.getElementById("blogs-container");
    allBlogs = Array.from(blogsContainer.querySelectorAll(".project-container"));
    
    // Add data attributes for pagination and initial styles
    allBlogs.forEach((blog, index) => {
      blog.setAttribute("data-blog-index", index);
      blog.style.opacity = "0";
      blog.style.display = "none";
      blog.style.transition = "opacity 0.4s ease-in-out, transform 0.4s ease-in-out";
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(allBlogs.length / blogsPerPage);
    
    // Generate pagination buttons
    generatePaginationButtons(totalPages);
    
    // Show first page
    showPage(1, false);
    
    // Setup keyboard navigation
    setupKeyboardNavigation(totalPages);
  }
  
  // Generate pagination buttons with ellipsis
  function generatePaginationButtons(totalPages) {
    const paginationContainer = document.getElementById("pagination-buttons");
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = "";
    
    if (totalPages <= 1) {
      paginationContainer.style.display = "none";
      return;
    }
    
    paginationContainer.style.display = "flex";
    
    // Previous button
    const prevButton = createPaginationButton("‹", "prev", currentPage > 1, "Previous page");
    paginationContainer.appendChild(prevButton);
    
    // Page numbers with ellipsis logic
    const pageButtons = generatePageNumbers(totalPages);
    pageButtons.forEach(btn => paginationContainer.appendChild(btn));
    
    // Next button
    const nextButton = createPaginationButton("›", "next", currentPage < totalPages, "Next page");
    paginationContainer.appendChild(nextButton);
  }
  
  // Generate page number buttons with smart ellipsis
  function generatePageNumbers(totalPages) {
    const buttons = [];
    const maxVisible = 5; // Maximum visible page numbers
    
    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(createPaginationButton(i.toString(), i.toString(), true, `Go to page ${i}`));
      }
    } else {
      // Complex ellipsis logic for many pages
      buttons.push(createPaginationButton("1", "1", true, "Go to page 1"));
      
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 2; i <= 4; i++) {
          buttons.push(createPaginationButton(i.toString(), i.toString(), true, `Go to page ${i}`));
        }
        buttons.push(createPaginationButton("...", "ellipsis", false, "More pages"));
        buttons.push(createPaginationButton(totalPages.toString(), totalPages.toString(), true, `Go to page ${totalPages}`));
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        buttons.push(createPaginationButton("...", "ellipsis", false, "More pages"));
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(createPaginationButton(i.toString(), i.toString(), true, `Go to page ${i}`));
        }
      } else {
        // In the middle
        buttons.push(createPaginationButton("...", "ellipsis", false, "More pages"));
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(createPaginationButton(i.toString(), i.toString(), true, `Go to page ${i}`));
        }
        buttons.push(createPaginationButton("...", "ellipsis", false, "More pages"));
        buttons.push(createPaginationButton(totalPages.toString(), totalPages.toString(), true, `Go to page ${totalPages}`));
      }
    }
    
    return buttons;
  }
  
  // Create pagination button with accessibility
  function createPaginationButton(text, value, enabled = true, ariaLabel = "") {
    const button = document.createElement("button");
    button.className = `pagination-btn ${currentPage == value ? 'active' : ''} ${!enabled ? 'disabled' : ''}`;
    button.textContent = text;
    button.setAttribute("data-page", value);
    button.setAttribute("aria-label", ariaLabel || text);
    
    if (currentPage == value && value !== "ellipsis" && value !== "prev" && value !== "next") {
      button.setAttribute("aria-current", "page");
    }
    
    if (!enabled || value === "ellipsis") {
      button.setAttribute("disabled", "true");
      button.setAttribute("tabindex", "-1");
    }
    
    if (enabled && value !== "ellipsis") {
      button.addEventListener("click", () => {
        if (value === "prev") {
          goToPage(currentPage - 1);
        } else if (value === "next") {
          goToPage(currentPage + 1);
        } else {
          goToPage(parseInt(value));
        }
      });
      
      // Keyboard support for Enter and Space
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          button.click();
        }
      });
    }
    
    return button;
  }
  
  // Setup keyboard navigation
  function setupKeyboardNavigation(totalPages) {
    const paginationContainer = document.getElementById("pagination-buttons");
    if (!paginationContainer) return;
    
    paginationContainer.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentPage > 1) goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentPage < totalPages) goToPage(currentPage + 1);
      }
    });
  }
  
  // Go to specific page
  function goToPage(page) {
    const totalPages = Math.ceil(allBlogs.length / blogsPerPage);
    
    if (page < 1 || page > totalPages || page === currentPage || isTransitioning) return;
    
    currentPage = page;
    showPage(page, true);
    generatePaginationButtons(totalPages);
    
    // Smooth scroll to top of blogs section
    const blogsContainer = document.getElementById("blogs-container");
    if (blogsContainer) {
      const headerOffset = 100; // Offset for fixed header
      const elementPosition = blogsContainer.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }
  
  // Show specific page with smooth fade and slide transition
  function showPage(page, animate = true) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const startIndex = (page - 1) * blogsPerPage;
    const endIndex = Math.min(startIndex + blogsPerPage, allBlogs.length);
    
    const transitionDuration = animate ? 400 : 0;
    
    // Hide all blogs with fade out and slide up
    allBlogs.forEach((blog, index) => {
      if (blog.style.display !== "none") {
        blog.style.opacity = "0";
        blog.style.transform = "translateY(-20px)";
      }
    });
    
    // Wait for fade out, then hide and show new blogs
    setTimeout(() => {
      allBlogs.forEach(blog => {
        blog.style.display = "none";
        blog.style.transform = "translateY(20px)";
      });
      
      // Show current page blogs with fade in and slide down
      for (let i = startIndex; i < endIndex; i++) {
        const blog = allBlogs[i];
        blog.style.display = "flex"; // Use flex to maintain layout
        blog.style.opacity = "0";
        
        // Stagger the animation for each blog
        setTimeout(() => {
          blog.style.opacity = "1";
          blog.style.transform = "translateY(0)";
        }, 50 * (i - startIndex));
      }
      
      // Mark transition as complete
      setTimeout(() => {
        isTransitioning = false;
      }, transitionDuration + 200);
      
    }, animate ? transitionDuration : 0);
  }
  
  // Initialize pagination
  initializeBlogs();
});

// Copy email functionality with notification display
document.getElementById('copyEmailButton').addEventListener('click', function() {
  const email = 'kamesh.iitbombay@gmail.com'; // Email address
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

// =====================================
// Page Navigation Gestures with Smooth Transitions
// =====================================

// Check scroll position
function isAtPageTop() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return scrollTop <= 50;
}

// Smooth page transition function
function navigateWithSlideTransition(url) {
  // Instant navigation - no animation delay
  window.location.href = url;
}

// Track scroll for gesture detection
let isNavigating = false;

// Wheel event for gesture detection at page top
let wheelDeltaAccumulator = 0;
let wheelTimeout;

window.addEventListener('wheel', (e) => {
  if (isNavigating) return;

  clearTimeout(wheelTimeout);
  wheelDeltaAccumulator += e.deltaY;

  wheelTimeout = setTimeout(() => {
    // Strong upward scroll at top -> navigate to index
    if (isAtPageTop() && wheelDeltaAccumulator < -100) {
      isNavigating = true;
      navigateWithSlideTransition('./index.html?from=blog');
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

  // Swipe down (scroll up) from top -> go to index
  if (isAtPageTop() && swipeDistance < -50) {
    isNavigating = true;
    navigateWithSlideTransition('./index.html?from=blog');
  }
}, { passive: true });

// Intersection Observer for Contact section highlighting
const contactSection = document.getElementById('contact');
if (contactSection) {
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -50% 0px', // More sensitive detection for smaller sections
    threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1]
  };

  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
      
      if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
        // Contact section is visible - highlight Contact
        allNavLinks.forEach(link => link.classList.remove('active'));
        const contactLink = document.querySelector('.nav-link[data-section="contact"]');
        if (contactLink) {
          contactLink.classList.add('active');
        }
      } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
        // Contact section not visible and is below viewport - highlight Blog
        allNavLinks.forEach(link => link.classList.remove('active'));
        const blogLink = document.querySelector('.nav-link[data-section="blogs"]');
        if (blogLink) {
          blogLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  contactObserver.observe(contactSection);
}







