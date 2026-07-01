
requireAdminAuth();
renderAdminSidebar('skills');

let skillsCache = [];

async function loadSkills() {
  try {
    skillsCache = await fetchSkills();
    renderSkillsTable(skillsCache);
  } catch (e) {
    showAdminToast('Failed to load skills', 'error');
  }
}

function renderSkillsTable(skills) {
  const tbody = document.getElementById('skills-table-body');
  if (!skills.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="admin-empty">No skills yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = skills.map((s) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <i class="${s.icon}" style="font-size:20px;width:24px;text-align:center;color:var(--accent-purple);"></i>
          <span class="admin-row-title">${s.name}</span>
        </div>
      </td>
      <td>${s.category}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="flex:1;height:6px;background:var(--border-color);border-radius:3px;overflow:hidden;">
            <div style="width:${s.proficiency}%;height:100%;background:var(--gradient-main);border-radius:3px;"></div>
          </div>
          <span style="font-size:12px;color:var(--text-muted);">${s.proficiency}%</span>
        </div>
      </td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-icon-btn" onclick="openEditSkillModal('${s._id}')" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-icon-btn danger" onclick="deleteSkill('${s._id}')" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

const skillModal = document.getElementById('skill-modal');
const skillForm = document.getElementById('skill-form');

function openAddSkillModal() {
  document.getElementById('skill-modal-title').textContent = 'Add skill';
  skillForm.reset();
  document.getElementById('skill-id').value = '';
  document.getElementById('skill-proficiency').value = 80;
  document.getElementById('proficiency-display').textContent = '80';
  skillModal.classList.add('show');
}

function openEditSkillModal(id) {
  const skill = skillsCache.find((s) => s._id === id);
  if (!skill) return;
  document.getElementById('skill-modal-title').textContent = 'Edit skill';
  document.getElementById('skill-id').value = skill._id;
  document.getElementById('skill-name').value = skill.name;
  document.getElementById('skill-icon').value = skill.icon;
  document.getElementById('skill-category').value = skill.category;
  document.getElementById('skill-proficiency').value = skill.proficiency;
  document.getElementById('proficiency-display').textContent = skill.proficiency;
  document.getElementById('skill-order').value = skill.order || 0;
  skillModal.classList.add('show');
}

function closeSkillModal() { skillModal.classList.remove('show'); }

document.getElementById('add-skill-btn').addEventListener('click', openAddSkillModal);
document.getElementById('skill-modal-close').addEventListener('click', closeSkillModal);
document.getElementById('skill-cancel-btn').addEventListener('click', closeSkillModal);

skillForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('skill-id').value;
  const submitBtn = document.getElementById('skill-submit-btn');

  const payload = {
    name: document.getElementById('skill-name').value,
    icon: document.getElementById('skill-icon').value,
    category: document.getElementById('skill-category').value,
    proficiency: parseInt(document.getElementById('skill-proficiency').value),
    order: parseInt(document.getElementById('skill-order').value) || 0,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (id) {
      await adminApiRequest(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showAdminToast('Skill updated');
    } else {
      await adminApiRequest('/skills', { method: 'POST', body: JSON.stringify(payload) });
      showAdminToast('Skill added');
    }
    closeSkillModal();
    loadSkills();
  } catch (error) {
    showAdminToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save skill';
  }
});

async function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  try {
    await adminApiRequest(`/skills/${id}`, { method: 'DELETE' });
    showAdminToast('Skill deleted');
    loadSkills();
  } catch (error) {
    showAdminToast(error.message, 'error');
  }
}

loadSkills();