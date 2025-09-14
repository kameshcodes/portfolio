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
    speed: 100,          // Average typing speed
    deleteSpeed: 150,     // Speed for corrections
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
  .type('<span class="hero-name">Kamesh</span><br><span class="hero-name">dubey</span>', { html: true }) // Intentionally lowercase first
  .pause(800)           // Pause to "notice" the error
  .delete(5)           // Delete only "dubey"
  .pause(300)           // Brief pause before correction
  .type('<span class="hero-name">Dubey</span>', { html: true }) // Correct only "Dubey"
  .pause(400)           // Pause before dots
  .type('<span class="hero-name">...</span>', { html: true })          // Add three dots at the end
  .go();                // Start the animation
});
