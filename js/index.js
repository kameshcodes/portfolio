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

// Typewriter: "Hi, I am Kamesh Dubey" with space reservation
document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("heroTitle");
  if (!target) return;

  // First create the wrapper to maintain layout with line breaks after "I am" and after "Kamesh"
  target.innerHTML = `<span id="heroWrapper" style="visibility: hidden">Hi, I am <br><span class="hero-name">Kamesh</span><br><span class="hero-name">Dubey</span></span>`;
  
  // Create visible text container that will be animated
  const animatedText = document.createElement("span");
  animatedText.id = "animatedText";
  animatedText.style.position = "absolute";
  target.prepend(animatedText);
  
  const parts = [
    { text: "Hi, I am ", className: null, speed: 30},
    { text: "<br>", isHTML: true, speed: 10 },
    { text: "Kamesh", className: "hero-name", speed: 100 },
    { text: "<br>", isHTML: true, speed: 10 },
    { text: "Dubey", className: "hero-name", speed: 100 },
  ];

  let partIdx = 0;
  function typePart() {
    if (partIdx >= parts.length) return;

    const { text, className, isHTML, speed } = parts[partIdx];
    
    if (isHTML) {
      // Handle HTML elements like <br>
      animatedText.innerHTML += text;
      partIdx += 1;
      setTimeout(() => typePart(), speed);
      return;
    }
    
    const node = className ? document.createElement("span") : document.createTextNode("");
    if (className) node.className = className;
    animatedText.appendChild(node);

    let i = 0;
    const timer = setInterval(() => {
      if (i >= text.length) {
        clearInterval(timer);
        partIdx += 1;
        typePart();
        return;
      }
      if (className) {
        node.textContent += text.charAt(i);
      } else {
        node.textContent += text.charAt(i);
      }
      i += 1;
    }, speed);
  }

  typePart();
});
