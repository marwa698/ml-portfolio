requireAdminAuth();
renderAdminSidebar('achievements');

let achievementCache = [];

async function loadAchievements() {
  try {
    achievementCache = await fetchAchievements();
    renderAchievementTable(achievementCache);
  } catch (e) {
    showAdminToast('Failed to load achievements', 'error');
  }
}

function renderAchievementTable(items) {
  const tbody = document.getElementById('achievement-table-body');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="admin-empty">No entries yet.</td></tr>`;
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
      <td>${item.subtitleEn}</td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditAchievementModal('${item._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteAchievement('${item._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

const achievementModal = document.getElementById('achievement-modal');
const achievementForm = document.getElementById('achievement-form');

function openAddAchievementModal() {
  document.getElementById('achievement-modal-title').textContent = 'Add entry';
  achievementForm.reset();
  document.getElementById('achievement-id').value = '';
  document.getElementById('achievement-logo-preview').style.display = 'none';
  achievementModal.classList.add('show');
}

function openEditAchievementModal(id) {
  const item = achievementCache.find((a) => a._id === id);
  if (!item) return;
  document.getElementById('achievement-modal-title').textContent = 'Edit entry';
  document.getElementById('achievement-id').value = item._id;
  document.getElementById('achievement-titleEn').value = item.titleEn;
  document.getElementById('achievement-titleAr').value = item.titleAr;
  document.getElementById('achievement-subtitleEn').value = item.subtitleEn;
  document.getElementById('achievement-subtitleAr').value = item.subtitleAr;
  document.getElementById('achievement-descriptionEn').value = item.descriptionEn;
  document.getElementById('achievement-descriptionAr').value = item.descriptionAr;
  document.getElementById('achievement-link').value = item.link || '';
  document.getElementById('achievement-order').value = item.order || 0;

  const preview = document.getElementById('achievement-logo-preview');
  if (item.logoUrl) {
    preview.src = buildImageUrl(item.logoUrl);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  achievementModal.classList.add('show');
}

function closeAchievementModal() {
  achievementModal.classList.remove('show');
}

document.getElementById('add-achievement-btn').addEventListener('click', openAddAchievementModal);
document.getElementById('achievement-modal-close').addEventListener('click', closeAchievementModal);
document.getElementById('achievement-cancel-btn').addEventListener('click', closeAchievementModal);

document.getElementById('achievement-logo-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const preview = document.getElementById('achievement-logo-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

achievementForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('achievement-id').value;
  const submitBtn = document.getElementById('achievement-submit-btn');

  const formData = new FormData();
  formData.append('titleEn', document.getElementById('achievement-titleEn').value);
  formData.append('titleAr', document.getElementById('achievement-titleAr').value);
  formData.append('subtitleEn', document.getElementById('achievement-subtitleEn').value);
  formData.append('subtitleAr', document.getElementById('achievement-subtitleAr').value);
  formData.append('descriptionEn', document.getElementById('achievement-descriptionEn').value);
  formData.append('descriptionAr', document.getElementById('achievement-descriptionAr').value);
  formData.append('link', document.getElementById('achievement-link').value);
  formData.append('order', document.getElementById('achievement-order').value || 0);

  const logoFile = document.getElementById('achievement-logo-input').files[0];
  if (logoFile) {
    formData.append('logo', logoFile);
  } else if (!id) {
    showAdminToast('Please select an icon/logo', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (id) {
      await adminApiRequest(`/achievements/${id}`, { method: 'PUT', body: formData });
      showAdminToast('Entry updated');
    } else {
      await adminApiRequest('/achievements', { method: 'POST', body: formData });
      showAdminToast('Entry added');
    }
    closeAchievementModal();
    loadAchievements();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save entry';
  }
});

async function deleteAchievement(id) {
  if (!confirm('Delete this achievement?')) return;
  try {
    await adminApiRequest(`/achievements/${id}`, { method: 'DELETE' });
    showAdminToast('Entry deleted');
    loadAchievements();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadAchievements();