// عرض تفاصيل مشروع واحد في صفحة project-details.html
// الـ id بييجي من رابط الصفحة، مثلاً: project-details.html?id=123abc

async function renderProjectDetails() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  const container = document.getElementById('details-container');
  if (!container) return;

  if (!projectId) {
    container.innerHTML = `<p class="empty-state" data-en="Project not found" data-ar="المشروع غير موجود">Project not found</p>`;
    return;
  }

  const project = await fetchProjectById(projectId);

  if (!project) {
    container.innerHTML = `<p class="empty-state" data-en="Project not found" data-ar="المشروع غير موجود">Project not found</p>`;
    return;
  }

  document.title = `${project.title} | Marwa Yousry`;

  const imageUrl = project.imageUrl ? buildImageUrl(project.imageUrl) : '';
  const fullDetails = project.fullDetails || {};

  container.innerHTML = `
    <div class="details-header">
      <div class="details-title-group">
        <span class="project-tag">${project.category}</span>
        <h1 class="details-title">${project.title}</h1>
      </div>
      <div class="details-actions">
        ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="btn btn-outline"><i class="fa-brands fa-github"></i> <span data-en="View Code" data-ar="عرض الكود">View Code</span></a>` : ''}
        ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="btn btn-primary"><span data-en="Live Demo" data-ar="عرض مباشر">Live Demo</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
    </div>

    ${imageUrl ? `<div class="details-cover"><img src="${imageUrl}" alt="${project.title}" /></div>` : ''}

    <div class="details-body">
      <div class="details-main">
        <div class="details-block">
          <h3 class="details-block-title"><i class="fa-solid fa-align-left"></i> <span data-en="Overview" data-ar="نظرة عامة">Overview</span></h3>
          <p class="details-block-text">${project.description}</p>
        </div>

        ${
          fullDetails.problem
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-triangle-exclamation"></i> <span data-en="The Problem" data-ar="المشكلة">The Problem</span></h3>
                <p class="details-block-text">${fullDetails.problem}</p>
              </div>`
            : ''
        }

        ${
          fullDetails.solution
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-lightbulb"></i> <span data-en="The Solution" data-ar="الحل">The Solution</span></h3>
                <p class="details-block-text">${fullDetails.solution}</p>
              </div>`
            : ''
        }

        ${
          fullDetails.results
            ? `<div class="details-block">
                <h3 class="details-block-title"><i class="fa-solid fa-chart-line"></i> <span data-en="Results" data-ar="النتائج">Results</span></h3>
                <p class="details-block-text">${fullDetails.results}</p>
              </div>`
            : ''
        }
      </div>

      <div class="details-sidebar">
        <div class="card">
          <div class="sidebar-label" data-en="Technologies" data-ar="التقنيات المستخدمة">Technologies</div>
          <div class="tech-pills">
            ${(project.technologies || []).map((t) => `<span class="tech-pill">${t}</span>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="sidebar-label" data-en="Project Links" data-ar="روابط المشروع">Project Links</div>
          ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="sidebar-link-row"><i class="fa-brands fa-github"></i> <span data-en="GitHub Repository" data-ar="مستودع GitHub">GitHub Repository</span></a>` : ''}
          ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="sidebar-link-row"><i class="fa-solid fa-globe"></i> <span data-en="Live Demo" data-ar="عرض مباشر">Live Demo</span></a>` : ''}
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderProjectDetails);