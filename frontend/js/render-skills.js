// عرض قسم المهارات (Skills) في الصفحة الرئيسية بجلبها من الباك إند

async function renderSkills() {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  const skills = await fetchSkills();

  if (!skills.length) {
    container.innerHTML = `<p class="empty-state" data-en="No skills added yet" data-ar="لم تتم إضافة مهارات بعد">لم تتم إضافة مهارات بعد</p>`;
    return;
  }

  container.innerHTML = skills.map(renderSkillCard).join('');
}

function renderSkillCard(skill) {
  return `
    <div class="skill-card">
      <div class="skill-icon"><i class="${skill.icon}"></i></div>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-bar">
        <div class="skill-bar-fill" style="width: ${skill.proficiency}%"></div>
      </div>
      <div class="skill-pct">${skill.proficiency}%</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderSkills);