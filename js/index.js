const btnHamburger = document.querySelector(".fa-bars");

const nav = document.getElementById("nav");

btnHamburger.addEventListener("click", () => {
  if (nav.classList.contains("navOpen")) {
    nav.classList.remove("navOpen");
  } else {
    nav.classList.add("navOpen");
  }
});

const btnTheme = document.getElementById("toggleTheme");

btnTheme.addEventListener("click", () => {
  if (document.body.classList.contains("body-light")) {
    document.body.classList.add("body-dark");
    document.body.classList.remove("body-light");
  } else {
    document.body.classList.add("body-light");
    document.body.classList.remove("body-dark");
  }
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

// TypeIt: "Hi, I'm Kamesh Dubey..." with realistic typing effect and error correction
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM loaded, starting TypeIt setup');
  const target = document.getElementById("heroTitle");
  
  if (!target) {
    console.error('Target element not found');
    return;
  }

  // Clear any existing content first
  target.innerHTML = '';

  // Check if TypeIt is available
  if (typeof TypeIt === 'undefined') {
    console.log('TypeIt not loaded, using fallback');
    // Fallback to complete text
    target.innerHTML = 'Hi, I\'m <br><span class="hero-name">Kamesh</span><br><span class="hero-name">Dubey</span>';
    return;
  }

  console.log('TypeIt loaded successfully');

  // Initialize TypeIt with realistic human-like typing
  new TypeIt(target, {
    speed: 70,          // Average typing speed
    deleteSpeed: 120,     // Speed for corrections
    lifeLike: true,      // Variable delays to mimic human typing
    cursor: false,       // No cursor during or after typing
    loop: false,         // Don't repeat
    waitUntilVisible: true, // Start when element is visible
    afterComplete: function(instance) {
      // Make only the final dot blink
      console.log('TypeIt completed, making final dot blink');
      const targetElement = instance.getElement();
      console.log('Current HTML:', targetElement.innerHTML);
      
      // Find the span containing "..." and replace the last dot
      const heroSpans = targetElement.querySelectorAll('.hero-name');
      heroSpans.forEach((span, index) => {
        console.log(`Span ${index}: "${span.textContent}"`);
        if (span.textContent === '...') {
          console.log('Found dots span, making last dot blink');
          span.innerHTML = '..<span class="blinking-dot">.</span>';
        }
      });
    }
  })
  .type("Hi, I'm ")
  .pause(200)           // Natural pause before name
  .type('<span class="hero-name">Kamesh</span><br><span class="hero-name">dube</span>', { html: true }) // Intentionally lowercase first
  .pause(700)           // Pause to "notice" the error
  .delete(4)           
  .pause(300)           // Brief pause before correction
  .type('<span class="hero-name">Dubey</span>', { html: true }) // Correct only "Dubey"
  .pause(400)           // Pause before dots
  .type('<span class="hero-name">...</span>', { html: true })          // Add three dots at the end
  .go();                // Start the animation
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
});

