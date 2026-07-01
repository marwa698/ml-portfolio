// عرض كل المشاريع في صفحة projects.html مع نظام فلترة حسب التصنيف

let allProjectsCache = [];

async function renderAllProjects() {
  const container = document.getElementById('all-projects-grid');
  if (!container) return;

  allProjectsCache = await fetchProjects();

  if (!allProjectsCache.length) {
    container.innerHTML = `<p class="empty-state" data-en="No projects yet" data-ar="لا توجد مشاريع بعد">لا توجد مشاريع بعد</p>`;
    return;
  }

  buildFilterButtons(allProjectsCache);
  displayProjects(allProjectsCache);
}

function buildFilterButtons(projects) {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  filterBar.innerHTML = categories
    .map(
      (cat, i) =>
        `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-category="${cat}">${cat === 'All' ? '<span data-en="All" data-ar="الكل">All</span>' : cat}</button>`
    )
    .join('');

  filterBar.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      const filtered = category === 'All' ? allProjectsCache : allProjectsCache.filter((p) => p.category === category);
      displayProjects(filtered);
    });
  });
}

function displayProjects(projects) {
  const container = document.getElementById('all-projects-grid');
  if (!container) return;

  if (!projects.length) {
    container.innerHTML = `<p class="empty-state" data-en="No projects in this category" data-ar="لا توجد مشاريع في هذا التصنيف">لا توجد مشاريع في هذا التصنيف</p>`;
    return;
  }

  container.innerHTML = projects.map(renderProjectCard).join('');
}

document.addEventListener('DOMContentLoaded', renderAllProjects);