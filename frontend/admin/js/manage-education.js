requireAdminAuth();
renderAdminSidebar('education');

let educationCache = [];

async function loadEducation() {
  try {
    educationCache = await fetchEducation();
    renderEducationTable(educationCache);
  } catch (e) {
    showAdminToast('Failed to load education entries', 'error');
  }
}

function renderEducationTable(items) {
  const tbody = document.getElementById('education-table-body');
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
          <span class="admin-row-title">${item.institutionEn}</span>
        </div>
      </td>
      <td>${item.programEn}</td>
      <td>${item.type}</td>
      <td>${item.periodEn}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditEducationModal('${item._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteEducation('${item._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

const educationModal = document.getElementById('education-modal');
const educationForm = document.getElementById('education-form');

function openAddEducationModal() {
  document.getElementById('education-modal-title').textContent = 'Add entry';
  educationForm.reset();
  document.getElementById('education-id').value = '';
  document.getElementById('education-logo-preview').style.display = 'none';
  educationModal.classList.add('show');
}

function openEditEducationModal(id) {
  const item = educationCache.find((e) => e._id === id);
  if (!item) return;
  document.getElementById('education-modal-title').textContent = 'Edit entry';
  document.getElementById('education-id').value = item._id;
  document.getElementById('education-institutionEn').value = item.institutionEn;
  document.getElementById('education-institutionAr').value = item.institutionAr;
  document.getElementById('education-programEn').value = item.programEn;
  document.getElementById('education-programAr').value = item.programAr;
  document.getElementById('education-periodEn').value = item.periodEn;
  document.getElementById('education-periodAr').value = item.periodAr;
  document.getElementById('education-type').value = item.type || 'Online Course';
  document.getElementById('education-statusEn').value = item.statusEn || '';
  document.getElementById('education-statusAr').value = item.statusAr || '';
  document.getElementById('education-descriptionEn').value = item.descriptionEn || '';
  document.getElementById('education-descriptionAr').value = item.descriptionAr || '';
  document.getElementById('education-link').value = item.link || '';
  document.getElementById('education-order').value = item.order || 0;

  const preview = document.getElementById('education-logo-preview');
  if (item.logoUrl) {
    preview.src = buildImageUrl(item.logoUrl);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  educationModal.classList.add('show');
}

function closeEducationModal() {
  educationModal.classList.remove('show');
}

document.getElementById('add-education-btn').addEventListener('click', openAddEducationModal);
document.getElementById('education-modal-close').addEventListener('click', closeEducationModal);
document.getElementById('education-cancel-btn').addEventListener('click', closeEducationModal);

document.getElementById('education-logo-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const preview = document.getElementById('education-logo-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

educationForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('education-id').value;
  const submitBtn = document.getElementById('education-submit-btn');

  const formData = new FormData();
  formData.append('institutionEn', document.getElementById('education-institutionEn').value);
  formData.append('institutionAr', document.getElementById('education-institutionAr').value);
  formData.append('programEn', document.getElementById('education-programEn').value);
  formData.append('programAr', document.getElementById('education-programAr').value);
  formData.append('periodEn', document.getElementById('education-periodEn').value);
  formData.append('periodAr', document.getElementById('education-periodAr').value);
  formData.append('type', document.getElementById('education-type').value);
  formData.append('statusEn', document.getElementById('education-statusEn').value);
  formData.append('statusAr', document.getElementById('education-statusAr').value);
  formData.append('descriptionEn', document.getElementById('education-descriptionEn').value);
  formData.append('descriptionAr', document.getElementById('education-descriptionAr').value);
  formData.append('link', document.getElementById('education-link').value);
  formData.append('order', document.getElementById('education-order').value || 0);

  const logoFile = document.getElementById('education-logo-input').files[0];
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
      await adminApiRequest(`/education/${id}`, { method: 'PUT', body: formData });
      showAdminToast('Entry updated');
    } else {
      await adminApiRequest('/education', { method: 'POST', body: formData });
      showAdminToast('Entry added');
    }
    closeEducationModal();
    loadEducation();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save entry';
  }
});

async function deleteEducation(id) {
  if (!confirm('Delete this education entry?')) return;
  try {
    await adminApiRequest(`/education/${id}`, { method: 'DELETE' });
    showAdminToast('Entry deleted');
    loadEducation();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadEducation();