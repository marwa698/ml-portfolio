requireAdminAuth();
renderAdminSidebar('experience');

let experienceCache = [];

const employmentLabels = {
  internship: 'Internship',
  training: 'Training Program',
  job: 'Job',
  freelance: 'Freelance',
};

async function loadExperience() {
  try {
    experienceCache = await fetchExperience();
    renderExperienceTable(experienceCache);
  } catch (e) {
    showAdminToast('Failed to load experience entries', 'error');
  }
}

function renderExperienceTable(items) {
  const tbody = document.getElementById('experience-table-body');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">No entries yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = items
    .map(
      (item) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          ${
            item.logoUrl
              ? `<img src="${buildImageUrl(item.logoUrl)}" style="width:28px;height:28px;object-fit:contain;background:#fff;border:1px solid var(--border-color);border-radius:6px;padding:2px;" />`
              : ''
          }
          <span class="admin-row-title">${item.titleEn}</span>
        </div>
      </td>
      <td>${item.organizationEn}</td>
      <td>${employmentLabels[item.employmentType] || item.employmentType}</td>
      <td>${item.periodEn}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditExperienceModal('${item._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteExperience('${item._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

const experienceModal = document.getElementById('experience-modal');
const experienceForm = document.getElementById('experience-form');
const bulletsList = document.getElementById('experience-bullets-list');

// إضافة صف نقطة جديدة (What I Did) في الفورم
function addBulletRow(en = '', ar = '') {
  const row = document.createElement('div');
  row.className = 'bullet-row';
  row.style.cssText = 'display:flex;gap:10px;align-items:center;margin-top:8px;';
  row.innerHTML = `
    <input type="text" class="form-input bullet-en" placeholder="Building and maintaining REST APIs" value="${en.replace(/"/g, '&quot;')}" style="flex:1;" />
    <input type="text" class="form-input bullet-ar" placeholder="بناء وصيانة REST APIs" value="${ar.replace(/"/g, '&quot;')}" dir="rtl" style="flex:1;" />
    <button type="button" class="admin-icon-btn danger remove-bullet-btn" aria-label="Remove"><i class="fa-solid fa-trash"></i></button>
  `;
  row.querySelector('.remove-bullet-btn').addEventListener('click', () => row.remove());
  bulletsList.appendChild(row);
}

document.getElementById('add-bullet-btn').addEventListener('click', () => addBulletRow());

function getBulletsFromForm() {
  return Array.from(bulletsList.querySelectorAll('.bullet-row'))
    .map((row) => ({
      en: row.querySelector('.bullet-en').value.trim(),
      ar: row.querySelector('.bullet-ar').value.trim(),
    }))
    .filter((b) => b.en && b.ar);
}

function openAddExperienceModal() {
  document.getElementById('experience-modal-title').textContent = 'Add entry';
  experienceForm.reset();
  document.getElementById('experience-id').value = '';
  document.getElementById('experience-logo-preview').style.display = 'none';
  bulletsList.innerHTML = '';
  addBulletRow();
  experienceModal.classList.add('show');
}

function openEditExperienceModal(id) {
  const item = experienceCache.find((e) => e._id === id);
  if (!item) return;
  document.getElementById('experience-modal-title').textContent = 'Edit entry';
  document.getElementById('experience-id').value = item._id;
  document.getElementById('experience-titleEn').value = item.titleEn;
  document.getElementById('experience-titleAr').value = item.titleAr;
  document.getElementById('experience-organizationEn').value = item.organizationEn;
  document.getElementById('experience-organizationAr').value = item.organizationAr;
  document.getElementById('experience-employmentType').value = item.employmentType || 'internship';
  document.getElementById('experience-locationType').value = item.locationType || 'remote';
  document.getElementById('experience-periodEn').value = item.periodEn;
  document.getElementById('experience-periodAr').value = item.periodAr;
  document.getElementById('experience-statusEn').value = item.statusEn || '';
  document.getElementById('experience-statusAr').value = item.statusAr || '';
  document.getElementById('experience-highlightEn').value = item.highlightEn || '';
  document.getElementById('experience-highlightAr').value = item.highlightAr || '';
  document.getElementById('experience-descriptionEn').value = item.descriptionEn;
  document.getElementById('experience-descriptionAr').value = item.descriptionAr;
  document.getElementById('experience-technologies').value = (item.technologies || []).join(', ');
  document.getElementById('experience-link').value = item.link || '';
  document.getElementById('experience-order').value = item.order || 0;

  bulletsList.innerHTML = '';
  if (item.bullets && item.bullets.length) {
    item.bullets.forEach((b) => addBulletRow(b.en, b.ar));
  } else {
    addBulletRow();
  }

  const preview = document.getElementById('experience-logo-preview');
  if (item.logoUrl) {
    preview.src = buildImageUrl(item.logoUrl);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  experienceModal.classList.add('show');
}

function closeExperienceModal() {
  experienceModal.classList.remove('show');
}

document.getElementById('add-experience-btn').addEventListener('click', openAddExperienceModal);
document.getElementById('experience-modal-close').addEventListener('click', closeExperienceModal);
document.getElementById('experience-cancel-btn').addEventListener('click', closeExperienceModal);

document.getElementById('experience-logo-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const preview = document.getElementById('experience-logo-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

experienceForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('experience-id').value;
  const submitBtn = document.getElementById('experience-submit-btn');

  const bullets = getBulletsFromForm();
  const technologies = document
    .getElementById('experience-technologies')
    .value.split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const formData = new FormData();
  formData.append('titleEn', document.getElementById('experience-titleEn').value);
  formData.append('titleAr', document.getElementById('experience-titleAr').value);
  formData.append('organizationEn', document.getElementById('experience-organizationEn').value);
  formData.append('organizationAr', document.getElementById('experience-organizationAr').value);
  formData.append('employmentType', document.getElementById('experience-employmentType').value);
  formData.append('locationType', document.getElementById('experience-locationType').value);
  formData.append('periodEn', document.getElementById('experience-periodEn').value);
  formData.append('periodAr', document.getElementById('experience-periodAr').value);
  formData.append('statusEn', document.getElementById('experience-statusEn').value);
  formData.append('statusAr', document.getElementById('experience-statusAr').value);
  formData.append('highlightEn', document.getElementById('experience-highlightEn').value);
  formData.append('highlightAr', document.getElementById('experience-highlightAr').value);
  formData.append('descriptionEn', document.getElementById('experience-descriptionEn').value);
  formData.append('descriptionAr', document.getElementById('experience-descriptionAr').value);
  formData.append('bullets', JSON.stringify(bullets));
  formData.append('technologies', JSON.stringify(technologies));
  formData.append('link', document.getElementById('experience-link').value);
  formData.append('order', document.getElementById('experience-order').value || 0);

  const logoFile = document.getElementById('experience-logo-input').files[0];
  if (logoFile) {
    formData.append('logo', logoFile);
  } else if (!id) {
    showAdminToast('Please select a logo', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (id) {
      await adminApiRequest(`/experience/${id}`, { method: 'PUT', body: formData });
      showAdminToast('Entry updated');
    } else {
      await adminApiRequest('/experience', { method: 'POST', body: formData });
      showAdminToast('Entry added');
    }
    closeExperienceModal();
    loadExperience();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save entry';
  }
});

async function deleteExperience(id) {
  if (!confirm('Delete this experience entry?')) return;
  try {
    await adminApiRequest(`/experience/${id}`, { method: 'DELETE' });
    showAdminToast('Entry deleted');
    loadExperience();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadExperience();