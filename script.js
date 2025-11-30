// ----------- MOBILE NAVIGATION TOGGLE -----------

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');

    const expanded = navLinks.classList.contains('is-open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
}


// ----------- FOOTER YEAR AUTO UPDATE -----------

const yearSpan = document.getElementById('year');
if (yearSpan) {
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
}


// ----------- LOCAL REVIEW STORAGE -----------

const reviewForm = document.getElementById('review-form');
const reviewList = document.getElementById('review-list');
const REVIEWS_KEY = 'loveMassagennReviews';

// Helper: create DOM card from a review object
function createReviewCard(review) {
  const article = document.createElement('article');
  article.className = 'review-card';

  const pText = document.createElement('p');
  pText.className = 'review-text';
  pText.textContent = `“${review.message}”`;

  const pAuthor = document.createElement('p');
  pAuthor.className = 'review-author';

  const datePart = review.date
    ? ` · ${new Date(review.date).toLocaleDateString()}`
    : '';

  pAuthor.textContent = `– ${review.name || 'Anonymous'} (${review.rating}★${datePart})`;

  article.appendChild(pText);
  article.appendChild(pAuthor);

  return article;
}

// Load reviews from localStorage on page load
function loadReviews() {
  if (!reviewList) return;

  const saved = localStorage.getItem(REVIEWS_KEY);
  if (!saved) return;

  let reviews;
  try {
    reviews = JSON.parse(saved);
  } catch (e) {
    console.error('Could not parse saved reviews', e);
    return;
  }

  if (!Array.isArray(reviews)) return;

  // Render each saved review
  reviews.forEach((review) => {
    const card = createReviewCard(review);
    reviewList.appendChild(card);
  });
}

// Save review array back to localStorage
function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// Handle review form submit
if (reviewForm && reviewList) {
  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('review-name');
    const ratingSelect = document.getElementById('review-rating');
    const messageTextarea = document.getElementById('review-message');

    const name = nameInput.value.trim();
    const rating = ratingSelect.value;
    const message = messageTextarea.value.trim();

    if (!rating || !message) {
      alert('Please choose a rating and write a review.');
      return;
    }

    const newReview = {
      name: name || 'Anonymous',
      rating: rating,
      message: message,
      date: new Date().toISOString(),
    };

    // Get existing saved reviews
    let existing = [];
    const saved = localStorage.getItem(REVIEWS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          existing = parsed;
        }
      } catch (e) {
        console.error('Could not parse existing reviews', e);
      }
    }

    existing.push(newReview);
    saveReviews(existing);

    // Add to page
    const card = createReviewCard(newReview);
    reviewList.appendChild(card);

    // Reset form
    reviewForm.reset();
    ratingSelect.value = '';
  });

  // Load any existing reviews at start
  loadReviews();
}
