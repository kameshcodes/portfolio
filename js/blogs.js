document.addEventListener("DOMContentLoaded", async () => {
  const username = "kameshdubey";
  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;

  // Fetch Medium articles using public RSS feed
  async function fetchMediumArticles() {
    try {
      const response = await fetch(rssUrl);
      const data = await response.json();
      if (data && data.items) {
        return data.items;
      } else {
        console.error("No articles found in the RSS feed.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching Medium articles:", error);
      return [];
    }
  }

  // Create HTML structure for each article
  function createBlogPostContainer(article) {
    const blogsContainer = document.getElementById("blogs-container");
    const container = document.createElement("div");
    container.className = "project-container";

    const imageUrl = article.thumbnail || "https://placehold.co/600x400?text=No+Image";
    container.innerHTML = `
        <a href="${article.link}" target="_blank" class="project-image">
          <img src="${imageUrl}" alt="${article.title}" class="blog-image" style="height: 250px; width: 350px;">
        </a>
        <div class="project-content">
          <a href="${article.link}" target="_blank" class="blog-title-link">
            <h3>${article.title}</h3>
          </a>
          <p>${article.description.replace(/<[^>]*>/g, "").substring(0, 100)}...</p>
          <a href="${article.link}" target="_blank" class="btn">Read More</a>
        </div>
    `;
    blogsContainer.appendChild(container);
  }

  // Update view count for each article using localStorage
  function updateViewCount(articleId) {
    const viewCountElement = document.querySelector(`.view-count[data-id="${articleId}"]`);
    let viewCount = localStorage.getItem(articleId) || 0;
    viewCount = parseInt(viewCount) + 1;
    localStorage.setItem(articleId, viewCount);
    if (viewCountElement) {
      viewCountElement.textContent = viewCount;
    }
  }

  // Handle the share button click to copy article link
  function handleShareButtonClick(event) {
    const url = event.target.getAttribute("data-url");
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard");
    });
  }

  // Fetch articles and display them
  const articles = await fetchMediumArticles();
  articles.forEach((article) => {
    createBlogPostContainer(article);
    updateViewCount(article.guid);
  });

  // Attach event listeners to share buttons
  document.querySelectorAll(".btn-share").forEach((button) => {
    button.addEventListener("click", handleShareButtonClick);
  });
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
