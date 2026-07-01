// عرض المشاريع المميزة في الصفحة الرئيسية (أول 4 مشاريع منشورة)
// نفس الدالة بتستخدم في projects.html لعرض كل المشاريع، بس بدون حد أقصى

async function renderFeaturedProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const projects = await fetchProjects();

  if (!projects.length) {
    container.innerHTML = `<p class="empty-state" data-en="No projects yet" data-ar="لا توجد مشاريع بعد">لا توجد مشاريع بعد</p>`;
    return;
  }

  // في الصفحة الرئيسية نعرض أول 4 بس
  const featured = projects.slice(0, 4);

  container.innerHTML = featured.map(renderProjectCard).join('');
}

function renderProjectCard(project) {
  const imageUrl = project.imageUrl ? buildImageUrl(project.imageUrl) : '';
  const techList = (project.technologies || []).slice(0, 3).join(' · ');

  return `
    <div class="project-card" onclick="window.location.href='project-details.html?id=${project._id}'">
      <div class="project-img-wrap">
        ${imageUrl ? `<img src="${imageUrl}" alt="${project.title}" loading="lazy" />` : ''}
        <span class="project-tag">${project.category}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.shortDescription}</p>
        <div class="project-links">
          ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" onclick="event.stopPropagation()" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
          ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" onclick="event.stopPropagation()" aria-label="Live demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderFeaturedProjects);