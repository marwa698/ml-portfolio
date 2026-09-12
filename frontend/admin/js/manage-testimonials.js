requireAdminAuth();
renderAdminSidebar('testimonials');

let testimonialsCache = [];

async function loadTestimonials() {
  try {
    testimonialsCache = await fetchTestimonials();
    renderTestimonialsTable(testimonialsCache);
  } catch (e) {
    showAdminToast('Failed to load testimonials', 'error');
  }
}

function renderTestimonialsTable(items) {
  const tbody = document.getElementById('testimonials-table-body');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="admin-empty">No testimonials yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = items
    .map(
      (item) => `
    <tr>
      <td>
        <span class="admin-row-title">${item.clientName}</span>
        ${item.role ? `<div style="font-size:12px;color:var(--text-muted);">${item.role}</div>` : ''}
      </td>
      <td>${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</td>
      <td style="max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.quote}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditTestimonialModal('${item._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteTestimonial('${item._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

const testimonialModal = document.getElementById('testimonial-modal');
const testimonialForm = document.getElementById('testimonial-form');

function openAddTestimonialModal() {
  document.getElementById('testimonial-modal-title').textContent = 'Add testimonial';
  testimonialForm.reset();
  document.getElementById('testimonial-id').value = '';
  document.getElementById('testimonial-rating').value = 5;
  document.getElementById('testimonial-rating-display').textContent = '5';
  testimonialModal.classList.add('show');
}

function openEditTestimonialModal(id) {
  const item = testimonialsCache.find((t) => t._id === id);
  if (!item) return;
  document.getElementById('testimonial-modal-title').textContent = 'Edit testimonial';
  document.getElementById('testimonial-id').value = item._id;
  document.getElementById('testimonial-client-name').value = item.clientName;
  document.getElementById('testimonial-role').value = item.role || '';
  document.getElementById('testimonial-tag').value = item.tag || '';
  document.getElementById('testimonial-rating').value = item.rating;
  document.getElementById('testimonial-rating-display').textContent = item.rating;
  document.getElementById('testimonial-quote').value = item.quote;
  document.getElementById('testimonial-link').value = item.verificationLink || '';
  document.getElementById('testimonial-order').value = item.order || 0;
  testimonialModal.classList.add('show');
}

function closeTestimonialModal() {
  testimonialModal.classList.remove('show');
}

document.getElementById('add-testimonial-btn').addEventListener('click', openAddTestimonialModal);
document.getElementById('testimonial-modal-close').addEventListener('click', closeTestimonialModal);
document.getElementById('testimonial-cancel-btn').addEventListener('click', closeTestimonialModal);

testimonialForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('testimonial-id').value;
  const submitBtn = document.getElementById('testimonial-submit-btn');

  const payload = {
    clientName: document.getElementById('testimonial-client-name').value,
    role: document.getElementById('testimonial-role').value,
    tag: document.getElementById('testimonial-tag').value,
    rating: parseInt(document.getElementById('testimonial-rating').value),
    quote: document.getElementById('testimonial-quote').value,
    verificationLink: document.getElementById('testimonial-link').value,
    order: parseInt(document.getElementById('testimonial-order').value) || 0,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (id) {
      await adminApiRequest(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showAdminToast('Testimonial updated');
    } else {
      await adminApiRequest('/testimonials', { method: 'POST', body: JSON.stringify(payload) });
      showAdminToast('Testimonial added');
    }
    closeTestimonialModal();
    loadTestimonials();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save testimonial';
  }
});

async function deleteTestimonial(id) {
  if (!confirm('Delete this testimonial?')) return;
  try {
    await adminApiRequest(`/testimonials/${id}`, { method: 'DELETE' });
    showAdminToast('Testimonial deleted');
    loadTestimonials();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadTestimonials();