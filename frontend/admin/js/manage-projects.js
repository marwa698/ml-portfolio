// منطق صفحة إدارة المشاريع: عرض الجدول، فتح المودال، حفظ، حذف

requireAdminAuth();
renderAdminSidebar('projects');

let projectsCache = [];

// === تحميل وعرض المشاريع ===
async function loadProjects() {
  try {
    projectsCache = await adminApiRequest('/projects/admin/all');
    renderProjectsTable(projectsCache);
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projects-table-body');

  if (!projects.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">No projects yet. Click "Add project" to create your first one.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects
    .map(
      (p) => `
    <tr>
      <td>${p.imageUrl ? `<img src="${buildImageUrl(p.imageUrl)}" class="admin-row-thumb" alt="" />` : ''}</td>
      <td class="admin-row-title">${p.title}</td>
      <td>${p.category}</td>
      <td>
        ${
          p.published
            ? '<span class="admin-badge admin-badge-published">Published</span>'
            : '<span class="admin-badge admin-badge-draft">Draft</span>'
        }
      </td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditProjectModal('${p._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteProject('${p._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

// === فتح / قفل المودال ===
const modal = document.getElementById('project-modal');
const form = document.getElementById('project-form');

function openAddProjectModal() {
  document.getElementById('project-modal-title').textContent = 'Add project';
  form.reset();
  document.getElementById('project-id').value = '';
  document.getElementById('project-image-preview').style.display = 'none';
  document.getElementById('project-published').checked = true;
  modal.classList.add('show');
}

function openEditProjectModal(id) {
  const project = projectsCache.find((p) => p._id === id);
  if (!project) return;

  document.getElementById('project-modal-title').textContent = 'Edit project';
  document.getElementById('project-id').value = project._id;
  document.getElementById('project-title').value = project.title;
  document.getElementById('project-category').value = project.category;
  document.getElementById('project-order').value = project.order || 0;
  document.getElementById('project-short-desc').value = project.shortDescription;
  document.getElementById('project-description').value = project.description;
  document.getElementById('project-problem').value = (project.fullDetails && project.fullDetails.problem) || '';
  document.getElementById('project-solution').value = (project.fullDetails && project.fullDetails.solution) || '';
  document.getElementById('project-results').value = (project.fullDetails && project.fullDetails.results) || '';
  document.getElementById('project-technologies').value = (project.technologies || []).join(', ');
  document.getElementById('project-github').value = project.githubLink || '';
  document.getElementById('project-live').value = project.liveLink || '';
  document.getElementById('project-published').checked = project.published;

  const preview = document.getElementById('project-image-preview');
  if (project.imageUrl) {
    preview.src = buildImageUrl(project.imageUrl);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  modal.classList.add('show');
}

function closeProjectModal() {
  modal.classList.remove('show');
}

document.getElementById('add-project-btn').addEventListener('click', openAddProjectModal);
document.getElementById('project-modal-close').addEventListener('click', closeProjectModal);
document.getElementById('project-cancel-btn').addEventListener('click', closeProjectModal);

// معاينة الصورة فور اختيارها
document.getElementById('project-image').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('project-image-preview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

// === حفظ المشروع (إضافة أو تعديل) ===
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('project-id').value;
  const submitBtn = document.getElementById('project-submit-btn');

  const formData = new FormData();
  formData.append('title', document.getElementById('project-title').value);
  formData.append('category', document.getElementById('project-category').value);
  formData.append('order', document.getElementById('project-order').value);
  formData.append('shortDescription', document.getElementById('project-short-desc').value);
  formData.append('description', document.getElementById('project-description').value);
  formData.append('technologies', document.getElementById('project-technologies').value);
  formData.append('githubLink', document.getElementById('project-github').value);
  formData.append('liveLink', document.getElementById('project-live').value);
  formData.append('published', document.getElementById('project-published').checked);

  // الحقول المتداخلة (fullDetails) بنبعتها كـ JSON string، والباك إند الحالي بيستقبلها مباشرة كحقول مسطحة
  // فبنبعتها بصيغة تتوافق مع الـ controller الحالي (problem/solution/results داخل fullDetails)
  formData.append(
    'fullDetails',
    JSON.stringify({
      problem: document.getElementById('project-problem').value,
      solution: document.getElementById('project-solution').value,
      results: document.getElementById('project-results').value,
    })
  );

  const imageFile = document.getElementById('project-image').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (id) {
      await adminApiRequest(`/projects/${id}`, { method: 'PUT', body: formData });
      showAdminToast('Project updated');
    } else {
      if (!imageFile) {
        throw new Error('Project image is required');
      }
      await adminApiRequest('/projects', { method: 'POST', body: formData });
      showAdminToast('Project added');
    }

    closeProjectModal();
    loadProjects();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save project';
  }
});

// === حذف مشروع ===
async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;

  try {
    await adminApiRequest(`/projects/${id}`, { method: 'DELETE' });
    showAdminToast('Project deleted');
    loadProjects();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadProjects();