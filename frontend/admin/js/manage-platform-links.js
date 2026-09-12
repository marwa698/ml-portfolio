requireAdminAuth();
renderAdminSidebar('platform-links');

let platformsCache = [];

async function loadPlatforms() {
  try {
    platformsCache = await fetchPlatformLinks();
    renderPlatformsTable(platformsCache);
  } catch (e) {
    showAdminToast('Failed to load platform links', 'error');
  }
}

function renderPlatformsTable(items) {
  const tbody = document.getElementById('platform-table-body');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="admin-empty">No platforms yet.</td></tr>`;
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
          <span class="admin-row-title">${item.name}</span>
        </div>
      </td>
      <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.url}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditPlatformModal('${item._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deletePlatform('${item._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

const platformModal = document.getElementById('platform-modal');
const platformForm = document.getElementById('platform-form');

function openAddPlatformModal() {
  document.getElementById('platform-modal-title').textContent = 'Add platform';
  platformForm.reset();
  document.getElementById('platform-id').value = '';
  document.getElementById('platform-logo-preview').style.display = 'none';
  platformModal.classList.add('show');
}

function openEditPlatformModal(id) {
  const item = platformsCache.find((p) => p._id === id);
  if (!item) return;
  document.getElementById('platform-modal-title').textContent = 'Edit platform';
  document.getElementById('platform-id').value = item._id;
  document.getElementById('platform-name').value = item.name;
  document.getElementById('platform-url').value = item.url;
  document.getElementById('platform-order').value = item.order || 0;

  const preview = document.getElementById('platform-logo-preview');
  if (item.logoUrl) {
    preview.src = buildImageUrl(item.logoUrl);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  platformModal.classList.add('show');
}

function closePlatformModal() {
  platformModal.classList.remove('show');
}

document.getElementById('add-platform-btn').addEventListener('click', openAddPlatformModal);
document.getElementById('platform-modal-close').addEventListener('click', closePlatformModal);
document.getElementById('platform-cancel-btn').addEventListener('click', closePlatformModal);

document.getElementById('platform-logo-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const preview = document.getElementById('platform-logo-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

platformForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('platform-id').value;
  const submitBtn = document.getElementById('platform-submit-btn');

  const formData = new FormData();
  formData.append('name', document.getElementById('platform-name').value);
  formData.append('url', document.getElementById('platform-url').value);
  formData.append('order', document.getElementById('platform-order').value || 0);

  const logoFile = document.getElementById('platform-logo-input').files[0];
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
      await adminApiRequest(`/platform-links/${id}`, { method: 'PUT', body: formData });
      showAdminToast('Platform updated');
    } else {
      await adminApiRequest('/platform-links', { method: 'POST', body: formData });
      showAdminToast('Platform added');
    }
    closePlatformModal();
    loadPlatforms();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save platform';
  }
});

async function deletePlatform(id) {
  if (!confirm('Delete this platform link?')) return;
  try {
    await adminApiRequest(`/platform-links/${id}`, { method: 'DELETE' });
    showAdminToast('Platform deleted');
    loadPlatforms();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadPlatforms();