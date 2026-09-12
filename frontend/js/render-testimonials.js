// عرض قسم Testimonials كـ slider (رأي واحد في المرة) بجلبه من الباك إند

let testimonialsCache = [];
let activeTestimonialIndex = 0;

async function renderTestimonials() {
  const container = document.getElementById('testimonials-slider');
  if (!container) return;

  testimonialsCache = await fetchTestimonials();

  const dotsContainer = document.getElementById('testimonials-dots');

  if (!testimonialsCache.length) {
    container.innerHTML = `<p class="empty-state" data-en="No testimonials added yet" data-ar="لم تتم إضافة آراء بعد">No testimonials added yet</p>`;
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  activeTestimonialIndex = 0;
  renderTestimonialSlide();
  renderTestimonialDots();
}

function getClientInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function renderTestimonialSlide() {
  const container = document.getElementById('testimonials-slider');
  if (!container || !testimonialsCache.length) return;

  const item = testimonialsCache[activeTestimonialIndex];
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < item.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>'
  ).join('');

  const quoteEn = `"${item.quote.en}"`;
  const quoteAr = `"${item.quote.ar || item.quote.en}"`;

  container.innerHTML = `
    <div class="testimonial-card">
      ${item.tag ? `<span class="testimonial-tag">${item.tag}</span>` : ''}
      <div class="testimonial-stars">${stars}</div>
      <p class="testimonial-quote" data-en="${quoteEn}" data-ar="${quoteAr}">${quoteEn}</p>
      <div class="testimonial-footer">
        <div class="testimonial-avatar">${getClientInitials(item.clientName)}</div>
        <div class="testimonial-identity">
          <div class="testimonial-name">${item.clientName}</div>
          ${item.role ? `<div class="testimonial-role">${item.role}</div>` : ''}
        </div>
        ${
          item.verificationLink
            ? `<a href="${item.verificationLink}" target="_blank" rel="noopener" class="testimonial-verify-link" aria-label="Verify"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
            : ''
        }
      </div>
    </div>
  `;
}

function renderTestimonialDots() {
  const dotsContainer = document.getElementById('testimonials-dots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = testimonialsCache
    .map(
      (_, i) =>
        `<button class="testimonial-dot ${i === activeTestimonialIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
    )
    .join('');

  dotsContainer.querySelectorAll('.testimonial-dot').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTestimonialIndex = parseInt(btn.dataset.index, 10);
      renderTestimonialSlide();
      updateActiveDot();
    });
  });
}

function updateActiveDot() {
  document.querySelectorAll('.testimonial-dot').forEach((btn, i) => {
    btn.classList.toggle('active', i === activeTestimonialIndex);
  });
}

function showPrevTestimonial() {
  if (!testimonialsCache.length) return;
  activeTestimonialIndex = (activeTestimonialIndex - 1 + testimonialsCache.length) % testimonialsCache.length;
  renderTestimonialSlide();
  updateActiveDot();
}

function showNextTestimonial() {
  if (!testimonialsCache.length) return;
  activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialsCache.length;
  renderTestimonialSlide();
  updateActiveDot();
}

document.addEventListener('DOMContentLoaded', () => {
  renderTestimonials();
  const prevBtn = document.getElementById('testimonials-prev-btn');
  const nextBtn = document.getElementById('testimonials-next-btn');
  if (prevBtn) prevBtn.addEventListener('click', showPrevTestimonial);
  if (nextBtn) nextBtn.addEventListener('click', showNextTestimonial);
});