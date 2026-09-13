requireAdminAuth();
renderAdminSidebar('certificates');

let certificatesCache = [];

async function loadCertificates() {
  try {
    certificatesCache = await fetchCertificates();
    renderCertificatesTable(certificatesCache);
  } catch (error) {
    showAdminToast('Failed to load certificates', 'error');
  }
}

function renderCertificatesTable(certificates) {
  const tbody = document.getElementById('certificates-table-body');

  if (!certificates.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">No certificates yet. Click "Add certificate" to create your first one.</td></tr>`;
    return;
  }

  tbody.innerHTML = certificates
    .map(
      (c) => `
    <tr>
      <td>${c.logoUrl ? `<img src="${buildImageUrl(c.logoUrl)}" class="admin-row-thumb" alt="" />` : ''}</td>
      <td class="admin-row-title">${c.titleEn}</td>
      <td>${c.issuerEn}</td>
      <td>${c.year}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditCertificateModal('${c._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteCertificate('${c._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

const certModal = document.getElementById('certificate-modal');
const certForm = document.getElementById('certificate-form');
const projectsList = document.getElementById('certificate-projects-list');

function addProjectRow(en = '', ar = '') {
  const row = document.createElement('div');
  row.className = 'project-row';
  row.style.cssText = 'display:flex;gap:10px;align-items:center;margin-top:8px;';
  row.innerHTML = `
    <input type="text" class="form-input project-en" placeholder="Customer Churn Prediction using SageMaker" value="${en.replace(/"/g, '&quot;')}" style="flex:1;" />
    <input type="text" class="form-input project-ar" placeholder="التنبؤ بمغادرة العملاء باستخدام SageMaker" value="${ar.replace(/"/g, '&quot;')}" dir="rtl" style="flex:1;" />
    <button type="button" class="admin-icon-btn danger remove-project-btn" aria-label="Remove"><i class="fa-solid fa-trash"></i></button>
  `;
  row.querySelector('.remove-project-btn').addEventListener('click', () => row.remove());
  projectsList.appendChild(row);
}

document.getElementById('add-project-btn').addEventListener('click', () => addProjectRow());

function getProjectsFromForm() {
  return Array.from(projectsList.querySelectorAll('.project-row'))
    .map((row) => ({
      en: row.querySelector('.project-en').value.trim(),
      ar: row.querySelector('.project-ar').value.trim(),
    }))
    .filter((p) => p.en && p.ar);
}

function openAddCertificateModal() {
  document.getElementById('certificate-modal-title').textContent = 'Add certificate';
  certForm.reset();
  document.getElementById('certificate-id').value = '';
  document.getElementById('certificate-logo-preview').style.display = 'none';
  document.getElementById('certificate-cert-image-preview').style.display = 'none';
  projectsList.innerHTML = '';
  certModal.classList.add('show');
}

function openEditCertificateModal(id) {
  const cert = certificatesCache.find((c) => c._id === id);
  if (!cert) return;

  document.getElementById('certificate-modal-title').textContent = 'Edit certificate';
  document.getElementById('certificate-id').value = cert._id;
  document.getElementById('certificate-titleEn').value = cert.titleEn;
  document.getElementById('certificate-titleAr').value = cert.titleAr;
  document.getElementById('certificate-issuerEn').value = cert.issuerEn;
  document.getElementById('certificate-issuerAr').value = cert.issuerAr;
  document.getElementById('certificate-year').value = cert.year;
  document.getElementById('certificate-link').value = cert.verificationLink || '';
  document.getElementById('certificate-order').value = cert.order || 0;
  document.getElementById('certificate-descriptionEn').value = cert.descriptionEn || '';
  document.getElementById('certificate-descriptionAr').value = cert.descriptionAr || '';

  projectsList.innerHTML = '';
  (cert.relatedProjects || []).forEach((p) => addProjectRow(p.en, p.ar));

  const logoPreview = document.getElementById('certificate-logo-preview');
  if (cert.logoUrl) {
    logoPreview.src = buildImageUrl(cert.logoUrl);
    logoPreview.style.display = 'block';
  } else {
    logoPreview.style.display = 'none';
  }

  const certImgPreview = document.getElementById('certificate-cert-image-preview');
  if (cert.certificateImageUrl) {
    certImgPreview.src = buildImageUrl(cert.certificateImageUrl);
    certImgPreview.style.display = 'block';
  } else {
    certImgPreview.style.display = 'none';
  }

  certModal.classList.add('show');
}

function closeCertificateModal() {
  certModal.classList.remove('show');
}

document.getElementById('add-certificate-btn').addEventListener('click', openAddCertificateModal);
document.getElementById('certificate-modal-close').addEventListener('click', closeCertificateModal);
document.getElementById('certificate-cancel-btn').addEventListener('click', closeCertificateModal);

document.getElementById('certificate-logo').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('certificate-logo-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

document.getElementById('certificate-cert-image').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('certificate-cert-image-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

certForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('certificate-id').value;
  const submitBtn = document.getElementById('certificate-submit-btn');

  const formData = new FormData();
  formData.append('titleEn', document.getElementById('certificate-titleEn').value);
  formData.append('titleAr', document.getElementById('certificate-titleAr').value);
  formData.append('issuerEn', document.getElementById('certificate-issuerEn').value);
  formData.append('issuerAr', document.getElementById('certificate-issuerAr').value);
  formData.append('year', document.getElementById('certificate-year').value);
  formData.append('verificationLink', document.getElementById('certificate-link').value);
  formData.append('order', document.getElementById('certificate-order').value);
  formData.append('descriptionEn', document.getElementById('certificate-descriptionEn').value);
  formData.append('descriptionAr', document.getElementById('certificate-descriptionAr').value);
  formData.append('relatedProjects', JSON.stringify(getProjectsFromForm()));

  const logoFile = document.getElementById('certificate-logo').files[0];
  if (logoFile) formData.append('logo', logoFile);

  const certImageFile = document.getElementById('certificate-cert-image').files[0];
  if (certImageFile) formData.append('certificateImage', certImageFile);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (id) {
      await adminApiRequest(`/certificates/${id}`, { method: 'PUT', body: formData });
      showAdminToast('Certificate updated');
    } else {
      if (!logoFile) {
        throw new Error('Issuer logo is required');
      }
      await adminApiRequest('/certificates', { method: 'POST', body: formData });
      showAdminToast('Certificate added');
    }

    closeCertificateModal();
    loadCertificates();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save certificate';
  }
});

async function deleteCertificate(id) {
  if (!confirm('Are you sure you want to delete this certificate?')) return;

  try {
    await adminApiRequest(`/certificates/${id}`, { method: 'DELETE' });
    showAdminToast('Certificate deleted');
    loadCertificates();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadCertificates();